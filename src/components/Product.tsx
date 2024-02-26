import React from 'react';

interface ProductProps {
    product: {
        id: string;
        product: string;
        price: number;
        brand?: string;
    };
}

const Product: React.FC<ProductProps> = ({ product }) => {
    return (
        <div>
            <h4>{product.product}</h4>
            <p>ID: {product.id}</p>
            <p>Price: ${product.price}</p>
            <p>Brand: {product.brand || 'N/A'}</p>
        </div>
    );
}

export default Product;
