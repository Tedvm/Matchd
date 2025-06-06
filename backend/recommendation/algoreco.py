import sqlite3

from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from datetime import datetime

model = SentenceTransformer('all-MiniLM-L6-v2')
# Chargement du modèle pré-entraîné
model = SentenceTransformer('paraphrase-MiniLM-L6-v2')

import os

# Récupère le chemin absolu du dossier contenant le script
base_dir = os.path.dirname(os.path.abspath(__file__))

# Construit le chemin vers la base de données (qui est un dossier au-dessus)
db_path = os.path.join(base_dir, '..', 'database.sqlite3')

#d'abord on récupère les données qui nous intéressent
def get_movie_by_id(movie_id: int):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    cursor.execute("""
        SELECT original_language, overview, release_date, vote_average, genre_ids, title
        FROM movies
        WHERE id = ?
    """, (movie_id,))

    result = cursor.fetchone()
    conn.close()

    if result:
        return {
            "original_language": result[0],
            "overview": result[1],
            "release_date": result[2],
            "vote_average": result[3],
            "genre_ids": eval(result[4]) if result[4] else [],  # si c’est une string de type "[1,2]"
            "title": result[5]
        }
    else:
        return None

def sim_title(id1, id2):
    film1, film2 = get_movie_by_id(id1), get_movie_by_id(id2)
    if film1 is None or film2 is None:
        return 0
    text1, text2 = film1["title"], film2["title"]
    set_text1 = set(text1.lower().split())
    set_text2 = set(text2.lower().split())
    intersection = set_text1 & set_text2
    tot = min (len(set_text1), len(set_text2))
    return len(intersection) / tot

def sim_lang(id1, id2):
    film1, film2 = get_movie_by_id(id1), get_movie_by_id(id2)
    if film1 is None or film2 is None:
        return 0
    if film1["original_language"] == film2["original_language"]:
        return 1
    else:
        return 0

def sim_overview(id1, id2):
    film1, film2 = get_movie_by_id(id1), get_movie_by_id(id2)
    if film1 is None or film2 is None:
        return 0
    text1, text2 = film1["overview"], film2["overview"]
    embeddings = model.encode([text1, text2])
    score = cosine_similarity([embeddings[0]], [embeddings[1]])[0][0]
    return score

def year_difference(date1: str, date2: str) -> int:
    #Calcule la différence d'années entre deux dates au format 'YYYY-MM-DD'
    year1 = datetime.strptime(date1, "%Y-%m-%d").year
    year2 = datetime.strptime(date2, "%Y-%m-%d").year
    return abs(year1 - year2)
    
def sim_date(id1, id2):
    film1, film2 = get_movie_by_id(id1), get_movie_by_id(id2)
    if film1 is None or film2 is None:
        return 0
    date1, date2 = film1["release_date"], film2["release_date"]
    diff = year_difference(date1, date2)
    return (1/(1+0.1*diff))

def sim_vote(id1, id2):
    film1, film2 = get_movie_by_id(id1), get_movie_by_id(id2)
    if film1 is None or film2 is None:
        return 0
    vote1, vote2 = film1["vote_average"], film2["vote_average"]
    return 1 -(abs(vote1 - vote2)/8)

def sim_genre(id1, id2):
    film1, film2 = get_movie_by_id(id1), get_movie_by_id(id2)
    if film1 is None or film2 is None:
        return 0
    genre1, genre2 = film1["genre_ids"], film2["genre_ids"]
    return len(set(genre1) & set(genre2)) #retourne le nombre de genres en commun
    

def compute_similarity(id1, id2):
    lang = sim_lang(id1, id2)
    overview = sim_overview(id1, id2)
    date = sim_date(id1, id2)
    vote = sim_vote(id1, id2)
    genre = sim_genre(id1, id2)
    title = sim_title(id1, id2)
    return lang + 3*overview + date + vote + genre + 3*title

