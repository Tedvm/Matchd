import 'reflect-metadata';
import { DataSource } from 'typeorm';
import Movie from './Movie.js';

export const appDataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite3',
  synchronize: true,
  entities: [Movie],
});
