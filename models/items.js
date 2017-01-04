var Sequelize = require('sequelize');

module.exports = {
  id:   { type: Sequelize.INTEGER, autoIncrement: true,  primaryKey: true },
  name: { type: Sequelize.STRING(64), allowNull: false },
  link: { type: Sequelize.STRING(2048), allowNull: false },
  description: { type: Sequelize.TEXT },
  collection: { type: Sequelize.STRING, references: {
    model: 'collections', 
    key: 'id',
  }}
};
