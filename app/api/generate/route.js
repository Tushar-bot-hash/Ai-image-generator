import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    console.log('Mock generating image for:', prompt);

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Create a placeholder image that matches the prompt theme
    const placeholderUrl = generatePlaceholderImage(prompt);
    
    return NextResponse.json({ 
      success: true,
      imageUrl: placeholderUrl,
      note: 'Demo version - using placeholder service'
    });

  } catch (error) {
    console.error('Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate image',
        details: error.message
      },
      { status: 500 }
    );
  }
}

// Function to generate relevant placeholder images based on prompt
function generatePlaceholderImage(prompt) {
  const promptLower = prompt.toLowerCase();
  
  // Map keywords to relevant placeholder images
  if (promptLower.includes('dog') || promptLower.includes('puppy') || promptLower.includes('animal')) {
    return 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=512&h=512&fit=crop';
  }
  else if (promptLower.includes('cat') || promptLower.includes('kitten')) {
    return 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=512&h=512&fit=crop';
  }
  else if (promptLower.includes('landscape') || promptLower.includes('mountain') || promptLower.includes('nature')) {
    return 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=512&h=512&fit=crop';
  }
  else if (promptLower.includes('car') || promptLower.includes('vehicle') || promptLower.includes('auto')) {
    return 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=512&h=512&fit=crop';
  }
  else if (promptLower.includes('portrait') || promptLower.includes('person') || promptLower.includes('people')) {
    return 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=512&h=512&fit=crop';
  }
  else if (promptLower.includes('food') || promptLower.includes('restaurant') || promptLower.includes('meal')) {
    return 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=512&h=512&fit=crop';
  }
  else if (promptLower.includes('city') || promptLower.includes('urban') || promptLower.includes('building')) {
    return 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=512&h=512&fit=crop';
  }
  else if (promptLower.includes('beach') || promptLower.includes('ocean') || promptLower.includes('sea')) {
    return 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=512&h=512&fit=crop';
  }
  else if (promptLower.includes('abstract') || promptLower.includes('art') || promptLower.includes('design')) {
    return 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=512&h=512&fit=crop';
  }
  else if (promptLower.includes('space') || promptLower.includes('planet') || promptLower.includes('universe')) {
    return 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=512&h=512&fit=crop';
  }
  else {
    // Default - use placeholder service with prompt as text
    const encodedPrompt = encodeURIComponent(prompt.substring(0, 30));
    return `https://placehold.co/512x512/4F46E5/FFFFFF?text=${encodedPrompt}`;
  }
}