"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

import { GoogleIcon } from "@/components/auth/google-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  signInWithEmail,
  signInWithGoogle,
  signUpWithEmail,
  type AuthState,
} from "@/lib/auth/actions";

function SubmitButton({ children }: { children: ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending && <Loader2 className="animate-spin" aria-hidden />}
      {children}
    </Button>
  );
}

const initialState: AuthState = {};

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const isLogin = mode === "login";
  const [state, formAction] = useFormState(
    isLogin ? signInWithEmail : signUpWithEmail,
    initialState,
  );

  return (
    <div className="flex flex-col gap-5">
      <form action={signInWithGoogle}>
        <Button type="submit" variant="outline" size="lg" className="w-full">
          <GoogleIcon className="size-4" />
          Continue with Google
        </Button>
      </form>

      <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>

      <form action={formAction} className="flex flex-col gap-4">
        {state.error && (
          <p
            role="alert"
            className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {state.error}
          </p>
        )}
        {state.message && (
          <p
            role="status"
            className="rounded-lg border border-success/30 bg-success/10 px-3 py-2 text-sm text-success"
          >
            {state.message}
          </p>
        )}

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete={isLogin ? "current-password" : "new-password"}
            placeholder={isLogin ? "Your password" : "At least 8 characters"}
            minLength={isLogin ? undefined : 8}
            required
          />
          {!isLogin && (
            <p className="text-xs text-muted-foreground">
              Use at least 8 characters.
            </p>
          )}
        </div>

        <SubmitButton>{isLogin ? "Sign in" : "Create account"}</SubmitButton>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        {isLogin ? (
          <>
            New to WayAbroad?{" "}
            <Link
              href="/signup"
              className="font-medium text-primary hover:underline"
            >
              Create an account
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
