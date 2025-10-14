# Gemini 2.5 Flash Image Integration

## Overview

The skybox generation now uses **Gemini 2.5 Flash Image Preview** (`gemini-2.5-flash-image-preview`) instead of Imagen. This model provides superior creative image generation with rich contextual understanding.

## Key Features

### 1. **Contextual Image Generation**
- Uses the full blueprint data (ride name, mood, palette, track segments) to create highly contextual skybox images
- The model understands the emotional arc and visual theme of your ride

### 2. **Chat-Based Approach**
- Utilizes chat mode for more natural, conversational prompts
- Allows for iterative refinement (future enhancement)

### 3. **Rich Prompt Engineering**
```python
full_prompt = f"""Create a breathtaking, cinematic wide-angle sky scene for a rollercoaster experience called "{ride_name}".

Mood: {mood}
Visual Style: Photorealistic, epic, atmospheric, with dynamic lighting and volumetric effects{palette_desc}.

The sky should evoke the emotional journey of the ride - make it vast, immersive, and visually stunning."""
```

## API Changes

### Backend

**`backend/app/services/gemini_service.py`**:
```python
async def generate_skybox(self, prompt: str, blueprint_data: dict | None = None):
    # Now accepts optional blueprint_data for context
    chat = await self.client.aio.chats.create(model='gemini-2.5-flash-image-preview')
    response = await chat.send_message(full_prompt)
    
    # Extract image from inline_data
    for part in response.candidates[0].content.parts:
        if part.inline_data is not None:
            image_bytes = part.inline_data.data
```

**`backend/app/models/models.py`**:
```python
class SkyboxRequest(BaseModel):
    prompt: str
    blueprint: Optional[dict] = None  # New field
```

### Frontend

**`frontend/src/services/geminiService.ts`**:
```typescript
export const generateSkyboxImage = async (
  prompt: string, 
  blueprint?: any  // New optional parameter
): Promise<string>
```

**`frontend/src/components/ThreeCanvas.tsx`**:
```typescript
// Pass full blueprint context
generateSkyboxImage(prompt, trackData)
```

## Model Capabilities

### Gemini 2.5 Flash Image Preview Advantages:
1. ✅ **Native image generation** - No need for separate Imagen API
2. ✅ **Contextual understanding** - Interprets complex prompts with mood, colors, themes
3. ✅ **Fast generation** - Optimized for quick turnaround
4. ✅ **Creative output** - Produces artistic, atmospheric images
5. ✅ **No configuration required** - Works out of the box with chat API

### Response Structure:
```python
response.candidates[0].content.parts[n].inline_data.data  # Raw image bytes
```

## Testing

### To test the new integration:

1. **Restart backend**:
```bash
cd backend
uvicorn main:app --reload
```

2. **Hard refresh frontend**:
```
Ctrl + Shift + R (or Cmd + Shift + R on Mac)
```

3. **Upload audio and start a ride**:
   - Upload an audio file
   - Click "Begin the Ride"
   - Watch console for skybox generation logs
   - Look for: `[ThreeCanvas] Skybox generated successfully with Gemini 2.5 Flash Image`

### Expected Console Output:
```
[ThreeCanvas] Skybox generated successfully with Gemini 2.5 Flash Image
```

### If it fails:
```
[ThreeCanvas] Continuing without custom skybox: <error message>
```
The ride will continue with the default gradient skybox.

## Comparison: Imagen vs Gemini 2.5 Flash Image

| Feature | Imagen 4.0 | Gemini 2.5 Flash Image |
|---------|-----------|------------------------|
| API Method | `generate_images()` | `chats.create()` + `send_message()` |
| Context Awareness | Basic prompt only | Rich blueprint context |
| Configuration | Requires `GenerateImagesConfig` | No config needed |
| Response Path | `response.generated_images[0].image.image_bytes` | `response.candidates[0].content.parts[n].inline_data.data` |
| Prompt Style | Concise, literal | Conversational, descriptive |
| Creative Output | Technical, precise | Artistic, atmospheric |

## Future Enhancements

### Potential improvements:
1. **Iterative refinement**: Use chat history to refine the skybox based on user feedback
2. **Multiple variations**: Generate multiple skybox options and let user choose
3. **Animation frames**: Generate sequence of skyboxes for dynamic sky changes during ride
4. **Palette matching**: Ensure generated colors align perfectly with blueprint palette
5. **Segment-specific scenes**: Generate different skyboxes for different track segments

## Troubleshooting

### Common Issues:

**"No image generated in response"**
- The model occasionally returns text instead of images
- Solution: Retry or fall back to default skybox (already handled)

**"API error during skybox generation"**
- Check API key is valid
- Ensure `GEMINI_API_KEY` environment variable is set
- Verify network connectivity

**Skybox not appearing**
- Check browser console for generation logs
- Skybox generation is non-blocking - ride continues with default skybox on failure

## Documentation References

- [Gemini API Coding Guidelines (Python)](https://github.com/googleapis/python-genai/blob/main/codegen_instructions.md)
- [Image Editing with Gemini](https://github.com/googleapis/python-genai/blob/main/codegen_instructions.md#edit-images)
- [Gemini 2.5 Models](https://ai.google.dev/models)
