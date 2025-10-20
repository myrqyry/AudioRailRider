"""genai_adapter — a small wrapper around the google-genai SDK.

This module performs lazy imports and exposes simple async helpers used by
`GeminiService`. The adapter is safe to import in test/dev environments and
only imports the real SDK when an API key is configured.
"""
from __future__ import annotations

import asyncio
import json
import logging
from typing import Any, Optional

logger = logging.getLogger("genai_adapter")


class GenAIAdapter:
    def __init__(self, api_key: Optional[str] = None) -> None:
        self.api_key = api_key
        self._client = None
        self._initialized = False

    def _ensure_client(self) -> None:
        if self._initialized:
            return
        self._initialized = True
        try:
            from google import genai as _genai

            # instantiate the client with the provided key (or default env)
            try:
                self._client = _genai.Client(api_key=self.api_key)
            except TypeError:
                # some environments may expect different args; try no-arg constructor
                self._client = _genai.Client()
        except Exception as e:  # pragma: no cover - exercised only when SDK is present
            logger.exception("Failed to import google-genai: %s", e)
            self._client = None

    @property
    def client(self) -> Optional[Any]:
        self._ensure_client()
        return self._client

    async def generate_content(self, model: str, contents: Any, config: Optional[Any] = None) -> Any:
        """Call the SDK generate_content in an async-safe manner.

        - If the SDK client exposes `aio.models.generate_content`, prefer that.
        - Otherwise, run the sync client method in the default loop executor.
        """
        self._ensure_client()
        if self._client is None:
            raise RuntimeError("GenAI SDK client is not available")

        # If async client available
        aio = getattr(self._client, "aio", None)
        if aio is not None and getattr(aio, "models", None) is not None and hasattr(aio.models, "generate_content"):
            return await aio.models.generate_content(model=model, contents=contents, config=config)

        # fallback to sync call in executor
        def _sync_call():
            return self._client.models.generate_content(model=model, contents=contents, config=config)

        loop = asyncio.get_running_loop()
        return await loop.run_in_executor(None, _sync_call)

    async def upload_file(self, file_path: str) -> Any:
        self._ensure_client()
        if self._client is None:
            raise RuntimeError("GenAI SDK client is not available")

        aio = getattr(self._client, "aio", None)
        if aio is not None and getattr(aio, "files", None) is not None and hasattr(aio.files, "upload"):
            return await aio.files.upload(file=file_path)

        # sync fallback
        def _sync_upload():
            return self._client.files.upload(file=file_path)

        loop = asyncio.get_running_loop()
        return await loop.run_in_executor(None, _sync_upload)


__all__ = ["GenAIAdapter"]
