const express = require('express');
const { addProduct, updateQuantity, getProduct, deleteProduct } = require('./productsController');
const router = express.Router();

router.post('/products', addProduct);
router.put('/products/:id', updateQuantity);
router.get('/products/:id', getProduct);
router.delete('/products/:id', deleteProduct);

module.exports = router;
