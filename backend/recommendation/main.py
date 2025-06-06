from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from .mostsimilar import find_most_similar_movies, most_similar_group
from typing import List

app = FastAPI()

print("main.py chargé !")
print("app :", 'app' in globals())

# Autoriser les appels depuis le frontend (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # à restreindre en prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/similar_movies")
def similar_movies(id: int = Query(...), top_n: int = Query(5)):
    try:
        results = find_most_similar_movies(id, top_n)
        return {"results": results}
    except Exception as e:
        return {"error": str(e)}
    
@app.get("/group_recommendations")
def group_recommendations(movie_ids: List[int] = Query(...), top_n: int = 10):
    result = most_similar_group(movie_ids, top_n)
    return {"results": result}
