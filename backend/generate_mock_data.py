import pandas as pd
import json

def generate_mock_dataset():
    movies = [
        {
            "id": 1,
            "title": "Inception",
            "overview": "Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible: inception, the implantation of another person's idea into a target's subconscious.",
            "genres": json.dumps([{"id": 28, "name": "Action"}, {"id": 878, "name": "Science Fiction"}, {"id": 12, "name": "Adventure"}]),
            "vote_average": 8.8,
            "poster_path": "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg"
        },
        {
            "id": 2,
            "title": "Interstellar",
            "overview": "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
            "genres": json.dumps([{"id": 12, "name": "Adventure"}, {"id": 18, "name": "Drama"}, {"id": 878, "name": "Science Fiction"}]),
            "vote_average": 8.6,
            "poster_path": "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg"
        },
        {
            "id": 3,
            "title": "The Dark Knight",
            "overview": "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets. The partnership proves to be effective, but they soon find themselves prey to a reign of chaos unleashed by a rising criminal mastermind known to the terrified citizens of Gotham as the Joker.",
            "genres": json.dumps([{"id": 18, "name": "Drama"}, {"id": 28, "name": "Action"}, {"id": 80, "name": "Crime"}, {"id": 53, "name": "Thriller"}]),
            "vote_average": 9.0,
            "poster_path": "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg"
        },
        {
            "id": 4,
            "title": "The Matrix",
            "overview": "Set in the 22nd century, The Matrix tells the story of a computer hacker who joins a group of underground insurgents fighting the vast and powerful computers who now rule the earth.",
            "genres": json.dumps([{"id": 28, "name": "Action"}, {"id": 878, "name": "Science Fiction"}]),
            "vote_average": 8.7,
            "poster_path": "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg"
        },
        {
            "id": 5,
            "title": "Avatar",
            "overview": "In the 22nd century, a paraplegic Marine is dispatched to the moon Pandora on a unique mission, but becomes torn between following orders and protecting an alien civilization.",
            "genres": json.dumps([{"id": 28, "name": "Action"}, {"id": 12, "name": "Adventure"}, {"id": 14, "name": "Fantasy"}, {"id": 878, "name": "Science Fiction"}]),
            "vote_average": 7.9,
            "poster_path": "https://image.tmdb.org/t/p/w500/kyeqWdyUHPObfKkJLL6fTOvE04U.jpg"
        },
        {
            "id": 6,
            "title": "Gladiator",
            "overview": "In the year 180, the death of emperor Marcus Aurelius throws the Roman Empire into chaos.  Maximus is one of the Roman army's most capable and trusted generals and a key advisor to the emperor.  As Marcus' devious son Commodus ascends to the throne, Maximus is set to be executed.  He escapes, but is captured by slave traders.  Renamed Spaniard and forced to become a gladiator, Maximus must battle to the death with other men for the amusement of paying audiences.",
            "genres": json.dumps([{"id": 28, "name": "Action"}, {"id": 18, "name": "Drama"}, {"id": 12, "name": "Adventure"}]),
            "vote_average": 8.2,
            "poster_path": "https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg"
        },
        {
            "id": 7,
            "title": "Titanic",
            "overview": "101-year-old Rose DeWitt Bukater tells the story of her life aboard the Titanic, 84 years later. A young Rose boards the ship with her mother and fiancé. Meanwhile, Jack Dawson and Fabrizio De Rossi win third-class tickets aboard the ship. Rose tells the whole story from Titanic's departure through to its death—on its first and last voyage—on April 15, 1912.",
            "genres": json.dumps([{"id": 18, "name": "Drama"}, {"id": 10749, "name": "Romance"}]),
            "vote_average": 7.9,
            "poster_path": "https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg"
        },
        {
            "id": 8,
            "title": "The Shawshank Redemption",
            "overview": "Framed in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison, where he puts his accounting skills to work for an amoral warden. During his long stretch in prison, Dufresne comes to be admired by the other inmates -- including an older prisoner named Red -- for his integrity and unquenchable sense of hope.",
            "genres": json.dumps([{"id": 18, "name": "Drama"}, {"id": 80, "name": "Crime"}]),
            "vote_average": 9.3,
            "poster_path": "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg"
        },
        {
            "id": 9,
            "title": "Pulp Fiction",
            "overview": "A burger-loving hit man, his philosophical partner, a drug-addled gangster's moll and a washed-up boxer converge in this sprawling, comedic crime caper. Their adventures unfurl in three stories that ingeniously trip back and forth in time.",
            "genres": json.dumps([{"id": 53, "name": "Thriller"}, {"id": 80, "name": "Crime"}]),
            "vote_average": 8.9,
            "poster_path": "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg"
        },
        {
            "id": 10,
            "title": "Fight Club",
            "overview": "A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy. Their concept catches on, with underground \"fight clubs\" forming in every town, until an eccentric gets in the way and ignites an out-of-control spiral toward oblivion.",
            "genres": json.dumps([{"id": 18, "name": "Drama"}]),
            "vote_average": 8.4,
            "poster_path": "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg"
        }
    ]

    df = pd.DataFrame(movies)
    df.to_csv("movies.csv", index=False)
    print("Mock dataset generated successfully at movies.csv")

if __name__ == "__main__":
    generate_mock_dataset()
