// hooks/useSignupForm.ts

"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signupSchema, type SignupFormValues } from "@/lib/auth";

export const useSignupForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      // role: undefined,
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: SignupFormValues) => {
    try {
      setIsLoading(true);
      setServerError(null);

      // TODO: replace with your auth call
      console.log("Signup payload:", values);
    } catch {
      setServerError("Something went wrong. Please try again.");
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
