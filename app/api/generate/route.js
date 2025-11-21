import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { prompt } = await request.json();

    if (!prompt?.trim()) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    console.log('🎨 Generating image for:', prompt);

    // Direct Pollinations.ai URL with optimized parameters
    const encodedPrompt = encodeURIComponent(prompt.trim());
    const seed = Math.floor(Math.random() * 1000000);
    
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&seed=${seed}&model=flux&nofetch=true&private=true&enhance=true`;

    // Validate the URL works
    try {
      const testResponse = await fetch(imageUrl, { 
        method: 'HEAD',
        cache: 'no-cache'
      });
      
      if (!testResponse.ok) {
        throw new Error(`Pollinations.ai responded with status: ${testResponse.status}`);
      }
    } catch (testError) {
      console.warn('HEAD request failed, proceeding anyway:', testError.message);
    }

    return NextResponse.json({
      success: true,
      imageUrl,
      prompt: prompt.trim(),
      source: 'pollinations.ai',
      note: 'AI generated image'
    });

  } catch (error) {
    console.error('❌ Generation error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate image. Please try again.',
        details: error.message 
      },
      { status: 500 }
    );
  }
}