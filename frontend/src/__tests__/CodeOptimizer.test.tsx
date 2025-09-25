// Import dependencies and the component to test
import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import axios from "axios";
import CodeOptimizer from "../components/CodeOptimizer/index";

// Mock axios for API calls
jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

// Test suite for CodeOptimizer component
describe("CodeOptimizer", () => {
  // Test: Shows backend error from axios response
  it("renders backend error from axios response", async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { error: "custom backend error" },
    });
    render(<CodeOptimizer />);
    fireEvent.change(
      screen.getByPlaceholderText(/Paste TypeScript\/TSX code here/i),
      {
        target: { value: "code" },
      }
    );
    fireEvent.click(screen.getByRole("button", { name: /Optimize/i }));
    await waitFor(() => {
      expect(screen.getByText(/custom backend error/i)).toBeInTheDocument();
    });
  });

  // Test: Renders nothing if axios response has no optimized or error
  it("renders nothing if axios response has no optimized or error", async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: {} });
    render(<CodeOptimizer />);
    fireEvent.change(
      screen.getByPlaceholderText(/Paste TypeScript\/TSX code here/i),
      {
        target: { value: "code" },
      }
    );
    fireEvent.click(screen.getByRole("button", { name: /Optimize/i }));
    await waitFor(() => {
      // Output section should not be rendered
      expect(screen.queryByText(/Optimized Code:/i)).toBeNull();
      expect(
        screen.queryByText(/Please upload a file or paste some code/i)
      ).toBeNull();
    });
  });
  // Test: Shows error message from catch block on network error
  it("renders error message from catch block on network error", async () => {
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    mockedAxios.post.mockRejectedValueOnce(new Error("Network error"));
    render(<CodeOptimizer />);
    fireEvent.change(
      screen.getByPlaceholderText(/Paste TypeScript\/TSX code here/i),
      {
        target: { value: "code" },
      }
    );
    fireEvent.click(screen.getByRole("button", { name: /Optimize/i }));
    await waitFor(() => {
      expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
      expect(errorSpy).toHaveBeenCalled();
    });
    errorSpy.mockRestore();
  });

  // Test: Resets all fields after successful submission
  it("resets all fields after successful submission", async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { optimized: "reset test" },
    });
    render(<CodeOptimizer />);
    fireEvent.change(screen.getByPlaceholderText(/Enter system prompt/i), {
      target: { value: "system" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter user prompt/i), {
      target: { value: "user" },
    });
    fireEvent.change(
      screen.getByPlaceholderText(/Paste TypeScript\/TSX code here/i),
      {
        target: { value: "code" },
      }
    );
    fireEvent.click(screen.getByRole("button", { name: /Optimize/i }));
    await waitFor(() => {
      expect(screen.getByText(/reset test/i)).toBeInTheDocument();
    });
    // After reset, fields should be empty
    expect(screen.getByPlaceholderText(/Enter system prompt/i)).toHaveValue("");
    expect(screen.getByPlaceholderText(/Enter user prompt/i)).toHaveValue("");
    expect(
      screen.getByPlaceholderText(/Paste TypeScript\/TSX code here/i)
    ).toHaveValue("");
  });
  // Test: Output section is not rendered when output is empty
  it("does not render output section when output is empty", () => {
    render(<CodeOptimizer />);
    expect(screen.queryByText(/Optimized Code:/i)).toBeNull();
    expect(
      screen.queryByText(/Please upload a file or paste some code/i)
    ).toBeNull();
  });

  // Test: Renders error output branch only
  it("renders error output branch only", async () => {
    render(<CodeOptimizer />);
    fireEvent.change(
      screen.getByPlaceholderText(/Paste TypeScript\/TSX code here/i),
      {
        target: { value: " " },
      }
    );
    fireEvent.click(screen.getByRole("button", { name: /Optimize/i }));
    await waitFor(() => {
      expect(
        screen.getByText(/Please upload a file or paste some code/i)
      ).toBeInTheDocument();
      expect(screen.queryByText(/Optimized Code:/i)).toBeNull();
    });
  });

  // Test: Renders success output branch only
  it("renders success output branch only", async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { optimized: "success branch" },
    });
    render(<CodeOptimizer />);
    fireEvent.change(
      screen.getByPlaceholderText(/Paste TypeScript\/TSX code here/i),
      {
        target: { value: "code" },
      }
    );
    fireEvent.click(screen.getByRole("button", { name: /Optimize/i }));
    await waitFor(() => {
      expect(screen.getByText(/Optimized Code:/i)).toBeInTheDocument();
      expect(screen.getByText(/success branch/i)).toBeInTheDocument();
      expect(
        screen.queryByText(/Please upload a file or paste some code/i)
      ).toBeNull();
    });
  });

  // Test: Disables textarea when file is selected
  it("disables textarea when file is selected", () => {
    render(<CodeOptimizer />);
    const file = new File(["export default function Test() {}"], "Test.tsx", {
      type: "text/tsx",
    });
    const fileInput = screen.getByLabelText(/Upload .tsx File/i);
    fireEvent.change(fileInput, { target: { files: [file] } });
    expect(
      screen.getByPlaceholderText(/Paste TypeScript\/TSX code here/i)
    ).toBeDisabled();
  });

  // Test: Enables textarea when no file is selected
  it("enables textarea when no file is selected", () => {
    render(<CodeOptimizer />);
    expect(
      screen.getByPlaceholderText(/Paste TypeScript\/TSX code here/i)
    ).not.toBeDisabled();
  });
  // Helper: Simulate delayed axios response
  function delayedAxiosResponse(data: Record<string, unknown>, delay = 500) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data });
      }, delay);
    });
  }
  // Test: Handles file upload and submits file
  it("handles file upload and submits file", async () => {
    const file = new File(["export default function Test() {}"], "Test.tsx", {
      type: "text/tsx",
    });
    mockedAxios.post.mockResolvedValueOnce({
      data: { optimized: "file optimized" },
    });
    render(<CodeOptimizer />);
    const fileInput = screen.getByLabelText(/Upload .tsx File/i);
    fireEvent.change(fileInput, { target: { files: [file] } });
    fireEvent.click(screen.getByRole("button", { name: /Optimize/i }));
    await waitFor(() => {
      expect(screen.getByText(/file optimized/i)).toBeInTheDocument();
    });
  });

  // Test: Resets form when resetToDefault is called
  it("resets form when resetToDefault is called", async () => {
    render(<CodeOptimizer />);
    fireEvent.change(screen.getByPlaceholderText(/Enter system prompt/i), {
      target: { value: "system" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter user prompt/i), {
      target: { value: "user" },
    });
    fireEvent.change(
      screen.getByPlaceholderText(/Paste TypeScript\/TSX code here/i),
      {
        target: { value: "code" },
      }
    );
    // Simulate form reset by clicking Optimize and waiting for output
    mockedAxios.post.mockResolvedValueOnce({ data: { optimized: "reset" } });
    fireEvent.click(screen.getByRole("button", { name: /Optimize/i }));
    await waitFor(() => {
      expect(screen.getByText(/reset/i)).toBeInTheDocument();
    });
    // After reset, fields should be empty
    expect(screen.getByPlaceholderText(/Enter system prompt/i)).toHaveValue("");
    expect(screen.getByPlaceholderText(/Enter user prompt/i)).toHaveValue("");
    expect(
      screen.getByPlaceholderText(/Paste TypeScript\/TSX code here/i)
    ).toHaveValue("");
  });

  // Test: Shows loading state when optimizing
  it("shows loading state when optimizing", async () => {
    mockedAxios.post.mockImplementation(() =>
      delayedAxiosResponse({ optimized: "done" })
    );
    render(<CodeOptimizer />);
    fireEvent.change(
      screen.getByPlaceholderText(/Paste TypeScript\/TSX code here/i),
      {
        target: { value: "code" },
      }
    );
    fireEvent.click(screen.getByRole("button", { name: /Optimize/i }));
    expect(
      screen.getByRole("button", { name: /Optimizing.../i })
    ).toBeDisabled();
    await waitFor(() => {
      expect(screen.getByText(/done/i)).toBeInTheDocument();
    });
  });

  // Test: Renders error output section
  it("renders error output section", async () => {
    render(<CodeOptimizer />);
    // Simulate error output
    fireEvent.change(
      screen.getByPlaceholderText(/Paste TypeScript\/TSX code here/i),
      {
        target: { value: " " },
      }
    );
    fireEvent.click(screen.getByRole("button", { name: /Optimize/i }));
    await waitFor(() => {
      expect(
        screen.getByText(/Please upload a file or paste some code/i)
      ).toBeInTheDocument();
    });
  });

  // Test: Allows keyboard submit (Enter)
  it("allows keyboard submit (Enter)", async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { optimized: "keyboard submit" },
    });
    const { container } = render(<CodeOptimizer />);
    fireEvent.change(
      screen.getByPlaceholderText(/Paste TypeScript\/TSX code here/i),
      {
        target: { value: "code" },
      }
    );
    const form = container.querySelector("form");
    if (form) {
      fireEvent.submit(form);
    } else {
      throw new Error("Form element not found");
    }
    await waitFor(() => {
      expect(screen.getByText(/keyboard submit/i)).toBeInTheDocument();
    });
  });
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test: Renders all input fields and buttons
  it("renders all input fields and buttons", () => {
    render(<CodeOptimizer />);
    expect(screen.getByText(/TSX Optimizer/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Enter system prompt/i)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Enter user prompt/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Upload .tsx File/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Paste TypeScript\/TSX code here/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Optimize/i })
    ).toBeInTheDocument();
  });

  // Test: Shows error if neither file nor code is provided
  it("shows error if neither file nor code is provided", async () => {
    render(<CodeOptimizer />);
    // Enter a space to enable the submit button
    fireEvent.change(
      screen.getByPlaceholderText(/Paste TypeScript\/TSX code here/i),
      {
        target: { value: " " },
      }
    );
    fireEvent.click(screen.getByRole("button", { name: /Optimize/i }));
    await waitFor(() => {
      expect(
        screen.queryByText(/Please upload a file or paste some code/i)
      ).not.toBeNull();
    });
  });

  // Test: Submits pasted code and displays optimized result
  it("submits pasted code and displays optimized result", async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { optimized: "optimized code" },
    });
    render(<CodeOptimizer />);
    fireEvent.change(
      screen.getByPlaceholderText(/Paste TypeScript\/TSX code here/i),
      {
        target: { value: "const a = 1;" },
      }
    );
    fireEvent.click(screen.getByRole("button", { name: /Optimize/i }));
    await waitFor(() => {
      expect(screen.getByText(/Optimized Code:/i)).toBeInTheDocument();
      const codeBlocks = screen.getAllByText(/optimized code/i);
      expect(codeBlocks.length).toBeGreaterThanOrEqual(1);
    });
  });

  // Test: Submits user and system prompts
  it("submits user and system prompts", async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { optimized: "result" } });
    render(<CodeOptimizer />);
    fireEvent.change(screen.getByPlaceholderText(/Enter system prompt/i), {
      target: { value: "system" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter user prompt/i), {
      target: { value: "user" },
    });
    fireEvent.change(
      screen.getByPlaceholderText(/Paste TypeScript\/TSX code here/i),
      {
        target: { value: "code" },
      }
    );
    fireEvent.click(screen.getByRole("button", { name: /Optimize/i }));
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(FormData),
        expect.objectContaining({ headers: expect.any(Object) })
      );
      // Use a more flexible matcher for result
      expect(
        screen.getByText((content) => content.includes("result"))
      ).toBeInTheDocument();
    });
  });

  // Test: Shows error message on request failure
  it("shows error message on request failure", async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error("Network error"));
    render(<CodeOptimizer />);
    fireEvent.change(
      screen.getByPlaceholderText(/Paste TypeScript\/TSX code here/i),
      {
        target: { value: "code" },
      }
    );
    fireEvent.click(screen.getByRole("button", { name: /Optimize/i }));
    await waitFor(() => {
      // Use a more flexible matcher for error message
      expect(
        screen.getByText((content) => content.includes("Something went wrong"))
      ).toBeInTheDocument();
    });
  });
});
