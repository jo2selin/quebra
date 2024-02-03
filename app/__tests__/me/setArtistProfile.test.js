import { rest } from "msw";
import { mswServer } from "../../test/mswServer";
import "@testing-library/jest-dom";
import {
  render,
  screen,
  waitForElementToBeRemoved,
  waitFor,
  toHaveBeenCalledTimes,
  queryByText,
  fireEvent,
} from "test/test-utils";
import { testUser, userProjects, userMaxLimitProjects } from "../../test";
import MeIndex from "pages/me/index";

beforeAll(() => mswServer.listen());
afterAll(() => mswServer.close());
afterEach(() => mswServer.resetHandlers());

const customRender = (ui, { providerProps = {}, ...renderOptions } = {}) => {
  return render(ui, renderOptions);
};

test("Shows the correct Ui on click on Update artist [back, title, input, button]", async () => {
  customRender(<MeIndex />);
  const titleInput = "NOM D'ARTISTE *";

  expect(screen.getByTestId("loading")).toBeInTheDocument();
  await waitForElementToBeRemoved(() => screen.getByTestId("loading"));
  // await waitFor(() => expect(editButton).toBeInTheDocument());
  // fireEvent.click(editButton);

  await waitFor(() =>
    expect(
      screen.getByRole("button", {
        name: /modifier mes infos artiste/i,
      }),
    ),
  );

  // screen.debug();
  const editButton = screen.getByText(/modifier mes infos artiste/i);
  expect(editButton).toBeInTheDocument();

  fireEvent.click(editButton);
  expect(
    screen.getByRole("button", {
      name: /< retour/i,
    }),
  ).toBeInTheDocument();
  expect(screen.getByText(/nom d'artiste/i)).toBeInTheDocument();
  const input = screen.getByRole("textbox", {
    name: /nom d'artiste \*/i,
  });

  expect(
    screen.getByRole("button", {
      name: /enregistrer nom/i,
    }),
  ).toBeInTheDocument();
  // tester envoi du form

  expect(input.value).toBe(testUser.artistName);
});
