const express = require('express');
const { getProjects, createProject } = require('../controllers/projectController');
const jwtAuth = require('../middleware/jwtAuth');
const router = express.Router();

router.get('/', getProjects);
router.post('/createProject',jwtAuth, createProject);




module.exports = router;