'use client';
import { useState } from 'react';

const categories = {
  nature: {
    prompts: ["Majestic Mountain Landscape", "Serene Forest with Sunbeams", "Tropical Beach Sunset", "Northern Lights", "Waterfall in Jungle"],
    icon: "🌲"
  },
  animals: {
    prompts: ["Majestic Lion Portrait", "Playful Dolphin Jumping", "Colorful Tropical Birds", "Wolf in Snowy Forest", "Elephant Family"],
    icon: "🐾"
  },
  fantasy: {
    prompts: ["Dragon in Medieval Castle", "Unicorn in Enchanted Forest", "Wizard with Magic Staff", "Fairy Kingdom", "Space Alien Landscape"],
    icon: "✨"
  },
  architecture: {
    prompts: ["Modern Skyscraper City", "Historic European Castle", "Japanese Temple Garden", "Futuristic Cyberpunk Street", "Minimalist Desert House"],
    icon: "🏛️"
  },
  abstract: {
    prompts: ["Colorful Geometric Patterns", "Fluid Liquid Art", "Cosmic Nebula Explosion", "Digital Glitch Art", "Surreal Dreamscape"],
    icon: "🎨"
  }
};

export default function ImageGenerator() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [generationTime, setGenerationTime] = useState(0);

  const generateImage = async (prompt) => {
    if (!prompt.trim()) return;

    const startTime = Date.now();
    setIsLoading(true);
    setError('');
    setImageUrl('');
    setSelectedPrompt(prompt);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setImageUrl(data.imageUrl);
      setGenerationTime(Date.now() - startTime);
      
    } catch (err) {
      console.error('Generation error:', err);
      setError(err.message || 'Failed to generate image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;
    generateImage(customPrompt);
  };

  const handleDownload = async () => {
    try {
      if (imageUrl.startsWith('blob:')) {
        // For blob URLs from Pollinations.ai
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ai-generated-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        // For regular URLs
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ai-generated-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (err) {
      setError('Failed to download image');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            AI Image Generator
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Free AI Image Generation - No API Key Required
          </p>
          <div className="flex justify-center items-center gap-4 mt-4">
            <div className="flex items-center gap-2 bg-green-100 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-700 font-medium">Powered by Pollinations.ai</span>
            </div>
            <div className="flex items-center gap-2 bg-purple-100 px-3 py-1 rounded-full">
              <span className="text-sm text-purple-700 font-medium">100% Free</span>
            </div>
          </div>
        </div>

        {/* Rest of your component remains the same, just update the loading message */}

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
              <p className="mt-4 text-lg text-gray-600 text-center">
                AI is generating your image...
              </p>
              <p className="text-sm text-gray-500 mt-2">
                "{selectedPrompt}"
              </p>
              <p className="text-xs text-gray-400 mt-4">
                Using Pollinations.ai - This may take 10-20 seconds
              </p>
            </div>
          </div>
        )}

        {/* Results */}
        {imageUrl && !isLoading && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-2/3">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    AI Generated Image
                  </h2>
                  <button
                    onClick={handleDownload}
                    className="px-6 py-2 bg-purple-500 text-white font-semibold 
                             rounded-lg hover:bg-purple-600 transition duration-200"
                  >
                    Download
                  </button>
                </div>
                
                <div className="border-2 border-gray-200 rounded-xl overflow-hidden 
                              shadow-lg bg-gray-50">
                  <img 
                    src={imageUrl} 
                    alt={`AI Generated: ${selectedPrompt}`}
                    className="w-full h-auto max-w-2xl mx-auto"
                    onError={() => setError('Failed to load generated image')}
                  />
                </div>

                <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
                  <span>Generated in {(generationTime / 1000).toFixed(1)}s</span>
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    Powered by Pollinations.ai
                  </span>
                </div>
              </div>

              {/* Info panel remains the same */}
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mt-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            🎨 Free AI Image Generation
          </h3>
          <div className="grid md:grid-cols-3 gap-6 text-gray-600">
            <div className="text-center">
              <div className="text-3xl mb-3">🆓</div>
              <h4 className="font-semibold text-gray-800 mb-2">Completely Free</h4>
              <p className="text-sm">No API keys, no credit card, no limits</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">⚡</div>
              <h4 className="font-semibold text-gray-800 mb-2">Fast Generation</h4>
              <p className="text-sm">Get AI images in seconds</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🔧</div>
              <h4 className="font-semibold text-gray-800 mb-2">Easy to Use</h4>
              <p className="text-sm">Simple prompts, great results</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}