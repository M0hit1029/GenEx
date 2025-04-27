const express = require('express');
const { getRequirements, addRequirement } = require('../controllers/requirementController');
const router = express.Router();

router.get('/', getRequirements);
router.post('/', addRequirement);

module.exports = router;