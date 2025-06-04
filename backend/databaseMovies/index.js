import { Sequelize } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';

// Pour que __dirname fonctionne avec ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialisation de la BDD SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'movies.sqlite'), // fichier local de BDD
});

export default sequelize;
