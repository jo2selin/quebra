import * as React from "react";
import { render as rtlRender } from "@testing-library/react";
import { SessionProvider } from "next-auth/react";
import useSWR, { SWRConfig } from "swr";

function render(ui, { ...options } = {}) {
  const mockSession = {
    expires: new Date(Date.now() + 2 * 86400).toISOString(),
    user: { name: "José", email: "jose@gmail.com", image: "" },
  };

  const Wrapper = ({ children }) => (
    <SWRConfig
      value={{
        dedupingInterval: 0,
        provider: () => new Map(),
      }}
    >
      <SessionProvider session={mockSession}>{children}</SessionProvider>
    </SWRConfig>
  );
  return rtlRender(ui, { wrapper: Wrapper, ...options });
}

export * from "@testing-library/react";
// override React Testing Library's render with our own
export { render };
