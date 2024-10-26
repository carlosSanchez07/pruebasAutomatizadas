let products = [];

const addProduct = (req, res) => {
    const { name, price, quantity } = req.body;
    const product = { id: products.length + 1, name, price, quantity };
    products.push(product);
    return res.status(201).json(product);
};

const updateQuantity = (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;
    const product = products.find(p => p.id === parseInt(id));
    if (product) {
        product.quantity = quantity;
        return res.status(200).json(product);
    }
    return res.status(404).json({ message: "Product not found" });
};

const getProduct = (req, res) => {
    const { id } = req.params;
    const product = products.find(p => p.id === parseInt(id));
    if (product) {
        return res.status(200).json(product);
    }
    return res.status(404).json({ message: "Product not found" });
};

const deleteProduct = (req, res) => {
    const { id } = req.params;
    products = products.filter(p => p.id !== parseInt(id));
    return res.status(204).send();
};

module.exports = { addProduct, updateQuantity, getProduct, deleteProduct };
