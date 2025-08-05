// Import React and useState hook for component state management
import React, { useState } from "react";
// Import Link and useNavigate for navigation
import { Link, useNavigate } from "react-router-dom";
// Import custom authentication context hook
import { useAuth } from "../../contexts/AuthContext";
// Import Heroicons for password visibility toggle
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

// Login component that handles user authentication
const Login: React.FC = () => {
  // State for form inputs
  const [email, setEmail] = useState(""); // Email input value
  const [password, setPassword] = useState(""); // Password input value
  const [showPassword, setShowPassword] = useState(false); // Password visibility toggle
  const [loading, setLoading] = useState(false); // Loading state during login process
  
  // Get login function from authentication context
  const { login } = useAuth();
  // Get navigation function for redirecting after login
  const navigate = useNavigate();

  // Handle form submission for login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true); // Set loading state

    try {
      // Attempt to login with provided credentials
      await login(email, password);
      // Navigate to dashboard on successful login
      navigate("/dashboard");
    } catch (error) {
      // Error is handled by the auth context (toast notifications)
      // No additional error handling needed here
    } finally {
      setLoading(false); // Clear loading state regardless of success/failure
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8"> {/* Full screen container with centered content */}
      
      {/* Header Section */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md"> {/* Centered header container */}
        <div className="text-center"> {/* Centered text content */}
          <h1 className="text-3xl font-bold text-gradient">Noted.AI</h1> {/* Application logo/brand */}
          <h2 className="mt-6 text-3xl font-bold text-gray-900"> {/* Welcome heading */}
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-600"> {/* Welcome message */}
            Sign in to your account to continue
          </p>
        </div>
      </div>

      {/* Login Form Section */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"> {/* Form container */}
        <div className="card"> {/* Form card with styling */}
          <form className="space-y-6" onSubmit={handleSubmit}> {/* Form with spacing and submit handler */}
            
            {/* Email Input Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700" {/* Email label */}
              >
                Email address
              </label>
              <div className="mt-1"> {/* Input container */}
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email" {/* Browser autocomplete */}
                  required {/* Required field validation */}
                  value={email} {/* Controlled input value */}
                  onChange={(e) => setEmail(e.target.value)} {/* Update email state */}
                  className="input-field" {/* Input styling */}
                  placeholder="Enter your email" {/* Placeholder text */}
                />
              </div>
            </div>

            {/* Password Input Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700" {/* Password label */}
              >
                Password
              </label>
              <div className="mt-1 relative"> {/* Input container with relative positioning for toggle button */}
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"} {/* Toggle between text and password type */}
                  autoComplete="current-password" {/* Browser autocomplete */}
                  required {/* Required field validation */}
                  value={password} {/* Controlled input value */}
                  onChange={(e) => setPassword(e.target.value)} {/* Update password state */}
                  className="input-field pr-10" {/* Input styling with right padding for toggle button */}
                  placeholder="Enter your password" {/* Placeholder text */}
                />
                {/* Password Visibility Toggle Button */}
                <button
                  type="button" {/* Prevent form submission */}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center" {/* Positioned absolutely within input */}
                  onClick={() => setShowPassword(!showPassword)} {/* Toggle password visibility */}
                >
                  {showPassword ? ( {/* Show eye slash icon when password is visible */}
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : ( {/* Show eye icon when password is hidden */}
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me and Forgot Password Section */}
            <div className="flex items-center justify-between"> {/* Flex layout for remember me and forgot password */}
              {/* Remember Me Checkbox */}
              <div className="flex items-center"> {/* Checkbox and label container */}
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" {/* Checkbox styling */}
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900" {/* Checkbox label */}
                >
                  Remember me
                </label>
              </div>

              {/* Forgot Password Link */}
              <div className="text-sm"> {/* Forgot password container */}
                <Link
                  to="/forgot-password" {/* Link to forgot password page */}
                  className="font-medium text-primary-600 hover:text-primary-500" {/* Link styling */}
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading} {/* Disable button during loading */}
                className="w-full btn-primary py-3 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed" {/* Button styling */}
              >
                {loading ? ( {/* Show loading state */}
                  <div className="flex items-center justify-center"> {/* Loading content layout */}
                    <div className="spinner mr-2"></div> {/* Loading spinner */}
                    Signing in... {/* Loading text */}
                  </div>
                ) : (
                  "Sign in" {/* Default button text */}
                )}
              </button>
            </div>
          </form>

          {/* Social Login Section */}
          <div className="mt-6"> {/* Social login container */}
            {/* Divider */}
            <div className="relative"> {/* Divider container */}
              <div className="absolute inset-0 flex items-center"> {/* Divider line */}
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm"> {/* Divider text */}
                <span className="px-2 bg-white text-gray-500"> {/* Divider text styling */}
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="mt-6 grid grid-cols-2 gap-3"> {/* Social buttons grid */}
              {/* Google Login Button */}
              <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"> {/* Google button styling */}
                <svg className="w-5 h-5" viewBox="0 0 24 24"> {/* Google icon */}
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="ml-2">Google</span> {/* Google button text */}
              </button>

              {/* Twitter Login Button */}
              <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"> {/* Twitter button styling */}
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                > {/* Twitter icon */}
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
                <span className="ml-2">Twitter</span> {/* Twitter button text */}
              </button>
            </div>
          </div>

          {/* Sign Up Link Section */}
          <div className="mt-6 text-center"> {/* Sign up link container */}
            <p className="text-sm text-gray-600"> {/* Sign up text */}
              Don't have an account?{" "} {/* Question text */}
              <Link
                to="/register" {/* Link to registration page */}
                className="font-medium text-primary-600 hover:text-primary-500" {/* Link styling */}
              >
                Sign up for free {/* Sign up link text */}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export the Login component as default
export default Login;
