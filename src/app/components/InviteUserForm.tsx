"use client";

import { useState } from "react";
import { toast } from "react-toastify";

export default function InviteUserForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter an email address.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Invitation sent successfully!");
        setEmail("");
      } else {
        toast.error(`Error: ${data.error || "Failed to send invite."}`);
      }
    } catch (error) {
      console.error("Error sending invite:", error);
      toast.error("Unexpected error while sending invite.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={sendInvite}
      className="flex flex-col sm:flex-row items-center gap-3 p-4 border rounded-lg shadow-md max-w-md mx-auto"
    >
      <input
        type="email"
        placeholder="Enter user email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 border p-2 rounded-md w-full"
        required
      />
      <button
        type="submit"
        disabled={isLoading}
        className={`px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition ${
          isLoading ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        {isLoading ? "Sending..." : "Send Invite"}
      </button>
    </form>
  );
}
