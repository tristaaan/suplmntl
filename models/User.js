var thinky = require('thinky');
// var r = thinky.r;
var type = thinky.type;


module.exports = {
  id: type.id(),
  username: type.string(),
  email: type.string(),
  pw: type.string(),
  createdAt: Date,
};

// {
//   id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
//   username: { type: Sequelize.STRING(16), allowNull: false },
//   email:{ type: Sequelize.STRING, allowNull: false },
//   pw: { type: Sequelize.STRING(60), allowNull: false }
// };
