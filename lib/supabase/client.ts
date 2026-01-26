import { createBrowserClient } from "./browser";

// Alias for backward compatibility
export function createClient() {
  return createBrowserClient();
}
