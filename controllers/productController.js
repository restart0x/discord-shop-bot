require('dotenv').config();
const fs = require('fs');
const path = require('path');
const DATA_FILE = path.join(__dirname, process.env.PRODUCTS_FILE_NAME || 'products.json');

function readProductsData() {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading products data:', error);
        return [];
    }
}

function writeProductsData(products) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2), 'utf8');
    } catch (error) {
        console.error('Error writing products data:', error);
    }
}

function addProduct(product) {
    const products = readProductsData();
    products.push(product);
    writeProductsData(products);
    console.log('Product added successfully');
}

function retrieveProducts() {
    return readProductsData();
}

function updateProduct(id, updatedProduct) {
    let products = readProductsData();
    const productIndex = products.findIndex(product => product.id === id);
    if (productIndex !== -1) {
        products[productIndex] = { ...products[productIndex], ...updatedProduct };
        writeProductsData(products);
        console.log('Product updated successfully');
    } else {
        console.log('Product not found');
    }
}

function deleteProduct(id) {
    let products = readProductsData();
    const filteredProducts = products.filter(product => product.id !== id);
    if (products.length !== filteredProducts.length) {
        writeProductsData(filteredProducts);
        console.log('Product deleted successfully');
    } else {
        console.log('Product not found');
    }
}

// New function to search products by name
function searchProductsByName(productName) {
    // Ensure the search is case-insensitive
    const lowerCaseProductName = productName.toLowerCase();
    const products = readProductsData();
    const foundProducts = products.filter(product => product.name.toLowerCase().includes(lowerCaseProductName));

    if (foundProducts.length > 0) {
        console.log(`Found ${foundProducts.length} product(s) matching "${productName}":`, foundProducts);
        return foundProducts;
    } else {
        console.log(`No products found matching "${productName}"`);
        return [];
    }
}

module.exports = {
    addProduct,
    retrieveProducts,
    updateProduct,
    deleteProduct,
    searchProductsByName // Export the new function
};