"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signInSchema } from "@/lib/verification";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ErrorContext } from "@better-fetch/fetch";
import { toast } from "sonner";

export default function SignIn() {
  const router = useRouter();
  const [pendingCredentials, setPendingCredentials] = useState(false);
  const [pendingGithub, setPendingGithub] = useState(false);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleCredentialsSignIn = async (
    values: z.infer<typeof signInSchema>
  ) => {
    await authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
      },
      {
        onRequest: () => {
          setPendingCredentials(true);
        },
        onSuccess: async () => {
          router.push("/");
          toast.success("Signed in successfully");
          router.refresh();
        },
        onError: (ctx: ErrorContext) => {
          toast.error(ctx.error.message);
          console.log(ctx.error);
        },
      }
    );
    setPendingCredentials(false);
  };

  // const handleSignInWithGithub = async () => {
  //   await authClient.signIn.social(
  //     {
  //       provider: "github",
  //     },
  //     {
  //       onRequest: () => {
  //         setPendingGithub(true);
  //       },
  //       onSuccess: async () => {
  //         router.push("/");
  //         router.refresh();
  //       },
  //       onError: (ctx: ErrorContext) => {},
  //     }
  //   );
  //   setPendingGithub(false);
  // };

  return (
    <div className="grow flex items-center justify-center p-4 w-full">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-gray-800">
            Sign In
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleCredentialsSignIn)}
              className="space-y-6"
            >
              {["email", "password"].map((field) => (
                <FormField
                  control={form.control}
                  key={field}
                  name={field as keyof z.infer<typeof signInSchema>}
                  render={({ field: fieldProps }) => (
                    <FormItem>
                      <FormLabel>
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type={field === "password" ? "password" : "email"}
                          placeholder={`Enter your ${field}`}
                          {...fieldProps}
                          autoComplete={
                            field === "password" ? "current-password" : "email"
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <Button disabled={pendingCredentials} className="w-full">
                Sign in
              </Button>
            </form>
          </Form>

          <div className="mt-4 text-center text-sm flex items-center justify-center gap-2">
            {/* <Link
              href="/forgot-password"
              className="text-primary hover:underline"
            >
              Forgot password?
            </Link> */}
            <span className="text-sm text-gray-500">
              Don&apos;t have an account?
            </span>
            <Link href="/auth/sign-up" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
