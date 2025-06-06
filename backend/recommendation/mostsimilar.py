import sqlite3
from .algoreco import compute_similarity
from collections import Counter

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

def most_similar_group(movie_ids, top_n):
    similarity_counter = Counter()

    for movie_id in movie_ids:
        similars = find_most_similar_movies(movie_id, top_n=top_n*2)
        for movie in similars:
            if movie["id"] not in movie_ids:  # ne recommande pas les mêmes
                similarity_counter[movie["id"]] += 1

    most_common = similarity_counter.most_common(top_n)
    return [movie_id for movie_id, _ in most_common]
