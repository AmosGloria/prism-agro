const Product = require("../module/product.model");

exports.createProduct = async (farmerId, cropType, quantity, pricePerUnit, location, harvestDate) => {
    try{

        const newProduct = new product(farmerId, cropType, quantity, pricePerUnit, location, harvestDate);
        return await newProduct.save();

    }catch{

    }
}

exports.getProducts = async () => {
    try{
        return await product.find();
    }catch(error){
        throw error;
    }
}

exports.getProductById = async (id) => {
    try{
        return await product.findById(id);
    }catch(error){
        throw error;
    }
}

exports.updateProduct = async (id, updateData) => {
    try{
        return await product.findByIdAndUpdate(id, updateData, { new: true });
    }catch(error){
        throw error;
    }   
}

exports.deleteProduct = async (id) => {
    try{
        return await product.findByIdAndDelete(id);
    }catch(error){
        throw error;
    }
}

exports.getProductsByFarmerId = async (farmerId) => {
    try{
        return await product.find({ farmerId });
    }catch(error){
        throw error;
    }
}

exports.allProducts = async () => {
    try{
        return await product.find();
    }catch(error){
        throw error;
    }
}
