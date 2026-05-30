import type { Metadata } from "next";

import { AuthForm } from "@/components/auth/auth-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = { title: "Create account" };

export default function SignupPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="font-display text-2xl">
          Create your account
        </CardTitle>
        <CardDescription>
          Start your Korea application journey — free, no credit card.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AuthForm mode="signup" />
      </CardContent>
    </Card>
  );
}
