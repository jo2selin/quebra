import { rest } from "msw";
import { mswServer } from "../../test/mswServer";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "test/test-utils";
import MeIndex from "pages/me/index";

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
