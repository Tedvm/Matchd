import { EntitySchema } from 'typeorm';

const Movie = new EntitySchema({
  name: 'Movie',
  tableName: 'movies',
  columns: {
    id: {
      type: Number,
      primary: true,
    },
    title: {
      type: String,
    },
    genre_ids: {
      type: String,
      nullable: true,
      transformer: {
        to: (value) => JSON.stringify(value),
        from: (value) => JSON.parse(value),
      },
    },
    original_language: {
      type: String,
    },
    overview: {
      type: String,
    },
    release_date: {
      type: String,
    },
    poster_path: {
      type: String,
    },
    vote_average: {
      type: 'float',
    },
    userData: {
      type: 'text',
      nullable: true,
    },
  },
});

export default Movie;
