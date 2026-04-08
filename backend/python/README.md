# Python Backend

This backend provides the project API in Python via a WSGI app (`wsgiref`-based).

## Features

- `POST /api/detect` endpoint compatible with existing frontend request/response contract.
- `DETECTOR_MODE=ollama` (default): sends prompt to Ollama API.
- `DETECTOR_MODE=local`: runs built-in heuristic detector for local/offline development.
- Optional static serving of `frontend/dist` when available.

## Local setup

```bash
cd backend/python
python -m venv .venv
source .venv/bin/activate
pip install -U pip
pip install -r requirements.txt
```

## Run

### Option 1: Ollama-backed mode (default)

```bash
cd backend/python
source .venv/bin/activate
python app.py
```

`app.py` does not auto-start Ollama. Start Ollama separately (`ollama serve`) when using Ollama mode.

Optional env vars:

- `OLLAMA_URL` (default: `http://localhost:11434/`)
  - Use Ollama server base URL only. Backend appends endpoint paths (`/api/generate`, `/api/version`) internally.
- `OLLAMA_MODEL` (default: `gemma4:e4b`)
- `OLLAMA_MODEL_AUTOSELECT=1|0` (default: `1`; if configured model is missing, backend can fall back only to supported local models: `llama3.2`, `llama3`, `qwen2.5`, `gemma3`, `mistral`)

Model names are tag-aware: if you set `OLLAMA_MODEL=llama3.2` and local Ollama has `llama3.2:latest`, backend resolves to the installed tagged name automatically.

For your current preference, backend defaults to `gemma4:e4b` for one-shot scam analysis.
- `OLLAMA_AUTH_TOKEN` (Bearer token for authenticated Ollama endpoints)
- `OLLAMA_AUTH_HEADER` (full Authorization header value; overrides `OLLAMA_AUTH_TOKEN`)
- `ALLOW_CLOUD_OLLAMA_MODEL=1|0` (default: `0`; if `0`, `*-cloud` model names are remapped to local model names)

By default (`ALLOW_CLOUD_OLLAMA_MODEL=0`), backend enforces local-first behavior and blocks non-local `OLLAMA_URL` hosts.
Set `ALLOW_CLOUD_OLLAMA_MODEL=1` only when you intentionally want remote/cloud endpoints.

### Option 2: Local heuristic mode (no Ollama dependency)

```bash
cd backend/python
source .venv/bin/activate
DETECTOR_MODE=local python app.py
```

## Static frontend serving

If `frontend/dist` exists, the backend serves static files with SPA fallback.

## CORS

Allowed origins are controlled by `ALLOW_ORIGINS` (comma-separated):

```bash
ALLOW_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

## Performance and GPU acceleration

The backend now supports lower-latency Ollama calls and warm model loading.

### Backend fast-path behavior

- Threaded WSGI server for concurrent requests.
- Optional Ollama warmup at startup (`OLLAMA_WARMUP=1` by default).
- Request-level `keep_alive` sent to Ollama (`OLLAMA_GENERATE_KEEP_ALIVE`, default `0`).

Backend now keeps the model loaded by default (`OLLAMA_GENERATE_KEEP_ALIVE=10m`) for faster repeated requests,
while still clearing conversational context by using fresh standalone prompts (no prior context chaining).

Each `/api/detect` request now uses a one-shot LLM pass with strict JSON-schema output.

Context/session handling:

- Requests are stateless (fresh prompts, no prior context chaining).
- Model stays loaded by default for speed (`OLLAMA_GENERATE_KEEP_ALIVE=10m`).
- Optional hard clear/unload after each request: `OLLAMA_HARD_CLEAR_AFTER_REQUEST=1` (slower, but explicitly unloads model context).
- In-flight request cap (`BACKEND_MAX_INFLIGHT`, default `8`) to prevent overload.

> Note: `wsgiref` is suitable for local/dev and small deployments. For production throughput,
> run this app under a production WSGI/ASGI server.

### Ollama request options (set via backend env vars)

These map to Ollama `options` in `/api/generate`:

- `OLLAMA_NUM_GPU` → `options.num_gpu`
- `OLLAMA_NUM_THREAD` → `options.num_thread`
- `OLLAMA_NUM_CTX` → `options.num_ctx`
- `OLLAMA_NUM_PREDICT` → `options.num_predict`
- `OLLAMA_TEMPERATURE` → `options.temperature`

Example:

```bash
cd backend/python
source .venv/bin/activate
DETECTOR_MODE=ollama \
OLLAMA_NUM_GPU=999 \
OLLAMA_NUM_THREAD=8 \
OLLAMA_NUM_CTX=4096 \
OLLAMA_GENERATE_KEEP_ALIVE=30m \
python app.py
```

### Enable GPU on Ollama server

Backend can request GPU layers (`num_gpu`), but Ollama server must also be configured for GPU.

Official Ollama docs:

- Hardware support: <https://docs.ollama.com/gpu>
- FAQ (server env/config): <https://docs.ollama.com/faq>

Common setup examples from Ollama docs:

- NVIDIA GPU selection: `CUDA_VISIBLE_DEVICES=0` (or GPU UUID)
- AMD GPU selection: `ROCR_VISIBLE_DEVICES=0`
- Vulkan experimental path: `OLLAMA_VULKAN=1`

To verify model actually runs on GPU, check:

```bash
ollama ps
```

and confirm `PROCESSOR` shows GPU usage.

## Authenticated Ollama endpoints

If your Ollama gateway requires authentication (for example returns HTTP 401 without auth),
set one of:

```bash
OLLAMA_AUTH_TOKEN=your-token
```

or:

```bash
OLLAMA_AUTH_HEADER="Bearer your-token"
```

`OLLAMA_AUTH_HEADER` takes precedence and is applied to version checks, warmup, and `/api/generate` calls.
