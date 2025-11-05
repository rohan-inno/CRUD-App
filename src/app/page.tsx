"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "./store/store";
import { registerUser } from "./slices/authSlice";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    password: "",
  });

  const [validationError, setValidationError] = useState("");

  function validateForm() {
    // Check for empty fields
    for (const key in formData) {
      if ((formData as any)[key].trim() === "") {
        setValidationError(`Please fill out the ${key} field.`);
        return false;
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setValidationError("Please enter a valid email address.");
      return false;
    }

    // Minimum password length
    if (formData.password.length < 6) {
      setValidationError("Password must be at least 6 characters long.");
      return false;
    }

    setValidationError("");
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validateForm()) return;

    const result = await dispatch(registerUser(formData));

    if (registerUser.fulfilled.match(result)) {
      alert("Registration successful!");
      router.push("/login");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-gray-100"
      >
        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Create an Account
        </h1>

        <div className="space-y-4">
          {["name", "phone", "email", "address", "password"].map((field) => (
            <div key={field}>
              <input
                type={field === "password" ? "password" : "text"}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={(formData as any)[field]}
                onChange={(e) =>
                  setFormData({ ...formData, [field]: e.target.value })
                }
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>
          ))}
        </div>

        {/* Validation or API error messages */}
        {validationError && (
          <p className="text-red-500 text-sm text-center mt-4">
            {validationError}
          </p>
        )}
        {error && (
          <p className="text-red-500 text-sm text-center mt-2">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`mt-6 w-full py-3 rounded-md text-white font-medium transition ${
            loading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-center text-gray-600 mt-4 text-sm">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-blue-500 hover:underline font-medium"
          >
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
