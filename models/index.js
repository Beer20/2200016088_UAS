// models/index.js
const sequelize = require("../config/database");
const User = require("./User");
const MenuItem = require("./MenuItem");
const Order = require("./Order");
const OrderItem = require("./OrderItem");

User.hasMany(Order, { foreignKey: "customerId" });
Order.belongsTo(User, { foreignKey: "customerId" });

Order.belongsToMany(MenuItem, { through: OrderItem, foreignKey: "orderId" });
MenuItem.belongsToMany(Order, { through: OrderItem, foreignKey: "menuItemId" });

module.exports = {
  sequelize,
  User,
  MenuItem,
  Order,
  OrderItem,
};
