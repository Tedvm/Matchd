// backend/entities/user.js
import typeorm from 'typeorm';

const User = new typeorm.EntitySchema({
  name: 'User',
  columns: {
    id: {
      primary: true,
      type: Number,
      generated: true,
    },
    email: {
      type: String,
      unique: true,
    },
    firstname: {
      type: String,
    },
    lastname: {
      type: String,
    },
    password: {
      type: String,
    },
    // ─────────────────────────────────────────────────────────────
    // 1) FAVORITES  : simple-array -> champ TEXT contenant "3,7,12"
    // ─────────────────────────────────────────────────────────────
    favorites: {
      type: 'simple-array', // TypeORM stocke en base un CSV d’IDs (texte)
      nullable: false,
      default: '', // par défaut chaîne vide -> tableau vide en JS
    },
    // ─────────────────────────────────────────────────────────────
    // 2) VUS       : simple-json -> champ TEXT contenant un JSON
    //    ex. '[{"id":3,"note":4},{"id":7,"note":5}]'
    // ─────────────────────────────────────────────────────────────
    vus: {
      type: 'simple-json', // TypeORM stocke le JSON sous forme de texte
      nullable: false,
      default: '[]', // par défaut tableau vide -> [] en JS
    },
  },
});

export default User;
