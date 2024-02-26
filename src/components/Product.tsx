import React from 'react';

interface ProductProps {
    product: {
        id: string;
        product: string;
        price: number;
        brand?: string;
    };
    index: number;
}

const Product: React.FC<ProductProps> = ({ product, index }) => {
    return (
        <div>
            <h4>{index}. {product.product}</h4>
            <p>ID: {product.id}</p>
            <p>Price: ${product.price}</p>
            <p>Brand: {product.brand || 'N/A'}</p>
        </div>
    );
}

export default Product;
