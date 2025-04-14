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
  fireEvent,
} from "test/test-utils";
import "@testing-library/jest-dom";
import { faker } from "@faker-js/faker";
import MeIndex from "pages/me/index";
import { ToastContainer } from "react-toastify";
import { testUser, userProjects, userMaxLimitProjects } from "../../test";

beforeAll(() => mswServer.listen());
afterAll(() => mswServer.close());
afterEach(() => mswServer.resetHandlers());

const customRender = (ui, { providerProps = {}, ...renderOptions } = {}) => {
  return render(ui, renderOptions);
};

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
  expect(screen.getByText("PUBLISHED")).toBeInTheDocument();
  expect(screen.getByText("DRAFT")).toBeInTheDocument();
  expect(screen.getAllByText("Modifier")).toHaveLength(2);

  expect(screen.getByTestId("max-proj-limit-reached")).toBeInTheDocument();
});

test("Unknown server error displays the Profile error message", async () => {
  mswServer.use(
    rest.get("/api/users/me", (req, res, ctx) =>
      res(
        ctx.delay(1000),
        ctx.status(500),
        ctx.json({ message: "something is wrong profile" }),
      ),
    ),
  );
  customRender(
    <>
      <ToastContainer />
      <MeIndex />
    </>,
  );
  await waitFor(() =>
    expect(screen.getByTestId("loading")).toBeInTheDocument(),
  );
  await waitForElementToBeRemoved(() => screen.getByTestId("loading"));
  // screen.debug();
  expect(
    screen.getByText("Erreur pour recupérer votre profil"),
  ).toBeInTheDocument();
});

test("Unknown server error displays the Projects error message", async () => {
  mswServer.use(
    rest.get("/api/projects/me", (req, res, ctx) =>
      res(
        ctx.delay(1000),
        ctx.status(500),
        ctx.json({ message: "something is wrong" }),
      ),
    ),
  );
  customRender(
    <>
      <ToastContainer />
      <MeIndex />
    </>,
  );
  await waitFor(() =>
    expect(screen.getByTestId("loading-projects")).toBeInTheDocument(),
  );
  await waitForElementToBeRemoved(() => screen.getByTestId("loading-projects"));
  expect(
    screen.getByText("Erreur pour recupérer vos projets"),
  ).toBeInTheDocument();
  // screen.debug();
});
