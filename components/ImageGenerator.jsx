'use client';
import { useState } from 'react';

const categories = {
  nature: {
    prompts: ["Majestic Mountain Landscape", "Serene Forest with Sunbeams", "Tropical Beach Sunset", "Northern Lights Over Fjord", "Waterfall in Jungle"],
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
        const errorData = await response.json();
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setImageUrl(data.imageUrl);
      setGenerationTime(Date.now() - startTime);
      
    } catch (err) {
      console.error('Generation error:', err);
      setError(err.message || 'Failed to generate image. Please check your API configuration.');
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
      if (imageUrl.startsWith('data:')) {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `nvidia-sd35-generated-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `nvidia-sd35-generated-${Date.now()}.png`;
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            NVIDIA AI Image Generator
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Powered by Stability AI Stable Diffusion 3.5
          </p>
          <div className="flex justify-center items-center gap-4 mt-4">
            <div className="flex items-center gap-2 bg-green-100 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-700 font-medium">Connected to NVIDIA AI</span>
            </div>
            <div className="flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-full">
              <span className="text-sm text-blue-700 font-medium">Stable Diffusion 3.5</span>
            </div>
          </div>
        </div>

        {/* Category Selection */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Choose Your Inspiration
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {Object.entries(categories).map(([category, data]) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  selectedCategory === category 
                    ? 'border-green-500 bg-green-50 transform scale-105' 
                    : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                }`}
              >
                <div className="text-2xl mb-2">{data.icon}</div>
                <div className="font-semibold text-gray-800 capitalize">
                  {category}
                </div>
              </button>
            ))}
          </div>

          {/* Prompt Selection */}
          {selectedCategory && (
            <div className="border-t pt-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                Choose a {selectedCategory} theme:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                {categories[selectedCategory].prompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => generateImage(prompt)}
                    disabled={isLoading}
                    className="p-3 text-left bg-gray-50 hover:bg-green-50 border border-gray-200 
                             rounded-lg transition-colors duration-200 disabled:opacity-50
                             hover:border-green-300 hover:shadow-md"
                  >
                    <span className="text-gray-800 font-medium">{prompt}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Custom Prompt */}
          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              Or Create Your Own Prompt
            </h3>
            <form onSubmit={handleCustomSubmit} className="max-w-2xl mx-auto">
              <div className="flex gap-4">
                <input
                  type="text"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Describe exactly what you want to see..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl 
                           focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !customPrompt.trim()}
                  className="px-6 py-3 bg-green-600 text-white font-semibold rounded-xl 
                           hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed
                           transition duration-200"
                >
                  {isLoading ? 'Generating...' : 'Generate'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
              <p className="mt-4 text-lg text-gray-600 text-center">
                NVIDIA AI is generating your image...
              </p>
              <p className="text-sm text-gray-500 mt-2">
                "{selectedPrompt}"
              </p>
              <p className="text-xs text-gray-400 mt-4">
                Using Stable Diffusion 3.5 - This may take 10-30 seconds
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
            <h3 className="text-red-800 font-semibold mb-2">Error</h3>
            <p className="text-red-600">{error}</p>
            <div className="mt-4 text-sm text-red-600">
              <p>Check your:</p>
              <ul className="list-disc list-inside mt-1">
                <li>NVIDIA API key in .env file</li>
                <li>Endpoint URL configuration</li>
                <li>API quota and permissions</li>
              </ul>
            </div>
            <button 
              onClick={() => setError('')}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg text-sm"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Results */}
        {imageUrl && !isLoading && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Image */}
              <div className="lg:w-2/3">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    AI Generated Image
                  </h2>
                  <button
                    onClick={handleDownload}
                    className="px-6 py-2 bg-green-600 text-white font-semibold 
                             rounded-lg hover:bg-green-700 transition duration-200"
                  >
                    Download
                  </button>
                </div>
                
                <div className="border-2 border-gray-200 rounded-xl overflow-hidden 
                              shadow-lg bg-gray-50">
                  <img 
                    src={imageUrl} 
                    alt={`NVIDIA AI Generated: ${selectedPrompt}`}
                    className="w-full h-auto max-w-2xl mx-auto"
                    onError={() => setError('Failed to load generated image')}
                  />
                </div>

                {/* Generation Info */}
                <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
                  <span>Generated in {(generationTime / 1000).toFixed(1)}s</span>
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    NVIDIA Stability AI SD 3.5
                  </span>
                </div>
              </div>

              {/* Info Panel */}
              <div className="lg:w-1/3">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Generation Details
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">AI Prompt</p>
                      <p className="font-semibold text-gray-800">"{selectedPrompt}"</p>
                    </div>

                    <div className="pt-4 border-t border-gray-200 space-y-3">
                      <button
                        onClick={() => generateImage(selectedPrompt)}
                        className="w-full px-4 py-2 bg-green-600 text-white rounded-lg
                                 hover:bg-green-700 transition duration-200"
                      >
                        Generate Again
                      </button>
                      
                      <button
                        onClick={() => {
                          const prompts = selectedCategory ? categories[selectedCategory].prompts : [];
                          const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)] || selectedPrompt;
                          generateImage(randomPrompt);
                        }}
                        className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg
                                 hover:bg-blue-600 transition duration-200"
                      >
                        Try Similar
                      </button>
                      
                      <button
                        onClick={() => {
                          setSelectedCategory(null);
                          setCustomPrompt('');
                          setImageUrl('');
                          setError('');
                        }}
                        className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg
                                 hover:bg-gray-600 transition duration-200"
                      >
                        Create New
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tech Info Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mt-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            🚀 Powered by NVIDIA & Stability AI
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Technology Stack</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">AI Model:</span>
                  <span className="font-semibold">Stable Diffusion 3.5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Platform:</span>
                  <span className="font-semibold">NVIDIA AI Foundation</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Resolution:</span>
                  <span className="font-semibold">1024×1024px</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Framework:</span>
                  <span className="font-semibold">Next.js 14</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Best Practices</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Be descriptive with colors and lighting</li>
                <li>• Specify art style (realistic, painting, etc.)</li>
                <li>• Include composition details</li>
                <li>• Add mood and atmosphere elements</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}