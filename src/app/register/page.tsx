"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        address: "",
        password: "",
    });
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        const data = await res.json();
        if (res.ok) {
            alert("Registration successful! Please log in.");
            router.push("/login");
        } else {
            setError(data.error || "Something went wrong");
        }
    }
  return (
    <div className="">
        <form onSubmit={handleSubmit} className="">
        <h1 className="">Register</h1>

        {["name", "phone", "email", "address", "password"].map((field) => (
            <input
                key={field}
                type={field === "password" ? "password" : "text"}
                placeholder={field[0].toUpperCase() + field.slice(1)}
                value={(formData as any)[field]}
                onChange={(e) =>
                    setFormData({ ...formData, [field]: e.target.value })
                }
                required
                className=""
            />
        ))}

        {error && <p className="">{error}</p>}

        <button type="submit" className=""> Register </button>

        <p className="">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}