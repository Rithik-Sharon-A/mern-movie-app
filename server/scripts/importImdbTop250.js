import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Movie from '../models/Movie.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const importMovies = async () => {
  try {
    // Read the JSON file
    const jsonFilePath = path.join(__dirname, '..', 'data', 'imdbTop250.json');
    const jsonData = fs.readFileSync(jsonFilePath, 'utf8');
    const movies = JSON.parse(jsonData);

    console.log(`Found ${movies.length} movies in the JSON file`);

    // Connect to MongoDB
    await connectDB();
    console.log('Connected to MongoDB');

    let addedCount = 0;
    let skippedCount = 0;

    // Process each movie
    for (const movieData of movies) {
      try {
        // Check if movie already exists
        const existingMovie = await Movie.findOne({ title: movieData.title });

        if (existingMovie) {
          console.log(`Skipping: ${movieData.title} (already exists)`);
          skippedCount++;
          continue;
        }

        // Map fields to Movie model
        const movie = new Movie({
          title: movieData.title,
          description: '', // Will be empty since not provided in data
          rating: movieData.rating,
          releaseDate: null, // Will be null since not provided in data
          duration: null, // Will be null since not provided in data
          poster: movieData.imdbUrl // Using imdbUrl as poster temporarily
        });

        await movie.save();
        console.log(`Added: ${movieData.title}`);
        addedCount++;

      } catch (movieError) {
        console.error(`Error processing movie ${movieData.title}:`, movieError.message);
      }
    }

    console.log(`\nImport completed!`);
    console.log(`Movies added: ${addedCount}`);
    console.log(`Movies skipped: ${skippedCount}`);
    console.log(`Total processed: ${addedCount + skippedCount}`);

    process.exit(0);

  } catch (error) {
    console.error('Import failed:', error.message);
    process.exit(1);
  }
};

// Run the import
importMovies();