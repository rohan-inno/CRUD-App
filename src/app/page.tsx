"use client";

import { useState } from "react";
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from "./store/store";
import { registerUser } from "./slices/authSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerSchema } from "./schemas/registerSchema";
import { ValidationError } from "yup";

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
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    upperCase: false,
    number: false,
    specialChar: false,
  })

  async function validateForm() {
    try {
      await registerSchema.validate(formData, {abortEarly: true});
      setValidationError("");
      return true;

    } catch (error) {
      if(error instanceof ValidationError){
        setValidationError(error.message);
      } else {
        setValidationError("An unexpected validation occured.");
      }
      return false;
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const isValid = await validateForm();
    if (!isValid) return;

    const result = await dispatch(registerUser(formData));

    if (registerUser.fulfilled.match(result)) {
      toast.success("Registration successful!");
      router.push("/login");
    } else {
      toast.error(result.payload as string || "Registration failed");
    }
  }

  const handleBlur = async (field: string) => {
    try{
      await registerSchema.validateAt(field, formData);
      setValidationError("");
    } catch (error) {
      if (error instanceof ValidationError) setValidationError(error.message);
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
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData({ ...formData, [field]: e.target.value });
                  if(field === "password") {
                    setPasswordRequirements({
                      minLength: value.length >= 6,
                      upperCase: /[A-Z]/.test(value),
                      number: /[0-9]/.test(value),
                      specialChar: /[@$!%*?&]/.test(value)
                    });
                  }
                }}
                onBlur={() => handleBlur(field)}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
              {field === "password" && formData.password.length > 0 && (
                <ul className="text-sm mt-2 space-y-1">
                  <li className={passwordRequirements.minLength ? "text-green-600" : "text-gray-600"}>
                    • At least 6 characters
                  </li>
                  <li className={passwordRequirements.upperCase ? "text-green-600" : "text-gray-600"}>
                    • One uppercase letter
                  </li>
                  <li className={passwordRequirements.number ? "text-green-600" : "text-gray-600"}>
                    • One number
                  </li>
                  <li className={passwordRequirements.specialChar ? "text-green-600" : "text-gray-600"}>
                    • One special character (@, $, !, %, *, ?, &)
                  </li>
                </ul>
              )}
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
          <Link
            href="/login"
            className="text-blue-500 hover:underline font-medium"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
