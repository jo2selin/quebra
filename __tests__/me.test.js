// __tests__/index.test.jsx

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import Me from "../pages/me";

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
      return { data: mockSession, status: "authenticated" }; // return type is [] in v3 but changed to {} in v4
    }),
  };
});

describe("Me page", () => {
  it("Display Set Artist Name button", () => {
    render(<Me />);

    expect(screen.getByText("First, set your Artist Name")).toBeInTheDocument();
    // todo chechker tt le tunner de define artist
  });
});
