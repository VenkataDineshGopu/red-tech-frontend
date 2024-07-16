import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

test("renders Create Order button", () => {
  render(<App />);
  const buttonElement = screen.getByText(/Create Order/i);
  expect(buttonElement).toBeInTheDocument();
});
