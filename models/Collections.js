var Sequelize = require('sequelize');

module.exports = {
  id:   { type: Sequelize.STRING, primaryKey: true, allowNull: false },
  name: { type: Sequelize.STRING, allowNull: false },
  private: { type: Sequelize.BOOLEAN, defaultValue: false },
  owner: { type: Sequelize.UUID, references: {
    model: 'users', 
    key: 'id',
  }}
};
