const { Schema } = require('mongoose');

module.exports = new Schema({
  username: String,
  email: String,
  pw: String,
  passwordResetToken: { type: String, default: null },
  passwordResetExpires: { type: Date, default: null },
}, { timestamps: true });

// {
//   id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
//   username: { type: Sequelize.STRING(16), allowNull: false },
//   email:{ type: Sequelize.STRING, allowNull: false },
//   pw: { type: Sequelize.STRING(60), allowNull: false }
// };
