const express = require('express');
const { uploadFile } = require('../controllers/uploadController');
const router = express.Router();

router.post('/', uploadFile);

module.exports = router;