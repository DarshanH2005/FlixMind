import requests
import os
import pandas as pd

def download_dataset():
    url = "https://raw.githubusercontent.com/datasets/movie-metadatabase/master/data/movie_metadata.csv"
    output_path = "movie_metadata.csv"
    
    if os.path.exists(output_path):
        print(f"Dataset already exists at {output_path}. Skipping download.")
        return

    print(f"Downloading dataset from {url}...")
    try:
        response = requests.get(url)
        response.raise_for_status()
        with open(output_path, 'wb') as f:
            f.write(response.content)
        print("Download complete!")
        
        # Clean the dataset slightly
        df = pd.read_csv(output_path)
        # Drop rows without title, genres or plot_keywords
        df = df.dropna(subset=['movie_title', 'genres'])
        df.to_csv(output_path, index=False)
        print(f"Dataset cleaned and saved. Shape: {df.shape}")
        
    except Exception as e:
        print(f"Error downloading dataset: {e}")

if __name__ == "__main__":
    download_dataset()
