import React, { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { authAPI } from "../../services/api";
import toast from "react-hot-toast";

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState<
    "loading" | "success" | "error" | "idle"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      verifyEmail();
    }
  }, [token]);

  const verifyEmail = async () => {
    if (!token) return;

    setVerificationStatus("loading");
    try {
      await authAPI.verifyEmail({ token });
      setVerificationStatus("success");
      toast.success("Email verified successfully!");
    } catch (error: any) {
      setVerificationStatus("error");
      setErrorMessage(
        error.response?.data?.error || "Email verification failed"
      );
      toast.error("Email verification failed");
    }
  };

  const resendVerification = async () => {
    try {
      await authAPI.resendVerification();
      toast.success("Verification email sent!");
    } catch (error: any) {
      toast.error(
        error.response?.data?.error || "Failed to send verification email"
      );
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gradient">Noted.AI</h1>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Email Verification
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Invalid verification link
            </p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <XCircleIcon className="mx-auto h-12 w-12 text-red-500" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Invalid Verification Link
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                The verification link is invalid or has expired. Please check
                your email for a valid link or request a new one.
              </p>
              <div className="mt-6">
                <Link to="/login" className="btn-primary w-full justify-center">
                  Go to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gradient">Noted.AI</h1>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Email Verification
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Verifying your email address
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {verificationStatus === "loading" && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Verifying Email...
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Please wait while we verify your email address.
              </p>
            </div>
          )}

          {verificationStatus === "success" && (
            <div className="text-center">
              <CheckCircleIcon className="mx-auto h-12 w-12 text-green-500" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Email Verified Successfully!
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Your email has been verified. You can now access all features of
                Noted.AI.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="btn-primary w-full justify-center"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          )}

          {verificationStatus === "error" && (
            <div className="text-center">
              <XCircleIcon className="mx-auto h-12 w-12 text-red-500" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Verification Failed
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                {errorMessage || "Email verification failed. Please try again."}
              </p>
              <div className="mt-6 space-y-3">
                <button
                  onClick={verifyEmail}
                  className="btn-primary w-full justify-center"
                >
                  Try Again
                </button>
                <button
                  onClick={resendVerification}
                  className="btn-secondary w-full justify-center"
                >
                  Resend Verification Email
                </button>
                <Link
                  to="/login"
                  className="block w-full text-center text-sm text-primary-600 hover:text-primary-500"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
