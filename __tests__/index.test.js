// __tests__/index.test.jsx

import { render, screen } from "@testing-library/react";
import Button from "../components/button";
import "@testing-library/jest-dom";

describe("Home", () => {
  it("renders a heading", () => {
    render(<Button>Cool Button</Button>);

    const heading = screen.getByRole("button", {
      name: /Cool Button/i,
    });

    expect(heading).toBeInTheDocument();
  });
});
