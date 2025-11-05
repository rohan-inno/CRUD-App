"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        const data = await res.json();
        if (res.ok) {
            localStorage.setItem("token", data.token);
            alert("Login successful!");
            router.push("/users");
        } else {
            setError(data.error || "Invalid credentials");
        }
    }

    return (
        <div className="">
            <form onSubmit={handleSubmit} className="">
                <h1 className="">Login</h1>

                {["email", "password"].map((field) => (
                    <input
                        key={field}
                        type={field === "password" ? "password" : "text"}
                        placeholder={field[0].toUpperCase() + field.slice(1)}
                        value={(formData as any)[field]}
                        onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                        required
                        className=""
                    />
                ))}

                {error && <p className="">{error}</p>}

                <button type="submit" className=""> Login </button>

                <p className="">Don't have an account?{" "}
                    <a href="/" className="text-blue-500 hover:underline">Register</a>
                </p>
            </form>
        </div>
    );
}
