'use client';
import { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError('');
    setImageUrl('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }

      setImageUrl(data.imageUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `ai-generated-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Failed to download image');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            AI Image Generator
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform your imagination into stunning visuals with AI-powered image generation
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="flex flex-col space-y-4">
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the image you want to generate... 
(e.g., 'A serene landscape with mountains and a lake at sunset, digital art style')"
                  className="w-full h-32 px-4 py-3 border border-gray-300 rounded-xl 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           resize-none text-gray-700 placeholder-gray-400"
                  disabled={isLoading}
                />
                <div className="absolute bottom-3 right-3 text-sm text-gray-400">
                  {prompt.length}/1000
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isLoading || !prompt.trim()}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 
                         text-white font-semibold rounded-xl hover:from-blue-600 
                         hover:to-purple-700 focus:outline-none focus:ring-2 
                         focus:ring-blue-500 focus:ring-offset-2 transition 
                         duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                         transform hover:scale-105 disabled:hover:scale-100"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <LoadingSpinner />
                    Generating...
                  </span>
                ) : (
                  '✨ Generate Image'
                )}
              </button>
            </div>
          </form>

          {error && <ErrorMessage message={error} />}

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-16">
              <LoadingSpinner size="large" />
              <p className="mt-4 text-lg text-gray-600 text-center">
                Creating your masterpiece... This may take 10-20 seconds.
              </p>
            </div>
          )}

          {imageUrl && !isLoading && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Your Generated Image
                </h2>
                <button
                  onClick={handleDownload}
                  className="px-6 py-2 bg-green-500 text-white font-semibold 
                           rounded-lg hover:bg-green-600 focus:outline-none 
                           focus:ring-2 focus:ring-green-500 transition duration-200"
                >
                  Download
                </button>
              </div>
              
              <div className="border-2 border-gray-200 rounded-xl overflow-hidden 
                            shadow-lg bg-gray-50">
                <img 
                  src={imageUrl} 
                  alt={`Generated: ${prompt}`}
                  className="w-full h-auto max-w-2xl mx-auto"
                  onError={() => setError('Failed to load image')}
                />
              </div>
              
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2 font-semibold">
                  Prompt used:
                </p>
                <p className="text-gray-800 italic">"{prompt}"</p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            💡 Tips for Better Images
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-gray-600">
            <ul className="space-y-2">
              <li>• Be specific about colors and style</li>
              <li>• Mention the art style (digital, painting, photo)</li>
              <li>• Include lighting and mood details</li>
            </ul>
            <ul className="space-y-2">
              <li>• Specify composition and perspective</li>
              <li>• Add details about the subject</li>
              <li>• Include background elements</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}