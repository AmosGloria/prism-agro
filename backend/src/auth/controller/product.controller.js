// add products

const { createProduct } = require("../service/product.service");
const { getUserByEmail } = require("../service/user.service");

exports.newProduct = async (req, res) => {
    try {

        const email = req.user.email;
        const { cropType, quantity, pricePerUnit, location, harvestDate } = req.body;

        const farmerExists = await getUserByEmail(email);

        if (!farmerExists) {
            return res.status(404).json({ message: 'Farmer not found' });
        }

        const farmerId = farmerExists._id;
            
        if (!farmerId || !cropType || !quantity || !pricePerUnit || !location || !harvestDate) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const product = await createProduct(farmerId, cropType, quantity, pricePerUnit, location, harvestDate);

        res.status(201).json({
            message: 'Product created successfully',
            product
        });

    } catch (error) {
        res.status(500).json({
            message: 'An error occurred while creating the product',
            error: error.message
        });
    }
}