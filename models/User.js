// models/User.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("owner", "cashier", "customer"),
      allowNull: false,
    },
  },
  {
    hooks: {
      beforeCreate: async (user) => {
        // Corrected prefix assignment logic
        const count = await User.count({ where: { role: user.role } });
        let prefix;

        switch (user.role) {
          case "owner":
            prefix = "OWN";
            break;
          case "cashier":
            prefix = "CAS";
            break;
          case "customer":
            prefix = "CUS";
            break;
          default:
            prefix = "ERR";
            break;
        }

        user.id = `${prefix}${count + 1}`;
      },
    },
  }
);

module.exports = User;
