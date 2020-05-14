const { Schema } = require('mongoose');

const linkSchema = new Schema({
  title: String,
  link: String,
  description: String
});

const ownerSchema = new Schema({
  _id: Schema.Types.ObjectId,
  username: String
});

// const forkSchema = new Schema({
//   _id: Schema.Types.ObjectId,
//   name: String,
//   postId: String,
//   owner: ownerSchema,
// });

module.exports = new Schema({
  postId: String,
  name: String,
  links: { type: [linkSchema], default: [] },
  owner: ownerSchema,
  forks: { type: Number, default: 0, validate: (val) => val >= 0 },
  forkOf: { type: Object, default: null },
  private: { type: Boolean, default: false },
}, { timestamps: true });

// forkOf {
//   "_id": String,
//   "postId": String,
//   "owner":{
//     "username": String,
//     "_id": String
//   }
// }

// {
//   id:   { type: Sequelize.STRING, primaryKey: true, allowNull: false },
//   name: { type: Sequelize.STRING, allowNull: false },
//   private: { type: Sequelize.BOOLEAN, defaultValue: false },
//   list: { type: Sequelize.JSON },
//   owner: { type: Sequelize.UUID, references: {
//     model: 'users',
//     key: 'id',
//   }}
// };
