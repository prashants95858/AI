// Import dependencies and the RootLayout component
import React from "react";
import { render, screen } from "@testing-library/react";
import RootLayout from "../app/layout";

// Test suite for the RootLayout component
describe("RootLayout", () => {
  // Test: RootLayout renders html and body tags with correct classes and children
  it("renders html and body tags with correct classes and children", () => {
    render(
      <RootLayout>
        <div data-testid="child">Test Child</div>
      </RootLayout>
    );
    // Check for html tag and its lang attribute
    const html = document.querySelector("html");
    expect(html).toBeInTheDocument();
    expect(html).toHaveAttribute("lang", "en");
    // Check for body tag and font classes
    const body = document.querySelector("body");
    expect(body).toBeInTheDocument();
    expect(body?.className).toMatch(/antialiased/);
    expect(body?.className).toMatch(/font-geist-sans/);
    expect(body?.className).toMatch(/font-geist-mono/);
    // Check that children are rendered inside the layout
    expect(screen.getByTestId("child")).toHaveTextContent("Test Child");
  });
});
