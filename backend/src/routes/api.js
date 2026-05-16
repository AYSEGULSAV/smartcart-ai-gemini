const express = require('express');
const router = express.Router();
const { handleRecipeGeneration } = require('../controllers/ai.controller');

router.post('/recipe/generate', handleRecipeGeneration);

module.exports = router;