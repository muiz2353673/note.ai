const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

// Subscription plans
const PLANS = {
  free: {
    priceId: null, // No Stripe price ID for free plan
    features: {
      aiSummaries: 5,
      flashcardGeneration: 3,
      assignmentHelp: 2,
      citations: 10,
    },
  },
  student: {
    priceId: process.env.STRIPE_STUDENT_PRICE_ID || "price_student_monthly",
    features: {
      aiSummaries: 100,
      flashcardGeneration: 50,
      assignmentHelp: 25,
      citations: 200,
    },
  },
  university: {
    priceId:
      process.env.STRIPE_UNIVERSITY_PRICE_ID || "price_university_monthly",
    features: {
      aiSummaries: -1, // unlimited
      flashcardGeneration: -1,
      assignmentHelp: -1,
      citations: -1,
    },
  },
};

// Create subscription
router.post("/create", auth, async (req, res) => {
  try {
    const { plan, paymentMethodId } = req.body;

    if (!PLANS[plan]) {
      return res.status(400).json({ error: "Invalid plan" });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Handle free plan (no Stripe payment needed)
    if (plan === "free") {
      user.subscription = {
        plan,
        status: "active",
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        features: PLANS[plan].features,
      };
      await user.save();

      return res.json({
        subscriptionId: null,
        clientSecret: null,
        subscription: user.subscription,
      });
    }

    // Create or get Stripe customer
    let customerId = user.subscription.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        metadata: {
          userId: user._id.toString(),
        },
      });
      customerId = customer.id;
    }

    // Attach payment method to customer
    if (paymentMethodId) {
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
      });

      await stripe.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });
    }

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: PLANS[plan].priceId }],
      payment_behavior: "default_incomplete",
      payment_settings: { save_default_payment_method: "on_subscription" },
      expand: ["latest_invoice.payment_intent"],
    });

    // Update user subscription
    user.subscription = {
      plan,
      status: "active",
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.id,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      features: PLANS[plan].features,
    };

    await user.save();

    res.json({
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
      subscription: user.subscription,
    });
  } catch (error) {
    console.error("Create subscription error:", error);
    res.status(500).json({ error: "Failed to create subscription" });
  }
});

// Get subscription status
router.get("/status", auth, async (req, res) => {
  try {
    console.log("Fetching subscription status for user:", req.user.userId);
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Ensure user has subscription data
    if (!user.subscription) {
      user.subscription = {
        plan: "free",
        status: "active",
        features: {
          aiSummaries: 5,
          flashcardGeneration: 3,
          assignmentHelp: 2,
          citations: 10,
        },
      };
      await user.save();
    }

    // Ensure user has usage data
    if (!user.usage) {
      user.usage = {
        totalNotes: 0,
        totalSummaries: 0,
        totalFlashcards: 0,
        totalAssignments: 0,
        totalCitations: 0,
        lastActive: new Date(),
      };
      await user.save();
    }

    if (user.subscription.stripeSubscriptionId) {
      try {
        const stripeSubscription = await stripe.subscriptions.retrieve(
          user.subscription.stripeSubscriptionId
        );

        // Update subscription status
        user.subscription.status = stripeSubscription.status;
        user.subscription.currentPeriodEnd = new Date(
          stripeSubscription.current_period_end * 1000
        );
        await user.save();
      } catch (stripeError) {
        console.error("Stripe error:", stripeError);
        // Continue with local subscription data if Stripe fails
      }
    }

    console.log("Returning subscription data:", {
      subscription: user.subscription,
      usage: user.usage,
    });

    res.json({
      subscription: user.subscription,
      usage: user.usage,
    });
  } catch (error) {
    console.error("Get subscription status error:", error);
    res.status(500).json({ error: "Failed to get subscription status" });
  }
});

// Cancel subscription
router.post("/cancel", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.subscription.stripeSubscriptionId) {
      return res.status(400).json({ error: "No active subscription" });
    }

    // Cancel at period end
    await stripe.subscriptions.update(user.subscription.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    user.subscription.status = "cancelled";
    await user.save();

    res.json({
      message:
        "Subscription will be cancelled at the end of the current period",
    });
  } catch (error) {
    console.error("Cancel subscription error:", error);
    res.status(500).json({ error: "Failed to cancel subscription" });
  }
});

// Reactivate subscription
router.post("/reactivate", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.subscription.stripeSubscriptionId) {
      return res.status(400).json({ error: "No subscription found" });
    }

    // Remove cancellation
    await stripe.subscriptions.update(user.subscription.stripeSubscriptionId, {
      cancel_at_period_end: false,
    });

    user.subscription.status = "active";
    await user.save();

    res.json({ message: "Subscription reactivated" });
  } catch (error) {
    console.error("Reactivate subscription error:", error);
    res.status(500).json({ error: "Failed to reactivate subscription" });
  }
});

// Update payment method
router.post("/update-payment-method", auth, async (req, res) => {
  try {
    const { paymentMethodId } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.subscription.stripeCustomerId) {
      return res.status(400).json({ error: "No customer found" });
    }

    // Attach new payment method
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: user.subscription.stripeCustomerId,
    });

    // Set as default
    await stripe.customers.update(user.subscription.stripeCustomerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    res.json({ message: "Payment method updated successfully" });
  } catch (error) {
    console.error("Update payment method error:", error);
    res.status(500).json({ error: "Failed to update payment method" });
  }
});

// Get billing history
router.get("/billing-history", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.subscription.stripeCustomerId) {
      return res.json({ invoices: [] });
    }

    const invoices = await stripe.invoices.list({
      customer: user.subscription.stripeCustomerId,
      limit: 12,
    });

    res.json({ invoices: invoices.data });
  } catch (error) {
    console.error("Get billing history error:", error);
    res.status(500).json({ error: "Failed to get billing history" });
  }
});

// Webhook handler for Stripe events
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      switch (event.type) {
        case "customer.subscription.updated":
          const subscription = event.data.object;
          await handleSubscriptionUpdate(subscription);
          break;

        case "customer.subscription.deleted":
          const deletedSubscription = event.data.object;
          await handleSubscriptionDeletion(deletedSubscription);
          break;

        case "invoice.payment_failed":
          const invoice = event.data.object;
          await handlePaymentFailure(invoice);
          break;
      }

      res.json({ received: true });
    } catch (error) {
      console.error("Webhook handler error:", error);
      res.status(500).json({ error: "Webhook handler failed" });
    }
  }
);

// Helper functions for webhook handlers
async function handleSubscriptionUpdate(subscription) {
  const user = await User.findOne({
    "subscription.stripeSubscriptionId": subscription.id,
  });

  if (user) {
    user.subscription.status = subscription.status;
    user.subscription.currentPeriodEnd = new Date(
      subscription.current_period_end * 1000
    );
    await user.save();
  }
}

async function handleSubscriptionDeletion(subscription) {
  const user = await User.findOne({
    "subscription.stripeSubscriptionId": subscription.id,
  });

  if (user) {
    user.subscription = {
      plan: "free",
      status: "inactive",
      features: {
        aiSummaries: 5,
        flashcardGeneration: 3,
        assignmentHelp: 2,
        citations: 10,
      },
    };
    await user.save();
  }
}

async function handlePaymentFailure(invoice) {
  const user = await User.findOne({
    "subscription.stripeCustomerId": invoice.customer,
  });

  if (user) {
    // Could send email notification here
    console.log(`Payment failed for user ${user.email}`);
  }
}

module.exports = router;
