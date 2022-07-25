const express = require('express');
const router = express.Router();
const estacaoController = require('../controllers/estacao-controller');

router.post('/', estacaoController.postEstacao)
router.get('/', estacaoController.getEstacao)
module.exports = router
