var thinky = require('thinky');
// var r = thinky.r;
var type = thinky.type;

module.exports = {
  id: type.string(),
  name: type.string(),
  private: type.boolean().default(false),
  items: type.array().schema(
    type.object().schema(
      {
        title: type.string(),
        link: type.string(),
        description: type.string()
      })
    ).default([]),
  ownerId: type.id(),
  createdAt: Date, // type.date().default(r.now()),
};

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
