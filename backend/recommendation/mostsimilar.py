import sqlite3
from .algoreco import compute_similarity

def find_most_similar_movies(id, top_n):
    # Connexion à la base de données
    conn = sqlite3.connect("database.sqlite3")
    cursor = conn.cursor()

    # Récupérer tous les IDs de films
    cursor.execute("SELECT id FROM movies")
    all_ids = [row[0] for row in cursor.fetchall()]

    conn.close()

    # Calculer les similarités (exclure le film lui-même)
    similarities = []
    for movie_id in all_ids:
        if movie_id != id:
            score = compute_similarity(id, movie_id)
            similarities.append((movie_id, score))

    # Trier par score décroissant
    similarities.sort(key=lambda x: x[1], reverse=True)

    # Retourner les top N IDs
    return [movie_id for movie_id, score in similarities[:top_n]]

similar_movies = find_most_similar_movies(11, top_n=10)
print("Films similaires à 11 :", similar_movies)
