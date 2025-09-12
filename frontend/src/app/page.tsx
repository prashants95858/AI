// Import the CodeOptimizer component for TSX code optimization UI
import CodeOptimizer from "@/components/CodeOptimizer";

// Home page component for the application
export default function Home() {
  return (
    // Main container with minimum height and styling
    <main className="min-h-screen bg-white text-black">
      {/* Render the CodeOptimizer component */}
      <CodeOptimizer />
    </main>
  );
}
