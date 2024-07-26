// routes/salesReport.js
const express = require("express");
const router = express.Router();
const { Order, OrderItem, MenuItem, sequelize } = require("../models");
const { authenticateToken, authorizeRole } = require("../middleware/auth");

router.use(authenticateToken);

router.get("/", authorizeRole("owner"), async (req, res) => {
  try {
    // Calculate total sales
    const totalSales = await OrderItem.sum("quantity", {
      include: [
        {
          model: Order,
          where: { status: "completed" },
          attributes: [], // Exclude attributes from Order model in the result
        },
      ],
    });

    // Calculate total transactions
    const totalTransactions = await Order.count({
      where: { status: "completed" },
    });

    // Items sold with details
    const itemsSold = await OrderItem.findAll({
      attributes: [
        "menuItemId",
        [sequelize.fn("sum", sequelize.col("quantity")), "totalQuantity"],
      ],
      group: ["menuItemId"],
      include: [{ model: MenuItem, attributes: ["name"] }],
    });

    res.json({
      totalSales,
      totalTransactions,
      itemsSold,
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
