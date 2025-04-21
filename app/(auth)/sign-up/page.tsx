"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { toast } from "sonner";

const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  
  const onSubmit = async (values: SignUpFormValues) => {
    try {
      setIsLoading(true);
      
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      
      await setDoc(doc(db, "users", userCredential.user.uid), {
        name: values.name,
        email: values.email,
        createdAt: new Date().toISOString(),
      });
      
      toast.success("Account created successfully");
      router.push("/sign-in");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Create an Account</h1>
        <p className="text-sm text-gray-400">Enter your information to create an account</p>
      </div>
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="John Doe"
            className="w-full rounded-md border border-gray-700 bg-gray-800 p-2 focus:border-blue-500 focus:outline-none"
            {...form.register("name")}
          />
          {form.formState.errors.name && (
            <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
          )}
        </div>
        
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
          {isLoading ? "Creating account..." : "Sign Up"}
        </button>
      </form>
      
      <div className="text-center text-sm">
        <p className="text-gray-400">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-blue-500 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
} 