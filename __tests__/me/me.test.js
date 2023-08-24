// __tests__/index.test.jsx

import {
  render,
  screen,
  waitForElementToBeRemoved,
  waitFor,
  toHaveBeenCalledTimes,
} from "@testing-library/react";
import "@testing-library/jest-dom";

import MeIndex from "../../pages/me/index";

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

const customRender = (ui, { providerProps, ...renderOptions }) => {
  return render(ui, renderOptions);
};

test("NameConsumer shows value from provider", async () => {
  const providerProps = {
    value: "C3PO",
  };
  customRender(<MeIndex />, { providerProps });

  // it'll wait until the mock function has been called once.
  await waitFor(() =>
    expect(
      screen.getByText("Premierement, creez-vous un nom d'artiste")
    ).toBeInTheDocument()
  );
  expect(screen.getByText("Creer un nom d'artiste")).toBeInTheDocument();

  screen.debug();
});

// describe("Me/", () => {
//   it("Shows the Create a Artist name when artist.name is empty", () => {
//     // const Wrapper = ({ children }) => (
//     //   <SessionProvider>{children}</SessionProvider>
//     // );
//     render(<MeIndex />);

//     // const heading = screen.getByRole("button", {
//     //   name: /Log In/i,
//     // });

//     const setArtist = screen.getByRole("link", {
//       name: /creer un nom d'artiste/i,
//     });

//     expect(
//       screen.getByText("Premierement, creez-vous un nom d'artiste")
//     ).toBeInTheDocument();
//     // expect(setArtist).toBeInTheDocument();
//     // expect(setArtist).toHaveAttribute("href", "./me/artistProfile");
//   });
// });
