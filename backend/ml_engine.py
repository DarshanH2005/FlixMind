import pandas as pd
import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

class RecommendationEngine:
    def __init__(self, dataset_path="movies.csv"):
        self.dataset_path = dataset_path
        self.df = None
        self.similarity_matrix = None
        self._load_data()

    def _load_data(self):
        try:
            self.df = pd.read_csv(self.dataset_path)
            # Preprocess the data
            self.df['combined_features'] = self.df.apply(self._combine_features, axis=1)
            
            # Create vectors
            tfidf = TfidfVectorizer(stop_words='english')
            tfidf_matrix = tfidf.fit_transform(self.df['combined_features'])
            
            # Compute cosine similarity
            self.similarity_matrix = cosine_similarity(tfidf_matrix, tfidf_matrix)
            print("ML Engine initialized successfully.")
        except Exception as e:
            print(f"Error initializing ML Engine: {e}")

    def _combine_features(self, row):
        try:
            genres_list = json.loads(row['genres'])
            genres_str = " ".join([g['name'] for g in genres_list])
            return row['overview'] + " " + genres_str
        except Exception as e:
            return ""

    def get_recommendations(self, movie_title, num_recommendations=5):
        if self.df is None or self.similarity_matrix is None:
            return {"error": "Model not initialized."}

        # Find the index of the movie that matches the title
        try:
            # Simple case-insensitive search
            idx_list = self.df[self.df['title'].str.lower() == movie_title.lower()].index.tolist()
            if not idx_list:
                return {"error": "Movie not found."}
            idx = idx_list[0]
            
            # Get similarity scores
            sim_scores = list(enumerate(self.similarity_matrix[idx]))
            
            # Sort the movies based on the similarity scores
            sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
            
            # Get the scores of the most similar movies (skip the first one as it's the movie itself)
            sim_scores = sim_scores[1:num_recommendations+1]
            
            # Get the movie indices
            movie_indices = [i[0] for i in sim_scores]
            
            # Return the top most similar movies
            recommendations = self.df.iloc[movie_indices].to_dict(orient="records")
            target_movie = self.df.iloc[idx].to_dict()
            
            # Safely parse genres strings to objects for frontend
            target_movie['genres'] = json.loads(target_movie['genres'])
            for m in recommendations:
                m['genres'] = json.loads(m['genres'])
            
            return {
                "target_movie": target_movie,
                "recommendations": recommendations
            }

        except Exception as e:
            return {"error": str(e)}

    def get_trending(self, limit=10):
        if self.df is None:
             return {"error": "Model not initialized."}
        try:
            trending = self.df.sort_values(by="vote_average", ascending=False).head(limit)
            results = trending.to_dict(orient="records")
            for m in results:
                m['genres'] = json.loads(m['genres'])
            return {"trending": results}
        except Exception as e:
             return {"error": str(e)}

    def get_all_genres(self):
         if self.df is None:
             return {"error": "Model not initialized."}
         genres_set = set()
         for g_str in self.df['genres']:
             try:
                 g_list = json.loads(g_str)
                 for g in g_list:
                     genres_set.add(g['name'])
             except:
                 pass
         return {"genres": sorted(list(genres_set))}

    def get_movies_by_genre(self, genre, limit=10):
         if self.df is None:
             return {"error": "Model not initialized."}
         try:
             # Find movies that contain the genre
             def has_genre(g_str):
                 try:
                     g_list = json.loads(g_str)
                     return any(g['name'].lower() == genre.lower() for g in g_list)
                 except:
                     return False
             
             filtered_df = self.df[self.df['genres'].apply(has_genre)]
             filtered_df = filtered_df.sort_values(by="vote_average", ascending=False).head(limit)
             results = filtered_df.to_dict(orient="records")
             for m in results:
                 m['genres'] = json.loads(m['genres'])
             return {"movies": results}
         except Exception as e:
             return {"error": str(e)}

# For testing
if __name__ == "__main__":
    engine = RecommendationEngine()
    print(engine.get_recommendations("Inception", 2))
