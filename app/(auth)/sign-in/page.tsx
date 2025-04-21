"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  const onSubmit = async (values: SignInFormValues) => {
    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, values.email, values.password);
      toast.success("Signed in successfully");
      router.push("/");
    } catch (error) {
      console.error(error);
      toast.error("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Sign In</h1>
        <p className="text-sm text-gray-400">Enter your credentials to sign in to your account</p>
      </div>
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            className="w-full rounded-md border border-gray-700 bg-gray-800 p-2 focus:border-blue-500 focus:outline-none"
            {...form.register("email")}
          />
          {form.formState.errors.email && (
            <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            className="w-full rounded-md border border-gray-700 bg-gray-800 p-2 focus:border-blue-500 focus:outline-none"
            {...form.register("password")}
          />
          {form.formState.errors.password && (
            <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
          )}
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-md bg-blue-600 p-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </button>
      </form>
      
      <div className="text-center text-sm">
        <p className="text-gray-400">
          Don't have an account?{" "}
          <Link href="/sign-up" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
} 