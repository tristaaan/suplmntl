var Sequelize = require('sequelize');

module.exports = {
  id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
  username: { type: Sequelize.STRING(16), allowNull: false },
  email:{ type: Sequelize.STRING, allowNull: false },
  pw: { type: Sequelize.STRING(60), allowNull: false }
};
