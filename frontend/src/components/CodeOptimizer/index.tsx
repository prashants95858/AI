"use client"; // Next.js directive for client-side component

// Import React and hooks
import React, { useState } from "react";
// Import axios for HTTP requests
import axios from "axios";

// Main component for TSX code optimization UI
const CodeOptimizer = () => {
  // State for uploaded file
  const [file, setFile] = useState<File | null>(null);
  // State for pasted code
  const [code, setCode] = useState("");
  // State for output from backend
  const [output, setOutput] = useState("");
  // State for loading indicator
  const [loading, setLoading] = useState(false);
  // State for user prompt
  const [userPrompt, setUserPrompt] = useState("");
  // State for dynamic prompt
  const [systemPrompt, setSystemPrompt] = useState("");
  // Reference for file input
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  // Function to reset form to default state
  const resetToDefault = () => {
    setFile(null);
    inputRef.current!.value = "";
    setCode("");
    setUserPrompt("");
    setSystemPrompt("");
  };

  // Handle form submission for code/file optimization
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate input: require file or code
    if (!file && !code.trim()) {
      setOutput("Please upload a file or paste some code.");
      return;
    }
    setOutput("");
    setLoading(true);
    const formData = new FormData();
    if (file) {
      // If file is uploaded, append to form data
      formData.append("file", file);
    } else {
      // Otherwise, append code string
      formData.append("code", code);
    }

    // Add user prompt and system prompt to form data
    if (userPrompt.trim()) {
      formData.append("user_prompt", userPrompt);
    }
    if (systemPrompt.trim()) {
      formData.append("system_prompt", systemPrompt);
    }

    try {
      // Send POST request to backend API
      const res = await axios.post(
        "http://localhost:8000/optimize-tsx-code",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // Set output to optimized code or error message
      setOutput(res.data.optimized || res.data.error);
      resetToDefault();
    } catch (err) {
      // Log error and show generic error message
      console.error(err);
      setOutput("Something went wrong.");
    }
    setLoading(false);
  };

  // Render UI for code/file upload, submit, and output
  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        ⚡ TSX Optimizer
      </h1>

      {/* Form for file upload or code paste */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 bg-white shadow-lg rounded-2xl p-6 border border-gray-200"
      >
        {/* System Prompt Input */}
        <label className="block">
          <span className="text-gray-700 font-medium">System Prompt</span>
          <input
            type="text"
            className="mt-2 w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
            placeholder="Enter system prompt (instruction)"
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
          />
        </label>

        {/* User Prompt Input */}
        <label className="block">
          <span className="text-gray-700 font-medium">User Prompt</span>
          <input
            type="text"
            className="mt-2 w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
            placeholder="Enter user prompt (instruction)"
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
          />
        </label>
        {/* File Upload Section */}
        <label className="block">
          <span className="text-gray-700 font-medium">Upload .tsx File</span>
          <input
            ref={inputRef}
            type="file"
            accept=".tsx"
            onChange={(e) => {
              setFile(e.target.files?.[0] || null);
              setCode(""); // Clear code when file is selected
            }}
            className="mt-2 block w-full text-sm text-gray-700 
                       border border-gray-300 rounded-lg cursor-pointer 
                       bg-gray-50 file:mr-4 file:py-2 file:px-4
                       file:rounded-lg file:border-0
                       file:text-sm file:font-semibold
                       file:bg-blue-600 file:text-white
                       hover:file:bg-blue-700"
          />
        </label>

        {/* Text Area Section for code paste */}
        <label className="block">
          <span className="text-gray-700 font-medium">Or Paste Code</span>
          <textarea
            className="mt-2 w-full border border-gray-300 rounded-lg p-3 
                       focus:ring-2 focus:ring-blue-500 focus:outline-none 
                       h-48 font-mono text-sm resize-none"
            placeholder="Paste TypeScript/TSX code here..."
            value={code}
            disabled={!!file} // Disable textarea if file is selected
            onChange={(e) => setCode(e.target.value)}
          />
        </label>

        {/* Submit Button */}
        <button
          className="bg-blue-600 text-white py-2 px-6 rounded-lg 
                     font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          type="submit"
          disabled={loading || (!code && !file)}
        >
          {loading ? "Optimizing..." : "Optimize"}
        </button>
      </form>

      {/* Output Section for optimized code or errors */}
      {output && (
        <div className="mt-6 p-5 border border-gray-300 bg-gray-50 rounded-lg shadow-inner">
          <h2 className="font-semibold mb-3 text-gray-800">Optimized Code:</h2>
          <pre className="bg-black text-green-400 p-4 rounded-lg overflow-y-auto whitespace-pre-wrap break-words text-sm max-h-96">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
};

// Export the component as default
export default CodeOptimizer;
