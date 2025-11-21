'use client';
import { useState } from 'react';

const categories = {
  nature: {
    prompts: ["Majestic Mountain Landscape", "Serene Forest with Sunbeams", "Tropical Beach Sunset"],
    icon: "🌲"
  },
  animals: {
    prompts: ["Majestic Lion Portrait", "Playful Dolphin Jumping", "Colorful Tropical Birds"],
    icon: "🐾"
  },
  fantasy: {
    prompts: ["Dragon in Medieval Castle", "Unicorn in Enchanted Forest", "Wizard with Magic Staff"],
    icon: "✨"
  },
  architecture: {
    prompts: ["Modern Skyscraper City", "Historic European Castle", "Japanese Temple Garden"],
    icon: "🏛️"
  },
  abstract: {
    prompts: ["Colorful Geometric Patterns", "Fluid Liquid Art", "Cosmic Nebula Explosion"],
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
      if (imageUrl.startsWith('data:')) {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `nvidia-ai-generated-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `nvidia-ai-generated-${Date.now()}.png`;
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            NVIDIA AI Image Generator
          </h1>
          <p className="text-xl text-gray-600">
            Powered by NVIDIA AI - Real AI image generation
          </p>
          <div className="mt-2 flex justify-center items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-600">Connected to NVIDIA AI</span>
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
                  className="px-6 py-3 bg-green-500 text-white font-semibold rounded-xl 
                           hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed
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
                This may take 10-30 seconds
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
            <h3 className="text-red-800 font-semibold mb-2">Error</h3>
            <p className="text-red-600">{error}</p>
            <button 
              onClick={() => setError('')}
              className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg text-sm"
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
                    NVIDIA AI Generated Image
                  </h2>
                  <button
                    onClick={handleDownload}
                    className="px-6 py-2 bg-green-500 text-white font-semibold 
                             rounded-lg hover:bg-green-600 transition duration-200"
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
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Powered by NVIDIA AI
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
                      <p className="font-semibold">"{selectedPrompt}"</p>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <button
                        onClick={() => generateImage(selectedPrompt)}
                        className="w-full px-4 py-2 bg-green-500 text-white rounded-lg
                                 hover:bg-green-600 transition duration-200 mb-3"
                      >
                        Generate Again
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
                        Create New Image
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mt-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            🚀 Powered by NVIDIA AI
          </h3>
          <div className="grid md:grid-cols-2 gap-6 text-gray-600">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">How It Works</h4>
              <ul className="space-y-2 text-sm">
                <li>• Enter your prompt or choose from categories</li>
                <li>• NVIDIA AI generates unique images in seconds</li>
                <li>• Download high-quality PNG files</li>
                <li>• No watermarks - your creations</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Tips for Best Results</h4>
              <ul className="space-y-2 text-sm">
                <li>• Be specific about style and composition</li>
                <li>• Include colors, lighting, and mood</li>
                <li>• Mention art style (photo, painting, digital)</li>
                <li>• Add details about background and subjects</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}