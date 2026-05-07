"use client";
import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generate() {
    if (!prompt.trim()) {
      setError("プロンプトを入力してください");
      return;
    }
    setLoading(true);
    setError("");
    setImage("");

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();

    if (data.error) {
      setError(data.error);
    } else {
      setImage(data.image);
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center py-20 px-4">
      <h1 className="text-4xl font-bold mb-2">AI画像生成</h1>
      <p className="text-gray-400 mb-10">テキストから画像を生成します</p>

      <div className="w-full max-w-xl flex gap-2">
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && generate()}
          placeholder="例：a cat in space"
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={generate}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-6 py-3 rounded-lg font-medium transition-colors"
        >
          {loading ? "生成中..." : "生成"}
        </button>
      </div>

      {error && (
        <p className="text-red-400 mt-4">{error}</p>
      )}

      {loading && (
        <p className="text-gray-400 mt-10 animate-pulse">画像を生成しています...</p>
      )}

      {image && (
        <div className="mt-10 w-full max-w-xl">
          <img
            src={image}
            alt="generated"
            className="rounded-xl w-full shadow-2xl"
          />
          <a
            href={image}
            download="generated.png"
            className="mt-4 flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            ダウンロード
          </a>
        </div>
      )}
    </main>
  );
}