// Import dependencies and the Home page component
import React from "react";
import { render, screen } from "@testing-library/react";
import Home from "../app/page";

// Test suite for the Home page
describe("Home page", () => {
  // Test: Home page renders main container and CodeOptimizer title
  it("renders the main container and CodeOptimizer component", () => {
    render(<Home />);
    // Check for main container element
    const main = screen.getByRole("main");
    expect(main).toBeInTheDocument();
    // Check for CodeOptimizer title text
    expect(screen.getByText(/TSX Optimizer/i)).toBeInTheDocument();
  });
});
