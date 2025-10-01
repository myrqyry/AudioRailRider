from fastapi import FastAPI

app = FastAPI(title="AudioRailRider Backend", description="Backend API for AudioRailRider", version="0.1.0")

@app.get("/")
async def root():
    return {"message": "AudioRailRider Backend is running!", "status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)