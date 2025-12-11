const crypto = require('crypto');

// --- KONFIGURASI ---
const TIME_STEP = 120; // 1 Menit (dalam detik)
const secretKey = process.env.PHONE_SECRET;

/**
 * Fungsi untuk menghasilkan Token 4 Digit
 * @param {string} userId - ID Pengguna
 * @param {string} secretKey - Kunci Rahasia
 * @returns {string} Token 4 digit (string)
 */
function generateToken(userId) {
    const currentEpoch = Math.floor(Date.now() / 1000);
    const timeInterval = Math.floor(currentEpoch / TIME_STEP);
    const payload = `${userId}-${timeInterval}`;

    // 4. Buat HMAC-SHA256 Hash
    const hmac = crypto.createHmac('sha256', secretKey);
    hmac.update(payload);
    const hexDigest = hmac.digest('hex');
    const hashInt = parseInt(hexDigest.substring(0, 8), 16);
    const tokenInt = hashInt % 100000;
    return tokenInt.toString().padStart(5, '0');
}

/**
 * Fungsi untuk Memverifikasi Token
 * @param {string} inputToken - Token yang dimasukkan user
 * @param {string} userId - ID Pengguna
 * @param {string} secretKey - Kunci Rahasia
 * @returns {boolean} True jika valid, False jika tidak
 */
function verifyToken(inputToken, userId) {
    // Generate token yang SEHARUSNYA ada saat ini
    const currentValidToken = generateToken(userId, secretKey);

    // Bandingkan token input dengan token yang valid
    // Catatan: Dalam produksi, gunakan timingSafeEqual untuk keamanan maksimal
    return inputToken === currentValidToken;
}
module.exports = { generateToken, verifyToken };