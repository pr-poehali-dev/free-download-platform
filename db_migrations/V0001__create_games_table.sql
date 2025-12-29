CREATE TABLE IF NOT EXISTS games (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    genre VARCHAR(100) NOT NULL,
    rating DECIMAL(3,1) CHECK (rating >= 0 AND rating <= 10),
    image_url TEXT NOT NULL,
    trailer_url TEXT,
    description TEXT NOT NULL,
    release_date VARCHAR(4) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_games_title ON games(title);
CREATE INDEX idx_games_genre ON games(genre);
CREATE INDEX idx_games_rating ON games(rating DESC);