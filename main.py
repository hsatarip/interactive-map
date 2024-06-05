from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Set up CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Example route
@app.get("/properties")
async def get_properties():
    return [
        {"id": 1, "name": "Property 1", "longitude": -74.5, "latitude": 40},
        {"id": 2, "name": "Property 2", "longitude": -75.5, "latitude": 41},
    ]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)