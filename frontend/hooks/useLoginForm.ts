"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { loginSchema, type LoginFormValues } from "@/lib/auth";

// Demo users
const DEMO_USERS: Record<string, { role: string; redirect: string }> = {
  "buyer@farm.ng": { role: "buyer", redirect: "/buyer/marketplace" },
  "farmer@farm.ng": { role: "farmer", redirect: "/farmer/dashboard" },
  "logistics@farm.ng": { role: "logistics", redirect: "/logistics/loads" },
  "admin@farm.ng": { role: "admin", redirect: "/admin/disputes" },
};

export const useLoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      setIsLoading(true);
      setServerError(null);

      // =========================
      // ✅ DEMO LOGIN
      // =========================
      const demoUser = DEMO_USERS[values.email];

      if (demoUser && values.password === "password123") {
        document.cookie = `fp_token=demo-token; path=/`;
        document.cookie = `fp_role=${demoUser.role}; path=/`;

        router.push(demoUser.redirect);
        return;
      }

      // =========================
      // 🌐 REAL API LOGIN
      // =========================
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Expected response: { token, role, redirect }
      document.cookie = `fp_token=${data.token}; path=/`;
      document.cookie = `fp_role=${data.role}; path=/`;

      router.push(data.redirect || "/dashboard");
    } catch (err: any) {
      setServerError(err.message || "Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    serverError,
    onSubmit: form.handleSubmit(onSubmit),
  };
};
