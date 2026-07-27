import { createFileRoute, redirect } from "@tanstack/react-router";

/** The command overview is the operating entry point. */
export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: "/command" });
  },
});
