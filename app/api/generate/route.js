import { NextResponse } from 'next/server';

const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;

export async function POST(request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    console.log('Generating image with NVIDIA AI:', prompt);

    // Generate image directly with NVIDIA AI
    const imageUrl = await generateImageWithNVIDIA(prompt);
    
    return NextResponse.json({ 
      success: true,
      imageUrl: imageUrl,
      prompt: prompt,
      note: 'Generated with NVIDIA AI'
    });

  } catch (error) {
    console.error('Error:', error);
    
    // Fallback to placeholder
    const placeholderUrl = generatePlaceholderImage(prompt);
    return NextResponse.json({ 
      success: true,
      imageUrl: placeholderUrl,
      prompt: prompt,
      note: 'Using placeholder - NVIDIA AI service unavailable'
    });
  }
}

// Generate image with NVIDIA AI
async function generateImageWithNVIDIA(prompt) {
  try {
    // Try different NVIDIA endpoints
    const endpoints = [
      {
        url: 'https://integrate.api.nvidia.com/v1/generate',
        model: 'playground/playground-v2-1024x1024-aesthetic'
      },
      {
        url: 'https://api.nvidia.com/v1/generate',
        model: 'nvidia/edify-image-generator'
      },
      {
        url: 'https://ai.api.nvidia.com/v1/generate',
        model: 'nv-ai-foundation/edify-image-generator'
      },
      {
        url: 'https://integrate.api.nvidia.com/v1/images/generations',
        model: 'playground/playground-v2-1024x1024-aesthetic'
      }
    ];

    let lastError;
    
    for (const endpoint of endpoints) {
      try {
        console.log(`Trying NVIDIA endpoint: ${endpoint.url}`);
        
        const response = await fetch(endpoint.url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${NVIDIA_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: endpoint.model,
            prompt: prompt,
            width: 1024,
            height: 1024,
            steps: 20,
            guidance_scale: 7.5,
            seed: Math.floor(Math.random() * 1000000)
          })
        });

        if (response.ok) {
          const data = await response.json();
          console.log('NVIDIA API response:', data);
          
          // Handle different response formats
          if (data.images && data.images[0]) {
            // Base64 image data
            return `data:image/png;base64,${data.images[0]}`;
          } else if (data.data && data.data[0]) {
            // Alternative format
            return `data:image/png;base64,${data.data[0]}`;
          } else if (data.artifacts && data.artifacts[0]) {
            // Another common format
            return `data:image/png;base64,${data.artifacts[0].base64}`;
          } else if (data.data && data.data.url) {
            // URL format
            return data.data.url;
          } else {
            console.log('Unexpected response format:', data);
            throw new Error('Unexpected response format from NVIDIA API');
          }
        } else {
          const errorText = await response.text();
          lastError = new Error(`NVIDIA API error (${endpoint.url}): ${response.status} ${response.statusText} - ${errorText}`);
          console.log(`Endpoint failed: ${endpoint.url}`, errorText);
        }
      } catch (endpointError) {
        lastError = endpointError;
        console.log(`Endpoint error: ${endpoint.url}`, endpointError);
        continue; // Try next endpoint
      }
    }

    throw lastError || new Error('All NVIDIA endpoints failed');

  } catch (error) {
    console.error('NVIDIA image generation failed:', error);
    throw error;
  }
}

// Fallback placeholder
function generatePlaceholderImage(prompt) {
  const encodedPrompt = encodeURIComponent(prompt.substring(0, 25));
  return `https://placehold.co/600x400/4F46E5/FFFFFF?text=${encodedPrompt}`;
}