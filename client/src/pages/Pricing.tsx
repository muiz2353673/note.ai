import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CheckIcon } from "@heroicons/react/24/outline";
import PaymentModal from "../components/PaymentModal";
import { useAuth } from "../contexts/AuthContext";

const Pricing: React.FC = () => {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started",
      features: [
        "5 AI summaries per month",
        "3 flashcard sets per month",
        "2 assignment help sessions",
        "10 citations per month",
        "Basic note organization",
        "Email support",
      ],
      cta: "Get Started Free",
      popular: false,
    },
    {
      name: "Student Premium",
      price: "$9.99",
      period: "per month",
      description: "Most popular for students",
      features: [
        "100 AI summaries per month",
        "50 flashcard sets per month",
        "25 assignment help sessions",
        "200 citations per month",
        "Advanced note organization",
        "Priority support",
        "Export to PDF/Word",
        "Custom citation styles",
      ],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      name: "University",
      price: "Custom",
      period: "enterprise",
      description: "For educational institutions",
      features: [
        "Unlimited AI summaries",
        "Unlimited flashcard sets",
        "Unlimited assignment help",
        "Unlimited citations",
        "Custom branding",
        "Analytics dashboard",
        "LMS integration",
        "Dedicated support",
        "API access",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Choose Your Plan
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Start free and upgrade as you grow. All plans include our core AI
          features.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`card relative ${
              plan.popular ? "ring-2 ring-primary-500" : ""
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
            )}

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {plan.name}
              </h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-gray-900">
                  {plan.price}
                </span>
                <span className="text-gray-500 ml-2">{plan.period}</span>
              </div>
              <p className="text-gray-600">{plan.description}</p>
            </div>

            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-success-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            {plan.name === "University" ? (
              <Link
                to="/university-partnership"
                className={`w-full text-center py-3 px-4 rounded-lg font-medium transition-colors duration-200 ${
                  plan.popular
                    ? "bg-primary-600 hover:bg-primary-700 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                }`}
              >
                {plan.cta}
              </Link>
            ) : plan.name === "Free" ? (
              <Link
                to={user ? "/dashboard" : "/register"}
                className={`w-full text-center py-3 px-4 rounded-lg font-medium transition-colors duration-200 ${
                  plan.popular
                    ? "bg-primary-600 hover:bg-primary-700 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                }`}
              >
                {user ? "Go to Dashboard" : plan.cta}
              </Link>
            ) : (
              <button
                onClick={() => {
                  if (!user) {
                    window.location.href = "/login";
                    return;
                  }
                  setSelectedPlan(plan);
                  setShowPaymentModal(true);
                }}
                className={`w-full text-center py-3 px-4 rounded-lg font-medium transition-colors duration-200 ${
                  plan.popular
                    ? "bg-primary-600 hover:bg-primary-700 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                }`}
              >
                {user ? plan.cta : "Login to Subscribe"}
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="card text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Frequently Asked Questions
        </h2>
        <div className="grid md:grid-cols-2 gap-6 text-left">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">
              Can I cancel anytime?
            </h3>
            <p className="text-gray-600">
              Yes, you can cancel your subscription at any time. No long-term
              commitments required.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">
              What payment methods do you accept?
            </h3>
            <p className="text-gray-600">
              We accept all major credit cards, PayPal, and Apple Pay for secure
              payments.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">
              Is there a free trial?
            </h3>
            <p className="text-gray-600">
              Yes, all paid plans come with a 7-day free trial. No credit card
              required to start.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">
              Do you offer student discounts?
            </h3>
            <p className="text-gray-600">
              Yes, we offer special pricing for verified students. Contact us
              for more details.
            </p>
          </div>
        </div>
      </div>

      {selectedPlan && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedPlan(null);
          }}
          plan={selectedPlan}
        />
      )}
    </div>
  );
};

export default Pricing;
