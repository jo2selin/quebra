// __tests__/index.test.jsx

import { render, screen } from "test/test-utils";
import "@testing-library/jest-dom";

import SetYourArtistProfile from "../../components/me/welcome";
import { SessionProvider } from "next-auth/react";

describe("Me/", () => {
  it("Shows the Create a Artist name Text and Button to /me/artistProfile", () => {
    // const Wrapper = ({ children }) => (
    //   <SessionProvider>{children}</SessionProvider>
    // );
    render(<SetYourArtistProfile />);

    // const heading = screen.getByRole("button", {
    //   name: /Log In/i,
    // });

    // const setArtist = screen.getByRole("link", {
    //   name: /creer un nom d'artiste/i,
    // });

    expect(
      screen.getByText("Premierement, creez-vous un nom d'artiste"),
    ).toBeInTheDocument();
    // expect(setArtist).toBeInTheDocument();
    // expect(setArtist).toHaveAttribute("href", "./me/artistProfile");
  });
});
