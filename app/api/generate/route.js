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

    // Try multiple approaches
    let imageUrl;
    let note = 'Generated with AI';
    
    try {
      // First try: Direct image proxy to avoid CORS
      imageUrl = await generateWithDirectProxy(prompt);
      note = 'Generated with AI';
    } catch (error1) {
      console.log('Direct proxy failed:', error1.message);
      
      try {
        // Second try: Alternative AI service
        imageUrl = await generateWithAlternativeAI(prompt);
        note = 'Generated with AI service';
      } catch (error2) {
        console.log('Alternative AI failed:', error2.message);
        
        // Final fallback: Relevant images
        imageUrl = generateRelevantImage(prompt);
        note = 'Using relevant demo image';
      }
    }
    
    return NextResponse.json({ 
      success: true,
      imageUrl: imageUrl,
      prompt: prompt,
      note: note
    });

  } catch (error) {
    console.error('All methods failed:', error);
    
    // Ultimate fallback
    const placeholderUrl = generateBasicPlaceholder(prompt);
    return NextResponse.json({ 
      success: true,
      imageUrl: placeholderUrl,
      prompt: prompt,
      note: 'Demo mode - using placeholder'
    });
  }
}

// Method 1: Direct proxy to avoid CORS
async function generateWithDirectProxy(prompt) {
  try {
    // Use a proxy approach - fetch image and convert to base64
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=512`;
    
    console.log('Trying direct proxy to:', pollinationsUrl);
    
    const response = await fetch(pollinationsUrl);
    
    if (!response.ok) {
      throw new Error(`Pollinations.ai error: ${response.status}`);
    }

    // Convert to base64 to avoid CORS issues
    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    return `data:image/png;base64,${base64}`;
    
  } catch (error) {
    throw new Error(`Direct proxy failed: ${error.message}`);
  }
}

// Method 2: Alternative AI service
async function generateWithAlternativeAI(prompt) {
  try {
    // Try Hugging Face Inference API (free tier)
    const response = await fetch(
      'https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5',
      {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer YOUR_HUGGING_FACE_TOKEN', // Optional for some models
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          inputs: prompt,
          options: {
            wait_for_model: true
          }
        }),
      }
    );

    if (response.ok) {
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } else {
      const errorText = await response.text();
      throw new Error(`Hugging Face error: ${response.status} - ${errorText}`);
    }
    
  } catch (error) {
    throw new Error(`Alternative AI failed: ${error.message}`);
  }
}

// Method 3: Relevant Unsplash images (your existing function)
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
    'building': 'https://images.unsplash.com/-1487958449943-2429e8be8625?w=512&h=512&fit=crop',
    'abstract': 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=512&h=512&fit=crop',
    'space': 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=512&h=512&fit=crop',
    'portrait': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=512&h=512&fit=crop',
    'people': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=512&h=512&fit=crop',
    'car': 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=512&h=512&fit=crop',
    'food': 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=512&h=512&fit=crop',
  };

  // Find the best matching image
  for (const [keyword, url] of Object.entries(imageMap)) {
    if (promptLower.includes(keyword)) {
      return url;
    }
  }

  // If no match, use a more sophisticated search
  return generateSmartPlaceholder(prompt);
}

// Smart placeholder based on prompt content
function generateSmartPlaceholder(prompt) {
  const promptLower = prompt.toLowerCase();
  
  // Color-based placeholders for different themes
  if (promptLower.includes('night') || promptLower.includes('dark')) {
    return `https://placehold.co/512x512/1e3a8a/FFFFFF?text=${encodeURIComponent(prompt.substring(0, 15))}`;
  } else if (promptLower.includes('sunset') || promptLower.includes('sunrise')) {
    return `https://placehold.co/512x512/f59e0b/FFFFFF?text=${encodeURIComponent(prompt.substring(0, 15))}`;
  } else if (promptLower.includes('ocean') || promptLower.includes('water')) {
    return `https://placehold.co/512x512/0ea5e9/FFFFFF?text=${encodeURIComponent(prompt.substring(0, 15))}`;
  } else if (promptLower.includes('nature') || promptLower.includes('green')) {
    return `https://placehold.co/512x512/10b981/FFFFFF?text=${encodeURIComponent(prompt.substring(0, 15))}`;
  } else if (promptLower.includes('fire') || promptLower.includes('red')) {
    return `https://placehold.co/512x512/dc2626/FFFFFF?text=${encodeURIComponent(prompt.substring(0, 15))}`;
  } else {
    return `https://placehold.co/512x512/4F46E5/FFFFFF?text=${encodeURIComponent(prompt.substring(0, 15))}`;
  }
}

// Basic fallback
function generateBasicPlaceholder(prompt) {
  const encodedPrompt = encodeURIComponent(prompt.substring(0, 20));
  return `https://placehold.co/512x512/4F46E5/FFFFFF?text=${encodedPrompt}`;
}