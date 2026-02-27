import { AuthConfig } from "convex/server";

export default {
  providers: [
    {
      domain: "https://strong-urchin-8.clerk.accounts.dev",
      applicationID: "convex",
    },
  ]
} satisfies AuthConfig;