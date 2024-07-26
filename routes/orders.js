// Mengimpor modul yang diperlukan
const express = require("express");
const router = express.Router();
const { Order, OrderItem, MenuItem } = require("../models"); // Mengimpor model yang dibutuhkan
const { authenticateToken, authorizeRole } = require("../middleware/auth"); // Mengimpor middleware untuk autentikasi dan otorisasi

// Menggunakan middleware untuk mengautentikasi token pada semua rute di router ini
router.use(authenticateToken);

/**
 * Rute untuk membuat pesanan baru (hanya untuk pelanggan)
 * Metode POST
 */
router.post("/", authorizeRole("customer"), async (req, res) => {
  const { menuItems } = req.body; // Mengharapkan array item menu dengan kuantitas [{ id, quantity }]
  const { userId } = req.user; // Mengambil userId dari payload token

  try {
    // Membuat pesanan baru dengan customerId dari user yang sedang login
    const order = await Order.create({ customerId: userId });

    // Iterasi melalui menuItems untuk membuat OrderItem terkait
    for (const item of menuItems) {
      await OrderItem.create({
        orderId: order.id,
        menuItemId: item.id,
        quantity: item.quantity,
      });
    }

    // Mengembalikan pesanan yang berhasil dibuat dengan status 201 (Created)
    res.status(201).json(order);
  } catch (error) {
    // Jika terjadi kesalahan, kembalikan status 400 (Bad Request) dengan pesan kesalahan
    res.status(400).json({ error: error.message });
  }
});

/**
 * Rute untuk mendapatkan semua pesanan (hanya untuk kasir)
 * Metode GET
 */
router.get("/", authorizeRole("cashier"), async (req, res) => {
  try {
    // Mencari semua pesanan dan menyertakan item menu melalui relasi many-to-many dengan atribut quantity
    const orders = await Order.findAll({
      include: [{ model: MenuItem, through: { attributes: ["quantity"] } }],
    });
    // Mengembalikan semua pesanan dalam format JSON
    res.json(orders);
  } catch (error) {
    // Jika terjadi kesalahan, kembalikan status 400 (Bad Request) dengan pesan kesalahan
    res.status(400).json({ error: error.message });
  }
});

/**
 * Rute untuk mengupdate status pesanan menjadi 'completed' (hanya untuk kasir)
 * Metode PUT
 */
router.put("/:id", authorizeRole("cashier"), async (req, res) => {
  const { id } = req.params; // Mengambil id dari parameter rute

  try {
    // Mencari pesanan berdasarkan primary key
    const order = await Order.findByPk(id);
    if (!order) {
      // Jika pesanan tidak ditemukan, kembalikan status 404 (Not Found)
      return res.status(404).json({ error: "Order not found" });
    }

    // Mengubah status pesanan menjadi 'completed'
    order.status = "completed";
    await order.save();

    // Mengembalikan pesanan yang berhasil diupdate
    res.json(order);
  } catch (error) {
    // Jika terjadi kesalahan, kembalikan status 400 (Bad Request) dengan pesan kesalahan
    res.status(400).json({ error: error.message });
  }
});

// Mengekspor router untuk digunakan di bagian lain dari aplikasi
module.exports = router;
