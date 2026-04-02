// Handles signup logic + form UI
"use client";

import { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { supabase } from "@/lib/supabase";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignup = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    //  IMPORTANT CHECK (duplicate user)
    if (data.user && data.user.identities?.length === 0) {
      setError("User already exists. Please login.");
      setLoading(false);
      return;
    }

    setSuccess("Signup successful. Please login now to continue.");
    setLoading(false);
  };

  return (
    <>
      <div className="space-y-4">
        <Input
          label="Email"
          type="email"
          value={email}
          placeholder="you@example.com"
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          label="Password"
          type="password"
          value={password}
          placeholder="Create a secure password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {error && <p className="mt-4 text-red-400">{error}</p>}
      {success && <p className="mt-4 text-green-400">{success}</p>}

      <Button onClick={handleSignup} loading={loading}>
        Create Account
      </Button>
    </>
  );
}
