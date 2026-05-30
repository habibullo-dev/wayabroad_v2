import type { Metadata } from "next";

import { AuthForm } from "@/components/auth/auth-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="font-display text-2xl">Welcome back</CardTitle>
        <CardDescription>Sign in to your WayAbroad account.</CardDescription>
      </CardHeader>
      <CardContent>
        <AuthForm mode="login" />
      </CardContent>
    </Card>
  );
}
