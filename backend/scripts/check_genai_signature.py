"""
Small helper to probe the installed google-genai client's supported upload signatures.
It will attempt:
 - types.Part.from_bytes -> models.generate_content inline flow
 - client.aio.files.upload(file=BytesIO)

Run this with the project's venv active.
"""
import asyncio
import logging
from google import genai
from google.genai import types
from google.genai.errors import APIError
from io import BytesIO

logging.basicConfig(level=logging.INFO)
client = genai.Client()

SMALL_BYTES = b'ID3\x03\x00\x00\x00\x00\x0f'  # tiny fake mp3 header

async def test_inline_part():
    try:
        part = types.Part.from_bytes(data=SMALL_BYTES, mime_type='audio/mpeg')
        resp = await client.aio.models.generate_content(
            model='gemini-2.5-flash',
            contents=[part, 'Return a short JSON object: {"ok": true}'],
            config={'response_mime_type': 'application/json'}
        )
        print('inline part OK, response snippet:', getattr(resp, 'text', str(resp))[:200])
    except APIError as e:
        print('inline part APIError', e)
    except Exception as e:
        print('inline part failed', type(e), e)

async def test_files_upload():
    try:
        b = BytesIO(SMALL_BYTES)
        b.name = 'test.mp3'
        up = await client.aio.files.upload(file=b)
        print('files.upload OK; returned:', getattr(up, 'name', getattr(up, 'uri', str(up))))
    except APIError as e:
        print('files.upload APIError', e)
    except TypeError as te:
        print('files.upload TypeError', te)
    except Exception as e:
        print('files.upload failed', type(e), e)

async def main():
    print('Testing inline Part.from_bytes...')
    await test_inline_part()
    print('\nTesting client.aio.files.upload(file=BytesIO)...')
    await test_files_upload()

if __name__ == '__main__':
    asyncio.run(main())
