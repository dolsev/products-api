// api.tsx
import {ProductInterface} from "../types/productInterface";
const md5 = require('md5');

const BASE_URL = 'https://api.valantis.store:41000/';
const PASSWORD = 'Valantis';

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

async function fetchFilteredProductIds(product?: string, price?: number, brand?: string): Promise<string[]> {
    const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const authString = md5(PASSWORD + '_' + timestamp);

    const params: { [key: string]: any } = {};

    if (product !== undefined && product !== "") {
        params.product = product;
    }
    if (price !== undefined) {
        params.price = price;
    }
    if (brand !== undefined && brand !== "") {
        params.brand = brand;
    }

    const body = {
        action: 'filter',
        params: params
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



async function fetchProductDetails(productIds: string[], currentProducts: ProductInterface[]): Promise<ProductInterface[]> {
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
    return result

}

export { fetchProductIds, fetchProductDetails, fetchFilteredProductIds };
