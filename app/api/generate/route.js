export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return Response.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      "https://ai.api.nvidia.com/v1/genai/stabilityai/stable-diffusion-3.5-large",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NVIDIA_API_KEY}`,
        },
        body: JSON.stringify({
          prompt: prompt,
          size: "1024x1024",
          steps: 30,
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      return Response.json(
        { error: `NVIDIA API error: ${errText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return Response.json(
      {
        success: true,
        images: data.images,
      },
      { status: 200 }
    );

  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
