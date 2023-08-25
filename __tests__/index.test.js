// __tests__/index.test.jsx

import { render, screen } from "test/test-utils";
import "@testing-library/jest-dom";

import Header from "../components/header";
import { SessionProvider } from "next-auth/react";

jest.mock("next-auth/react", () => {
  const originalModule = jest.requireActual("next-auth/react");
  const mockSession = {
    expires: new Date(Date.now() + 2 * 86400).toISOString(),
    user: { username: "admin" },
  };
  return {
    __esModule: true,
    ...originalModule,
    useSession: jest.fn(() => {
      return { data: mockSession, status: "unauthenticated" }; // return type is [] in v3 but changed to {} in v4
    }),
  };
});

describe("Home", () => {
  it("renders the Header", () => {
    // const Wrapper = ({ children }) => (
    //   <SessionProvider>{children}</SessionProvider>
    // );
    render(<Header />);

    // const heading = screen.getByRole("button", {
    //   name: /Log In/i,
    // });

    expect(screen.getAllByText("Mon compte")[0]).toBeInTheDocument();
    // expect(screen.getByText("Log out")).toBeInTheDocument();
  });
});
