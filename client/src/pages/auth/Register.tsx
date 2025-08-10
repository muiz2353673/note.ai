// Import React and useState hook for component state management
import React, { useState } from "react";
// Import Link and useNavigate for navigation
import { Link, useNavigate } from "react-router-dom";
// Import custom authentication context hook
import { useAuth } from "../../contexts/AuthContext";
// Import Heroicons for password visibility toggle
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

// Register component that handles user account creation
const Register: React.FC = () => {
  // State for form data - all registration fields
  const [formData, setFormData] = useState({
    firstName: "", // User's first name
    lastName: "", // User's last name
    email: "", // User's email address
    password: "", // User's password
    confirmPassword: "", // Password confirmation for validation
    universityDomain: "", // Optional university domain for partnership benefits
  });
  
  // State for password visibility toggles
  const [showPassword, setShowPassword] = useState(false); // Toggle for password field
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Toggle for confirm password field
  const [loading, setLoading] = useState(false); // Loading state during registration process
  const [errors, setErrors] = useState<Record<string, string>>({}); // Form validation errors
  
  // Get register function from authentication context
  const { register } = useAuth();
  // Get navigation function for redirecting after registration
  const navigate = useNavigate();

  // Handle input changes for all form fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target; // Extract field name and value
    setFormData((prev) => ({ ...prev, [name]: value })); // Update form data
    // Clear error when user starts typing in a field with an error
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validate all form fields and return validation result
  const validateForm = () => {
    const newErrors: Record<string, string> = {}; // Initialize empty errors object

    // Validate first name
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    // Validate last name
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    // Validate email format
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      // Basic email regex validation
      newErrors.email = "Email is invalid";
    }

    // Validate password strength
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      // Minimum password length
      newErrors.password = "Password must be at least 6 characters";
    }

    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors); // Update errors state
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  // Handle form submission for registration
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission

    // Validate form before submission
    if (!validateForm()) {
      return; // Stop submission if validation fails
    }

    setLoading(true); // Set loading state

    try {
      // Attempt to register with form data
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        universityDomain: formData.universityDomain || undefined, // Pass undefined if empty
      });
      navigate("/dashboard"); // Navigate to dashboard on successful registration
    } catch (error) {
      // Error is handled by the auth context (toast notifications)
      // No additional error handling needed here
    } finally {
      setLoading(false); // Clear loading state regardless of success/failure
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Full screen container with centered content */}
      
      {/* Header Section */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Centered header container */}
        <div className="text-center">
          {/* Centered text content */}
          <h1 className="text-3xl font-bold text-gradient">Noted.AI</h1>
          {/* Application logo/brand */}
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Create your account</h2>
          {/* Registration heading */}
          <p className="mt-2 text-sm text-gray-600">Start your academic journey with AI-powered assistance</p>
          {/* Registration description */}
        </div>
      </div>

      {/* Registration Form Section */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {/* Form container */}
        <div className="card">
          {/* Form card with styling */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Form with spacing and submit handler */}
            
            {/* Name Fields - First and Last Name */}
            <div className="grid grid-cols-2 gap-4">
              {/* Two-column grid for names */}
              {/* First Name Field */}
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  {/* First name label */}
                  First name
                </label>
                <div className="mt-1">
                  {/* Input container */}
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`input-field ${errors.firstName ? "border-error-500" : ""}`}
                    placeholder="John"
                  />
                  {/* Error message display */}
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-error-600">{errors.firstName}</p>
                  )}
                </div>
              </div>

              {/* Last Name Field */}
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  {/* Last name label */}
                  Last name
                </label>
                <div className="mt-1">
                  {/* Input container */}
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`input-field ${errors.lastName ? "border-error-500" : ""}`}
                    placeholder="Doe"
                  />
                  {/* Error message display */}
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-error-600">{errors.lastName}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                {/* Email label */}
                Email address
              </label>
              <div className="mt-1">
                {/* Input container */}
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`input-field ${errors.email ? "border-error-500" : ""}`}
                  placeholder="john@example.com"
                />
                {/* Error message display */}
                {errors.email && (
                  <p className="mt-1 text-sm text-error-600">{errors.email}</p>
                )}
              </div>
            </div>

            {/* University Domain Field - Optional */}
            <div>
              <label htmlFor="universityDomain" className="block text-sm font-medium text-gray-700">
                {/* University domain label */}
                University domain (optional)
              </label>
              <div className="mt-1">
                {/* Input container */}
                <input
                  id="universityDomain"
                  name="universityDomain"
                  type="text"
                  value={formData.universityDomain}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="university.edu"
                />
                <p className="mt-1 text-xs text-gray-500">
                  {/* Help text */}
                  Enter your university's domain to access partnership benefits
                </p>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                {/* Password label */}
                Password
              </label>
              <div className="mt-1 relative">
                {/* Input container with relative positioning for toggle button */}
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`input-field pr-10 ${errors.password ? "border-error-500" : ""}`}
                  placeholder="Create a password"
                />
                {/* Password Visibility Toggle Button */}
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    // Show eye slash icon when password is visible
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    // Show eye icon when password is hidden
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                {/* Error message display */}
                {errors.password && (
                  <p className="mt-1 text-sm text-error-600">{errors.password}</p>
                )}
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                {/* Confirm password label */}
                Confirm password
              </label>
              <div className="mt-1 relative">
                {/* Input container with relative positioning for toggle button */}
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`input-field pr-10 ${errors.confirmPassword ? "border-error-500" : ""}`}
                  placeholder="Confirm your password"
                />
                {/* Confirm Password Visibility Toggle Button */}
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    // Show eye slash icon when password is visible
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    // Show eye icon when password is hidden
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                {/* Error message display */}
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-error-600">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="flex items-center">
              {/* Checkbox and label container */}
              <input
                id="agree-terms"
                name="agree-terms"
                type="checkbox"
                required
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              {/* Checkbox styling */}
              <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-900">
                {/* Checkbox label */}
                I agree to the{" "}
                {/* Terms text */}
                <button className="text-primary-600 hover:text-primary-500">Terms of Service</button>{" "}
                {/* Terms link */}
                and{" "}
                {/* Privacy text */}
                <button className="text-primary-600 hover:text-primary-500">Privacy Policy</button>
                {/* Privacy link */}
              </label>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  // Show loading state
                  <div className="flex items-center justify-center">
                    {/* Loading content layout */}
                    <div className="spinner mr-2"></div>
                    {/* Loading spinner */}
                    Creating account...
                    {/* Loading text */}
                  </div>
                ) : (
                  "Create account"
                )}
              </button>
            </div>
          </form>

          {/* Social Registration Section */}
          <div className="mt-6">
            {/* Social registration container */}
            {/* Divider */}
            <div className="relative">
              {/* Divider container */}
              <div className="absolute inset-0 flex items-center">
                {/* Divider line */}
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                {/* Divider text */}
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
                {/* Divider text styling */}
              </div>
            </div>

            {/* Social Registration Buttons */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              {/* Social buttons grid */}
              {/* Google Registration Button */}
              <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                {/* Google button styling */}
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  {/* Google icon */}
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span className="ml-2">Google</span>
                {/* Google button text */}
              </button>

              {/* Twitter Registration Button */}
              <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                {/* Twitter button styling */}
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  {/* Twitter icon */}
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
                <span className="ml-2">Twitter</span>
                {/* Twitter button text */}
              </button>
            </div>
          </div>

          {/* Sign In Link Section */}
          <div className="mt-6 text-center">
            {/* Sign in link container */}
            <p className="text-sm text-gray-600">
              {/* Sign in text */}
              Already have an account?{" "}
              {/* Question text */}
              <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                {/* Link to login page */}
                Sign in
                {/* Sign in link text */}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export the Register component as default
export default Register;
