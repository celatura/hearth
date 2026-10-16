"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Component, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface RetryBoundaryProps {
  children: ReactNode;
  onRetry: () => void;
}

interface RetryBoundaryState {
  hasError: boolean;
}

class RetryBoundary extends Component<RetryBoundaryProps, RetryBoundaryState> {
  state: RetryBoundaryState = { hasError: false };

  static getDerivedStateFromError(): RetryBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto max-w-md rounded-lg border border-border/70 bg-card px-6 py-10 text-center">
          <p className="font-heading text-lg">
            Something went wrong loading this section.
          </p>
          <p className="mt-2 text-sm text-pretty text-muted-foreground">
            Check your connection and try again — nothing was lost.
          </p>
          <Button
            className="mt-5 h-10 px-5"
            onClick={() => {
              this.setState({ hasError: false });
              this.props.onRetry();
            }}
          >
            Try again
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}

/**
 * Catches query failures (after TanStack's single retry) and offers a
 * reset that re-runs every active query.
 */
export function QueryErrorBoundary({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  return (
    <RetryBoundary onRetry={() => void queryClient.resetQueries()}>
      {children}
    </RetryBoundary>
  );
}
