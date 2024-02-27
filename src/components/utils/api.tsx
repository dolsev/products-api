import { ProductInterface } from "../types/productInterface";
const md5 = require('md5');

const BASE_URL = 'https://api.valantis.store:41000/';
const PASSWORD = 'Valantis';

async function fetchWithRetry(url: string, options: RequestInit, retryCount: number = 0): Promise<Response> {
    const MAX_RETRY = 10;
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            if (retryCount < MAX_RETRY) {
                console.log(`Retrying the request. Retry count: ${retryCount + 1}`);
                return fetchWithRetry(url, options, retryCount + 1);
            } else {
                throw new Error(`Failed to fetch data after ${MAX_RETRY} retries.`);
            }
        }
        return response;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw new Error('Failed to fetch data');
    }
}

async function fetchProductIds(offset: number): Promise<string[]> {
    const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const authString = md5(PASSWORD + '_' + timestamp);
    const body = {
        action: 'get_ids',
        params: {
            offset: offset,
            limit: 500,
        }
    };
    const options: RequestInit = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Auth': authString
        },
        body: JSON.stringify(body)
    };

    const response = await fetchWithRetry(BASE_URL, options);
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

    const options: RequestInit = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Auth': authString
        },
        body: JSON.stringify(body)
    };

    const response = await fetchWithRetry(BASE_URL, options);
    const data = await response.json();
    return data.result;
}

async function fetchProductDetails(productIds: string[], currentProducts: ProductInterface[]): Promise<ProductInterface[]> {
    const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const authString = md5(PASSWORD + '_' + timestamp);

    const options: RequestInit = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Auth': authString
        },
        body: JSON.stringify({
            action: 'get_items',
            params: { ids: productIds }
        })
    };

    const response = await fetchWithRetry(BASE_URL, options);
    const { result } = await response.json();
    return result;
}

export { fetchProductIds, fetchProductDetails, fetchFilteredProductIds };
