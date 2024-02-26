const md5 = require('md5');

const BASE_URL = 'https://api.valantis.store:41000/';
const PASSWORD = 'Valantis';

async function fetchFilteredProductIds(query: string, price?: number, brand?: string): Promise<string[]> {
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

async function fetchProductIds(): Promise<string[]> {
    const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const authString = md5(PASSWORD + '_' + timestamp);
    const body = {
        action: 'get_ids',
        params: {
            offset: 0,
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
    const uniqueIds: string[] = Array.from(new Set(data.result));
    console.log(`ids ${uniqueIds}`);
    return uniqueIds;
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

    const uniqueProducts = data.result.reduce((acc: any[], product: any) => {
        if (!acc.find((p: any) => p.id === product.id)) {
            acc.push(product);
        }
        return acc;
    }, []);

    console.log(`items from ids ${uniqueProducts.map((product:any)=>product.price)}`)
    return uniqueProducts;
}

export { fetchProductIds, fetchProductDetails, fetchFilteredProductIds };
