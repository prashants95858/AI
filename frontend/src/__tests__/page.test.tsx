import React from "react";
import { render, screen } from "@testing-library/react";
import Home from "../app/page";

describe("Home page", () => {
  it("renders the main container and CodeOptimizer component", () => {
    render(<Home />);
    // Check for main container
    const main = screen.getByRole("main");
    expect(main).toBeInTheDocument();
    // Check for CodeOptimizer title
    expect(screen.getByText(/TSX Optimizer/i)).toBeInTheDocument();
  });
});
