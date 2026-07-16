"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { loginAction } from "./actions";

export default function LoginPage() {
  const [errorMessage, formAction, isPending] = useActionState(
    loginAction,
    undefined,
  );

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-8 shadow-xl">
        <h1 className="text-xl font-black text-foreground">Login Admin</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Masuk untuk mengelola konten website.
        </p>

        <form action={formAction} className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm text-foreground-secondary">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="rounded-lg border border-border-strong bg-background px-3 py-2 text-foreground outline-none transition-colors hover:border-accent/40 focus:border-accent focus:ring-1 focus:ring-accent"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm text-foreground-secondary">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="rounded-lg border border-border-strong bg-background px-3 py-2 text-foreground outline-none transition-colors hover:border-accent/40 focus:border-accent focus:ring-1 focus:ring-accent"
            />
          </div>

          {errorMessage && (
            <p role="alert" className="text-sm text-danger">
              {errorMessage}
            </p>
          )}

          <Button
            type="submit"
            disabled={isPending}
            variant="primary"
            tone="bold"
            className="mt-2"
          >
            {isPending ? "Memproses..." : "Login"}
          </Button>
        </form>
      </div>
    </main>
  );
}
