import { NextResponse } from 'next/server';

const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;
const NVIDIA_ENDPOINT = process.env.NVIDIA_ENDPOINT;

export async function POST(request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    console.log('Generating image with NVIDIA Stability AI:', prompt);

    // Generate image with your specific NVIDIA endpoint
    const imageUrl = await generateImageWithNVIDIA(prompt);
    
    return NextResponse.json({ 
      success: true,
      imageUrl: imageUrl,
      prompt: prompt,
      note: 'Generated with NVIDIA Stability AI SD 3.5'
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

// Generate image with your specific NVIDIA Stability AI endpoint
async function generateImageWithNVIDIA(prompt) {
  try {
    console.log(`Using NVIDIA endpoint: ${NVIDIA_ENDPOINT}`);
    
    const response = await fetch(NVIDIA_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NVIDIA_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "stabilityai/stable-diffusion-3.5-large",
        prompt: prompt,
        width: 1024,
        height: 1024,
        steps: 20,
        guidance_scale: 7.5,
        seed: Math.floor(Math.random() * 1000000),
        output_format: "png"
      })
    });

    console.log('NVIDIA API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('NVIDIA API error response:', errorText);
      throw new Error(`NVIDIA API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('NVIDIA API success response:', data);

    // Handle NVIDIA Stability AI response format
    if (data.images && data.images[0]) {
      // Base64 image data
      return `data:image/png;base64,${data.images[0]}`;
    } else if (data.artifacts && data.artifacts[0] && data.artifacts[0].base64) {
      // Alternative format with artifacts
      return `data:image/png;base64,${data.artifacts[0].base64}`;
    } else if (data.data && data.data[0]) {
      // Another common format
      return `data:image/png;base64,${data.data[0]}`;
    } else {
      console.log('Unexpected NVIDIA response format:', data);
      throw new Error('Unexpected response format from NVIDIA API');
    }

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