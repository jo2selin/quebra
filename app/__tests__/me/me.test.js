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
import { testUser, userProjects, userMaxLimitProjects } from "../../test";

beforeAll(() => mswServer.listen());
afterAll(() => mswServer.close());
afterEach(() => mswServer.resetHandlers());

const customRender = (ui, { providerProps = {}, ...renderOptions } = {}) => {
  return render(ui, renderOptions);
};

test("Shows the [Creer un nom d'artiste] Button when not already set", async () => {
  mswServer.use(
    rest.get("/api/users/me", (req, res, ctx) => res(ctx.json({}))),
  );
  const welcomeText = "Premierement, creez-vous un nom d'artiste";
  const welcomeButton = "Creer un nom d'artiste";
  // const loadtingText = screen.getByTestId("loading");
  customRender(<MeIndex />);

  await waitFor(() =>
    expect(screen.getByText(welcomeText)).toBeInTheDocument(),
  );
  await waitFor(() =>
    expect(
      screen.getByRole("button", { name: welcomeButton }),
    ).toBeInTheDocument(),
  );
});

test("Shows profile data when artist name is set", async () => {
  customRender(<MeIndex />);
  const { artistName, slug } = testUser;
  expect(screen.getByTestId("loading")).toBeInTheDocument();
  await waitForElementToBeRemoved(() => screen.getByTestId("loading"));
  // loading-artist never shows
  expect(screen.getByText("Artiste")).toBeInTheDocument();
  expect(screen.getByText(artistName)).toBeInTheDocument();
  // screen.debug();
});

test("Shows Projects data and creation button", async () => {
  customRender(<MeIndex />);

  await waitFor(() =>
    expect(screen.getByTestId("loading-projects")).toBeInTheDocument(),
  );
  await waitForElementToBeRemoved(() => screen.getByTestId("loading-projects"));

  expect(screen.getByText(userProjects[0].projectName)).toBeInTheDocument();

  expect(screen.getByText(/Creer nouveau projet/i)).toBeInTheDocument();

  expect(
    screen.getByRole("link", {
      name: /Creer nouveau projet/i,
    }),
  ).toHaveAttribute("href", "/me/project");
  // screen.debug();
});

test("Shows Projects data and Max limit warning", async () => {
  mswServer.use(
    rest.get("/api/projects/me", (req, res, ctx) =>
      res(ctx.delay(300), ctx.json(userMaxLimitProjects)),
    ),
  );
  customRender(<MeIndex />);

  await waitFor(() =>
    expect(screen.getByTestId("loading-projects")).toBeInTheDocument(),
  );
  await waitForElementToBeRemoved(() => screen.getByTestId("loading-projects"));

  expect(
    screen.getByText(userMaxLimitProjects[0].projectName),
  ).toBeInTheDocument();
  expect(
    screen.getByText(userMaxLimitProjects[1].projectName),
  ).toBeInTheDocument();
  // status of the project : Published, Draft...
  const statusList = ["published", "draft"];
  const statusSpans = screen.getAllByTestId("project-status");
  expect(statusSpans).toHaveLength(2);
  expect(statusSpans.map((s) => s.textContent.toLowerCase())).toEqual(
    statusList,
  );

  expect(screen.getByTestId("max-proj-limit-reached")).toBeInTheDocument();
  // screen.debug();
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
