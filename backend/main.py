from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from ml_engine import RecommendationEngine

app = FastAPI(title="Movie Recommendation API")

# Setup CORS so the frontend can communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = RecommendationEngine(dataset_path="movies.csv")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Movie Recommendation API!"}

@app.get("/api/recommend")
def get_recommendation(movie_name: str):
    res = engine.get_recommendations(movie_name)
    if "error" in res:
        raise HTTPException(status_code=404, detail=res["error"])
    return res

@app.get("/api/trending")
def get_trending():
    res = engine.get_trending()
    if "error" in res:
        raise HTTPException(status_code=500, detail=res["error"])
    return res

@app.get("/api/genres")
def get_genres():
    res = engine.get_all_genres()
    if "error" in res:
        raise HTTPException(status_code=500, detail=res["error"])
    return res

@app.get("/api/movies")
def get_movies(genre: str = None):
    if genre:
        res = engine.get_movies_by_genre(genre)
    else:
        res = engine.get_trending(limit=20) # Default list
        res["movies"] = res.pop("trending")
        
    if "error" in res:
        raise HTTPException(status_code=500, detail=res["error"])
    return res
