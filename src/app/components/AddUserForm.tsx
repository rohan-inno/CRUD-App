"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import { fetchUsers } from "../slices/usersSlice";
import { logout } from "../slices/authSlice";
import { toast } from "react-toastify";

interface AddUserFormProps {
  onClose: () => void;
}

export default function AddUserForm({ onClose }: AddUserFormProps) {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    password: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error("Please log in again.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (res.status === 401) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("token");
        dispatch(logout());
        window.location.href = "/login";
        return;
      }

      if (res.ok) {
        toast.success("User added successfully!");
        //await sendInvite(form.email, form.name.split(" ")[0], form.name.split(" ").slice(1).join(" "));
        setForm({ name: "", phone: "", email: "", address: "", password: "" });
        dispatch(fetchUsers(token));
        onClose();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to add user.");
      }
    } catch (err) {
      console.error("Error adding user:", err);
      toast.error("Unexpected error occurred!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          Add New User
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full border p-2 rounded-md"
            required
          />
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="w-full border p-2 rounded-md"
            required
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border p-2 rounded-md"
            required
          />
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Address"
            className="w-full border p-2 rounded-md"
            required
          />
          <input
            name="password"
            value={form.password}
            type="password"
            onChange={handleChange}
            placeholder="Password"
            className="w-full border p-2 rounded-md"
            required
          />

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className={`px-4 py-2 rounded-md border border-gray-300 text-gray-700 transition ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-red-200"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 rounded-md border border-gray-300 bg-white text-black transition ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-300"
              }`}
            >
              {isSubmitting ? "Adding..." : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
