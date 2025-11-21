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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Server error: ${response.status}`);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      // Add cache busting to ensure fresh image
      const cacheBustUrl = data.imageUrl + (data.imageUrl.includes('?') ? '&' : '?') + `t=${Date.now()}`;
      setImageUrl(cacheBustUrl);
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
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pollinations-${selectedPrompt.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Failed to download image');
    }
  };

  // Debug input change
  const handleInputChange = (e) => {
    console.log('Input value:', e.target.value);
    setCustomPrompt(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Pollinations.ai Generator
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-4">
            Free AI Image Generation powered by Pollinations.ai
          </p>
          <div className="flex flex-wrap justify-center items-center gap-3">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              ✅ No API Key Required
            </span>
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
              🚀 Fast Generation
            </span>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              🎨 Multiple Styles
            </span>
          </div>
        </div>

        {/* Main Generator Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Choose Your Inspiration
          </h2>
          
          {/* Category Selection */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
            {Object.entries(categories).map(([category, data]) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                disabled={isLoading}
                className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                  selectedCategory === category 
                    ? 'border-purple-500 bg-purple-50 shadow-md' 
                    : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="text-2xl mb-1">{data.icon}</div>
                <div className="font-medium text-gray-800 text-sm capitalize">
                  {category}
                </div>
              </button>
            ))}
          </div>

          {/* Prompt Selection */}
          {selectedCategory && (
            <div className="border-t pt-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {categories[selectedCategory].icon} Choose a {selectedCategory} theme:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {categories[selectedCategory].prompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => generateImage(prompt)}
                    disabled={isLoading}
                    className="p-3 text-left bg-gray-50 hover:bg-purple-50 border border-gray-200 
                             rounded-lg transition-all duration-200 disabled:opacity-50
                             hover:border-purple-300 hover:shadow-sm"
                  >
                    <span className="text-gray-800 font-medium">{prompt}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Custom Prompt Input - FIXED VERSION */}
          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              ✨ Or Create Your Own Prompt
            </h3>
            <form onSubmit={handleCustomSubmit} className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={customPrompt}
                  onChange={handleInputChange}
                  placeholder="Describe your image in detail... (e.g., 'a majestic dragon flying over a medieval castle at sunset')"
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl 
                           focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                           disabled:opacity-50 placeholder-gray-400 bg-white text-gray-900"
                  disabled={isLoading}
                  style={{ 
                    color: '#000000',
                    backgroundColor: '#ffffff',
                    borderColor: '#d1d5db'
                  }}
                />
                <button
                  type="submit"
                  disabled={isLoading || !customPrompt.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-xl 
                           hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed
                           transition-all duration-200 min-w-[140px] shadow-sm"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Generating...
                    </span>
                  ) : (
                    'Generate Image'
                  )}
                </button>
              </div>
              
              {/* Debug display - shows what you're typing */}
              {customPrompt && (
                <div className="p-3 bg-gray-100 rounded-lg border border-gray-300">
                  <p className="text-sm text-gray-600 font-medium">You're typing:</p>
                  <p className="text-gray-800 font-semibold">"{customPrompt}"</p>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mb-4"></div>
              <p className="text-lg font-semibold text-gray-700 mb-2">
                AI is creating your image...
              </p>
              <p className="text-gray-500 text-center mb-1">
                &ldquo;{selectedPrompt}&rdquo;
              </p>
              <p className="text-sm text-gray-400 mt-4">
                Powered by Pollinations.ai • This usually takes 10-30 seconds
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
            <div className="flex items-start">
              <div className="text-red-500 text-xl mr-3">⚠️</div>
              <div>
                <h3 className="text-red-800 font-semibold mb-1">Generation Error</h3>
                <p className="text-red-600">{error}</p>
                <button 
                  onClick={() => setError('')}
                  className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {imageUrl && !isLoading && (
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              
              {/* Image Display */}
              <div className="lg:w-2/3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    🎉 Your Generated Image
                  </h2>
                  <button
                    onClick={handleDownload}
                    className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg 
                             hover:bg-green-600 transition duration-200 shadow-sm flex items-center gap-2"
                  >
                    <span>📥</span>
                    Download Image
                  </button>
                </div>
                
                {/* Image Container */}
                <div className="border-2 border-gray-200 rounded-xl overflow-hidden 
                              shadow-lg bg-gray-50 flex justify-center">
                  <img 
                    src={imageUrl} 
                    alt={`AI Generated: ${selectedPrompt}`}
                    className="w-full h-auto max-w-2xl"
                    onError={() => setError('Failed to load generated image. Please try generating again.')}
                  />
                </div>

                {/* Generation Info */}
                <div className="mt-4 flex flex-wrap justify-between items-center gap-2 text-sm text-gray-600">
                  <span>⏱️ Generated in {(generationTime / 1000).toFixed(1)}s</span>
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    Powered by Pollinations.ai
                  </span>
                </div>

                {/* Prompt Display */}
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1 font-medium">Prompt used:</p>
                  <p className="text-gray-800">&ldquo;{selectedPrompt}&rdquo;</p>
                </div>
              </div>

              {/* Action Buttons Sidebar */}
              <div className="lg:w-1/3">
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    🔧 Actions
                  </h3>
                  
                  <div className="space-y-3">
                    <button
                      onClick={() => generateImage(selectedPrompt)}
                      className="w-full px-4 py-3 bg-purple-500 text-white rounded-lg
                               hover:bg-purple-600 transition duration-200 font-semibold shadow-sm"
                    >
                      🔄 Generate Again
                    </button>
                    
                    {selectedCategory && (
                      <button
                        onClick={() => {
                          const prompts = categories[selectedCategory].prompts;
                          const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
                          generateImage(randomPrompt);
                        }}
                        className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg
                                 hover:bg-blue-600 transition duration-200 font-semibold shadow-sm"
                      >
                        🎲 Random {selectedCategory} Image
                      </button>
                    )}
                    
                    <button
                      onClick={() => {
                        setSelectedCategory(null);
                        setCustomPrompt('');
                        setImageUrl('');
                        setError('');
                      }}
                      className="w-full px-4 py-3 bg-gray-500 text-white rounded-lg
                               hover:bg-gray-600 transition duration-200 font-semibold shadow-sm"
                    >
                      🆕 Create New Image
                    </button>
                  </div>

                  {/* Tips */}
                  <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-xs text-blue-700">
                      <strong>💡 Tip:</strong> For better results, be descriptive with colors, style, and mood in your prompts.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>Powered by Pollinations.ai • Free AI Image Generation • No API Key Required</p>
        </div>

      </div>
    </div>
  );
}