// models/OrderItem.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Order = require("./Order");
const MenuItem = require("./MenuItem");

const OrderItem = sequelize.define("OrderItem", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  orderId: {
    type: DataTypes.INTEGER,
    references: {
      model: Order,
      key: "id",
    },
  },
  menuItemId: {
    type: DataTypes.INTEGER,
    references: {
      model: MenuItem,
      key: "id",
    },
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

OrderItem.belongsTo(Order, { foreignKey: "orderId" });
OrderItem.belongsTo(MenuItem, { foreignKey: "menuItemId" });

module.exports = OrderItem;
