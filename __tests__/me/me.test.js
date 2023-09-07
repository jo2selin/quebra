// __tests__/index.test.jsx
import { rest } from "msw";
import { mswServer } from "../../test/mswServer";
import {
  render,
  screen,
  waitForElementToBeRemoved,
  waitFor,
  toHaveBeenCalledTimes,
  queryByText,
} from "test/test-utils";
import "@testing-library/jest-dom";
import { faker } from "@faker-js/faker";
import MeIndex from "pages/me/index";
import { testUser } from "../../test";

beforeAll(() => mswServer.listen());
afterAll(() => mswServer.close());
afterEach(() => mswServer.resetHandlers());

const customRender = (ui, { providerProps = {}, ...renderOptions } = {}) => {
  return render(ui, renderOptions);
};

test("Shows the [Creer un nom d'artiste] Button when not already set", async () => {
  mswServer.use(
    rest.get("/api/users/me", (req, res, ctx) => res(ctx.json({})))
  );
  const welcomeText = "Premierement, creez-vous un nom d'artiste";
  const welcomeButton = "Creer un nom d'artiste";
  // const loadtingText = screen.getByTestId("loading");
  customRender(<MeIndex />);

  await waitFor(() =>
    expect(screen.getByText(welcomeText)).toBeInTheDocument()
  );
  await waitFor(() =>
    expect(
      screen.getByRole("button", { name: welcomeButton })
    ).toBeInTheDocument()
  );
});

// test("Shows profile data when artist name is set", async () => {
//   customRender(<MeIndex />);
//   const { artistName, slug } = testUser;
//   await waitFor(() => expect(screen.getByText("Artiste")).toBeInTheDocument());
//   await waitFor(() => expect(screen.getByText(artistName)).toBeInTheDocument());
//   // screen.debug();
// });

// test("Shows Projects creation button", async () => {
//   customRender(<MeIndex />);
//   const loadingProjectsText = "loading Artist Projects...";

//   // await waitForElementToBeRemoved(
//   //   screen.findByText(/loading Artist Projects.../i)
//   // ).catch((err) => console.log(err));

//   await waitFor(() =>
//     expect(screen.getByText(/creer nouveau projet/i)).toBeInTheDocument()
//   );
//   // expect(screen.getByText("Creer un nom d'artiste")).toBeInTheDocument();

//   screen.debug();
// });

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
