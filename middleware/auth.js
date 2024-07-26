// Mengimpor modul yang diperlukan
const jwt = require("jsonwebtoken"); // Library untuk menangani JSON Web Tokens
require("dotenv").config(); // Untuk memuat variabel lingkungan dari file .env

/**
 * Middleware untuk mengautentikasi token
 * Fungsi ini memeriksa keberadaan token di header Authorization dari permintaan.
 * Jika token ada, fungsi ini memverifikasi token menggunakan kunci rahasia.
 * Jika token valid, fungsi ini melampirkan payload yang didekodekan ke objek request dan memanggil middleware berikutnya.
 * Jika token hilang atau tidak valid, fungsi ini merespons dengan pesan kesalahan yang sesuai.
 */
const authenticateToken = (req, res, next) => {
  // Mengambil token dari header Authorization, jika ada
  const token = req.header("Authorization")?.split(" ")[1];

  // Jika tidak ada token yang ditemukan, respon dengan status kode 401 (Unauthorized)
  if (!token) {
    return res.status(401).json({ error: "Akses ditolak, token tidak ada!" });
  }

  try {
    // Verifikasi token menggunakan kunci rahasia dari variabel lingkungan
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // Lampirkan payload yang didekodekan ke objek request
    req.user = payload;
    // Panggil middleware berikutnya dalam tumpukan
    next();
  } catch (error) {
    // Jika token tidak valid, respon dengan status kode 400 (Bad Request)
    res.status(400).json({ error: "Token tidak valid" });
  }
};

/**
 * Middleware untuk otorisasi peran tertentu
 * Fungsi ini memeriksa apakah peran pengguna yang terautentikasi sesuai dengan peran yang diperlukan.
 * Jika peran sesuai, fungsi ini memanggil middleware berikutnya.
 * Jika peran tidak sesuai, fungsi ini merespons dengan status kode 403 (Forbidden).
 *
 * @param {string} role - Peran yang diperlukan untuk mengakses sumber daya
 * @returns {function} - Fungsi middleware untuk menangani otorisasi peran
 */
const authorizeRole = (role) => {
  return (req, res, next) => {
    // Jika peran pengguna tidak sesuai dengan peran yang diperlukan, respon dengan status kode 403 (Forbidden)
    if (req.user.role !== role) {
      return res.status(403).json({
        error: "Terlarang, Anda tidak memiliki akses ke sumber daya ini",
      });
    }
    // Jika peran sesuai, panggil middleware berikutnya dalam tumpukan
    next();
  };
};

// Mengekspor fungsi-fungsi middleware untuk digunakan di bagian lain dari aplikasi
module.exports = {
  authenticateToken,
  authorizeRole,
};
