"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import { registerUser } from "../slices/authSlice";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {loading, error} = useAppSelector((state) => state.auth)

  const [formData, setFormData] = useState({
      name: "",
      phone: "",
      email: "",
      address: "",
      password: "",
  });

  async function handleSubmit(e: React.FormEvent) {
      e.preventDefault();

      const result = await dispatch(registerUser(formData));

    if (registerUser.fulfilled.match(result)) {
      alert("Registration successful!");
      router.push("/login");
    }
  }


  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>Register</h1>

        {["name", "phone", "email", "address", "password"].map((field) => (
          <input
            key={field}
            type={field === "password" ? "password" : "text"}
            placeholder={field}
            value={(formData as any)[field]}
            onChange={(e) =>
              setFormData({ ...formData, [field]: e.target.value })
            }
            required
          />
        ))}

        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        <p>
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}