var mongoose = require('mongoose');

var Schema = mongoose.Schema;

const linkSchema = new Schema({
  title: String,
  link: String,
  description: String
});

module.exports = {
  postId: String,
  name: String,
  links: { type: [linkSchema], default: [] },
  owner: {
    _id: Schema.Types.ObjectId,
    username: String,
  },
  forkOf: { type: Object, default: null },
  private: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }, // type.date().default(r.now()),
};

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
