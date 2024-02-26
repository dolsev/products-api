
const md5 = require('md5');

const BASE_URL = 'https://api.valantis.store:41000/';
const PASSWORD = 'Valantis';

async function fetchProductIds(page: number) {
    const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const authString = md5(PASSWORD + '_' + timestamp);

    const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Auth': authString
        },
        body: JSON.stringify({
            action: 'get_ids',
            params: { offset: (page - 1) * 50, limit: 50 }
        })
    });

    if (!response.ok) {
        throw new Error('Failed to fetch product IDs');
    }

    const data = await response.json();
    return data.result;
}


async function fetchProductDetails(productIds: string[]) {
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

    const data = await response.json();
    return data.result;
}

export { fetchProductIds, fetchProductDetails };
