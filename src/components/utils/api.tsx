// api.tsx
const md5 = require('md5');

interface ProductType {
    id: string;
    product: string;
    price: number;
    brand?: string;
}

const BASE_URL = 'https://api.valantis.store:41000/';
const PASSWORD = 'Valantis';

async function fetchFilteredProductIds(query?: string, price?: number, brand?: string): Promise<string[]> {
    const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const authString = md5(PASSWORD + '_' + timestamp);

    const body = {
        action: 'filter',
        params: {
            product: query,
            price: price,
            brand: brand
        }
    };

    const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Auth': authString
        },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        throw new Error('Failed to fetch filtered product IDs');
    }
    const data = await response.json();
    return data.result;
}

async function fetchProductIds(offset: number): Promise<string[]> {
    const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const authString = md5(PASSWORD + '_' + timestamp);
    const body = {
        action: 'get_ids',
        params: {
            offset: offset,
            limit: 100,
        }
    };
    const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Auth': authString
        },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        throw new Error('Failed to fetch product IDs');
    }

    const data = await response.json();
    return Array.from(new Set(data.result));
}

async function fetchProductDetails(productIds: string[], currentProducts: ProductType[]): Promise<ProductType[]> {
    const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const authString = md5(PASSWORD + '_' + timestamp);

    const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Auth': authString
        },
        body: JSON.stringify({
            action: 'get_items',
            params: { ids: productIds }
        })
    });

    if (!response.ok) {
        throw new Error('Failed to fetch product details');
    }

    const { result } = await response.json();

    return result.reduce((acc: ProductType[], product: ProductType) => {
        if (!acc.find((p: ProductType) => p.id === product.id) && !currentProducts.find((p: ProductType) => p.id === product.id)) {
            acc.push(product);
        }
        return acc;
    }, []);
}

export { fetchProductIds, fetchProductDetails, fetchFilteredProductIds };
