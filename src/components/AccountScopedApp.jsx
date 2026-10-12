import { useSyncExternalStore } from "react";
import App from "../App.jsx";
import { accountCache } from "../sync/account.js";

export default function AccountScopedApp() {
  const account = useSyncExternalStore(accountCache.subscribe, accountCache.getState);
  // Clear transient lessons and recording whenever the identity changes.
  return <App key={account.user?.id || "guest"} />;
}
