// routes/menu.js
const express = require("express");
const router = express.Router();
const { MenuItem } = require("../models");
const { authenticateToken, authorizeRole } = require("../middleware/auth");

router.use(authenticateToken);

router.get("/", async (req, res) => {
  const menuItems = await MenuItem.findAll();
  res.json(menuItems);
});

router.post("/", authorizeRole("owner"), async (req, res) => {
  const { name, description, price } = req.body;

  try {
    const menuItem = await MenuItem.create({ name, description, price });
    res.status(201).json(menuItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/:id", authorizeRole("owner"), async (req, res) => {
  const { id } = req.params;
  const { name, description, price } = req.body;

  try {
    const menuItem = await MenuItem.findByPk(id);
    if (!menuItem) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    menuItem.name = name;
    menuItem.description = description;
    menuItem.price = price;
    await menuItem.save();

    res.json(menuItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/:id", authorizeRole("owner"), async (req, res) => {
  const { id } = req.params;

  try {
    const menuItem = await MenuItem.findByPk(id);
    if (!menuItem) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    await menuItem.destroy();
    res.json({ message: "Menu item deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
