"use client";

import React, { useState } from "react";
import axios from "axios";

const CodeOptimizer = () => {
  const [file, setFile] = useState<File | null>(null);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file && !code.trim()) {
      setOutput("Please upload a file or paste some code.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    if (file) {
      formData.append("file", file);
    } else {
      formData.append("code", code);
    }

    try {
      const res = await axios.post(
        "http://localhost:8000/optimize-code",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setOutput(res.data.optimized || res.data.error);
    } catch (err) {
      console.error(err);
      setOutput("Something went wrong.");
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        ⚡ TSX Optimizer
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 bg-white shadow-lg rounded-2xl p-6 border border-gray-200"
      >
        {/* File Upload */}
        <label className="block">
          <span className="text-gray-700 font-medium">Upload .tsx File</span>
          <input
            type="file"
            accept=".tsx"
            onChange={(e) => {
              setFile(e.target.files?.[0] || null);
              setCode("");
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

        {/* Text Area */}
        <label className="block">
          <span className="text-gray-700 font-medium">Or Paste Code</span>
          <textarea
            className="mt-2 w-full border border-gray-300 rounded-lg p-3 
                       focus:ring-2 focus:ring-blue-500 focus:outline-none 
                       h-48 font-mono text-sm resize-none"
            placeholder="Paste TypeScript/TSX code here..."
            value={code}
            disabled={!!file}
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

      {/* Output Section */}
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

export default CodeOptimizer;
