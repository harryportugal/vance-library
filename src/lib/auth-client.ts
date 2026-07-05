import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: window.location.origin, // Requests routed via Vite reverse proxy
  plugins: [
    inferAdditionalFields({
      user: {
        role: { type: "string" },
        plan: { type: "string" },
        status: { type: "string" },
      },
    }),
  ],
});
