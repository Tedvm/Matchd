import { DataTypes } from 'sequelize';
import sequelize from '../databaseMovies/index.js';

const Movie = sequelize.define('Movie', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  title: DataTypes.STRING,
  overview: DataTypes.TEXT,
  release_date: DataTypes.STRING,
  poster_path: DataTypes.STRING,
  vote_average: DataTypes.FLOAT,

  // Ajout du champ personnalisé
  userData: {
    type: DataTypes.TEXT,
    defaultValue: null,
  },
});

export default Movie;
