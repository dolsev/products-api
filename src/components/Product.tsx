import React from 'react';
import { Grid, Typography, Divider } from '@mui/material';

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
        <Grid container spacing={0} style={{ marginBottom: '8px', padding: '8px' }} alignItems="center">
            <Grid item xs={12} sm={6}>
                <Typography variant="h6">{product.product}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Typography variant="body1"><strong>ID:</strong> {product.id}</Typography>
                <Typography variant="body1"><strong>Price:</strong> ${product.price}</Typography>
                <Typography variant="body1"><strong>Brand:</strong> {product.brand || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={12}>
                <Divider />
            </Grid>
        </Grid>
    );
}

export default Product;
