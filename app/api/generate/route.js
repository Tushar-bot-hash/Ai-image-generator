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

    console.log('Generating image for:', prompt);

    // Use Pollinations.ai (FREE, no API key needed)
    const imageUrl = await generateWithPollinations(prompt);
    
    return NextResponse.json({ 
      success: true,
      imageUrl: imageUrl,
      prompt: prompt,
      note: 'Generated with Pollinations.ai'
    });

  } catch (error) {
    console.error('Error:', error);
    
    // Fallback to relevant images
    const placeholderUrl = generateRelevantImage(prompt);
    return NextResponse.json({ 
      success: true,
      imageUrl: placeholderUrl,
      prompt: prompt,
      note: 'Using relevant demo image'
    });
  }
}

// Generate images with Pollinations.ai (FREE)
async function generateWithPollinations(prompt) {
  try {
    // Pollinations.ai API - FREE, no authentication required
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=512`;
    
    console.log('Calling Pollinations.ai:', pollinationsUrl);
    
    const response = await fetch(pollinationsUrl);
    
    if (!response.ok) {
      throw new Error(`Pollinations.ai error: ${response.status}`);
    }

    // Pollinations returns the image directly
    const blob = await response.blob();
    return URL.createObjectURL(blob);
    
  } catch (error) {
    console.error('Pollinations.ai failed:', error);
    throw error;
  }
}

// Fallback to relevant Unsplash images
function generateRelevantImage(prompt) {
  const promptLower = prompt.toLowerCase();
  
  const imageMap = {
    'mountain': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=512&h=512&fit=crop',
    'landscape': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=512&h=512&fit=crop',
    'forest': 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=512&h=512&fit=crop',
    'beach': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=512&h=512&fit=crop',
    'sunset': 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=512&h=512&fit=crop',
    'lion': 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=512&h=512&fit=crop',
    'animal': 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=512&h=512&fit=crop',
    'cat': 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=512&h=512&fit=crop',
    'dog': 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=512&h=512&fit=crop',
    'dolphin': 'https://images.unsplash.com/photo-1514894780887-121968d00567?w=512&h=512&fit=crop',
    'dragon': 'https://images.unsplash.com/photo-1543857778-c4a1a569eafe?w=512&h=512&fit=crop',
    'fantasy': 'https://images.unsplash.com/photo-1543857778-c4a1a569eafe?w=512&h=512&fit=crop',
    'castle': 'https://images.unsplash.com/photo-1596484552830-5a82ac18c28b?w=512&h=512&fit=crop',
    'city': 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=512&h=512&fit=crop',
    'building': 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=512&h=512&fit=crop',
    'abstract': 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=512&h=512&fit=crop',
    'space': 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=512&h=512&fit=crop',
  };

  // Find the best matching image
  for (const [keyword, url] of Object.entries(imageMap)) {
    if (promptLower.includes(keyword)) {
      return url;
    }
  }

  // Default placeholder
  const encodedPrompt = encodeURIComponent(prompt.substring(0, 20));
  return `https://placehold.co/512x512/4F46E5/FFFFFF?text=${encodedPrompt}`;
}