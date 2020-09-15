const mongoose = require('mongoose');
const sanphamSchema = new mongoose.Schema({
    Ten: String,
    NgayTao: Date,
});

module.exports = mongoose.model('SanPham', sanphamSchema);