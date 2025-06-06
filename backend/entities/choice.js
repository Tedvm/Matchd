import { EntitySchema } from 'typeorm';

const UserChoice = new EntitySchema({
  name: 'UserChoice',
  tableName: 'user_choices',
  columns: {
    id: { primary: true, type: Number, generated: true },
    user_id: { type: Number },
    movie_id: { type: Number },
    choice: { type: Number },
  },
  uniques: [{ columns: ['user_id', 'movie_id'] }],
});

export default UserChoice;
