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
    firstname: { type: String },
    lastname: { type: String },
    password: { type: String },
    favorites: {
      type: 'simple-array', // stocke un CSV d’IDs en TEXT
      nullable: false,
      default: '',
    },
    vus: {
      type: 'simple-json',
      nullable: false,
      default: '[]',
    },
  },
});

export default User;
