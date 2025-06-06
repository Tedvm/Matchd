from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from .mostsimilar import find_most_similar_movies

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
