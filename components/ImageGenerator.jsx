"use client";
import { useState } from "react";

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  async function generateImage() {
    try {
      setLoading(true);
      setImage(null);

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Image generation failed");
      }

      const base64Image = data.images[0].image;
      const fullImage = `data:image/png;base64,${base64Image}`;
      setImage(fullImage);

    } catch (error) {
      console.error("Generation error:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6">
      <textarea
        placeholder="Enter your prompt..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="border p-2 w-full mb-4"
      />

      <button
        onClick={generateImage}
        className="bg-blue-600 text-white px-4 py-2"
      >
        {loading ? "Generating..." : "Generate Image"}
      </button>

      {image && (
        <img
          src={image}
          alt="Generated"
          className="mt-4 w-full max-w-lg"
        />
      )}
    </div>
  );
}
