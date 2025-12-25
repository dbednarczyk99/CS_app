import { fetchUtils, type DataProvider } from 'react-admin';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const httpClient = (url: string, options: fetchUtils.Options = {}) => {
    const headers = new Headers(options.headers ?? { Accept: 'application/json' });

    // Content-Type tylko dla JSON (nie ustawiamy przy FormData)
    if (!(options.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
    }

    const token = localStorage.getItem('token');
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    return fetchUtils.fetchJson(url, { ...options, headers });
};

interface ProductImageFormValue {
    id?: string;
    src?: string;
    title?: string;
    imgUrl?: string;
    rawFile?: File;
}

// helper – upload jednego pliku do /upload i zwróć URL
const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${apiUrl}/upload`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Upload failed');
    }

    const json = await response.json();
    return json.url as string; // url do zapisania w imgUrl
};

// przygotowanie payloadu dla /products (create/update)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prepareProductPayload = async (data: any) => {
    const images: ProductImageFormValue[] = Array.isArray(data.images)
        ? (data.images as ProductImageFormValue[])
        : [];

    const existingImages = images.filter((img) => !img.rawFile);
    const newImages = images.filter((img) => !!img.rawFile);

    // istniejące – zakładamy, że mają już imgUrl albo src z prawdziwym URLaem
    const existingImagesPayload = existingImages
        .map((img) => img.imgUrl || img.src || '')
        .filter((url) => url.length > 0)
        .map((url) => ({ imgUrl: url }));

    // nowe – upload do /upload
    const uploadedUrls = await Promise.all(
        newImages.map((img) => uploadFile(img.rawFile as File)),
    );

    const uploadedImagesPayload = uploadedUrls.map((url) => ({ imgUrl: url }));

    return {
        ...data,
        images: [...existingImagesPayload, ...uploadedImagesPayload],
    };
};

export const dataProvider: DataProvider = {
    // LISTA
    async getList(resource) {
        const { json } = await httpClient(`${apiUrl}/${resource}`);
        const data = Array.isArray(json) ? json : [json];

        // jeśli to products – dodaj src = imgUrl dla obrazków
        const mapped =
            resource === 'products'
                ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                 (data as any[]).map((product) => ({
                      ...product,
                      images: Array.isArray(product.images)
                          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          product.images.map((img: any) => ({
                                ...img,
                                src: img.imgUrl ?? img.src,
                            }))
                          : [],
                  }))
                : data;

        return {
            data: mapped,
            total: mapped.length,
        };
    },

    // POJEDYNCZY
    async getOne(resource, params) {
        const { json } = await httpClient(`${apiUrl}/${resource}/${params.id}`);

        if (resource === 'products') {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const product = json as any;
            const mapped = {
                ...product,
                images: Array.isArray(product.images)
                    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    product.images.map((img: any) => ({
                          ...img,
                          src: img.imgUrl ?? img.src,
                      }))
                    : [],
            };
            return { data: mapped };
        }

        return { data: json };
    },

    // CREATE
    async create(resource, params) {
        if (resource === 'products') {
            const payload = await prepareProductPayload(params.data);
            const { json } = await httpClient(`${apiUrl}/${resource}`, {
                method: 'POST',
                body: JSON.stringify(payload),
            });
            return { data: json };
        }

        const { json } = await httpClient(`${apiUrl}/${resource}`, {
            method: 'POST',
            body: JSON.stringify(params.data),
        });
        return { data: json };
    },

    // UPDATE
    async update(resource, params) {
        if (resource === 'products') {
            const payload = await prepareProductPayload(params.data);
            const { json } = await httpClient(`${apiUrl}/${resource}/${params.id}`, {
                method: 'PATCH',
                body: JSON.stringify(payload),
            });
            return { data: json };
        }

        const { json } = await httpClient(`${apiUrl}/${resource}/${params.id}`, {
            method: 'PATCH',
            body: JSON.stringify(params.data),
        });
        return { data: json };
    },

    // DELETE
    async delete(resource, params) {
        const { json } = await httpClient(`${apiUrl}/${resource}/${params.id}`, {
            method: 'DELETE',
        });
        return { data: json };
    },

    // WIELE
    async getMany(resource, params) {
        const responses = await Promise.all(
            params.ids.map((id) => httpClient(`${apiUrl}/${resource}/${id}`)),
        );
        const data = responses.map(({ json }) => json);
        return { data };
    },

    async getManyReference() {
        return { data: [], total: 0 };
    },

    async updateMany() {
        return { data: [] };
    },

    async deleteMany() {
        return { data: [] };
    },
};