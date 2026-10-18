/* eslint-disable @typescript-eslint/no-explicit-any */

import { fetchUtils, type DataProvider } from 'react-admin';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const httpClient = (url: string, options: fetchUtils.Options = {}) => {
  const headers = new Headers(options.headers ?? { Accept: 'application/json' });

  if (!(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const token = localStorage.getItem('token');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return fetchUtils.fetchJson(url, { ...options, headers });
};

// zasoby z galerią zdjęć (upload plików + mapowanie imgUrl → src dla ImageInput)
const WITH_IMAGES = ['products', 'contact/locations', 'blog'];

interface ImageFormValue {
  id?: string;
  src?: string;
  title?: string;
  imgUrl?: string;
  rawFile?: File;
  order?: number;
}

const uploadFile = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  const token = localStorage.getItem('token');
  const response = await fetch(`${apiUrl}/upload`, {
    method: 'POST',
    body: formData,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (!response.ok) {
    throw new Error('Upload failed');
  }

  const json = await response.json();
  return json.url as string;
};

const preparePayload = async (data: any) => {
  const images: ImageFormValue[] = Array.isArray(data.images)
    ? (data.images as ImageFormValue[])
    : [];

  const existingImages = images.filter((img) => !img.rawFile);
  const newImages = images.filter((img) => !!img.rawFile);

  const existingImagesPayload = existingImages
    .map((img, idx) => ({ imgUrl: img.imgUrl || img.src || '', order: img.order ?? idx }))
    .filter((obj) => obj.imgUrl.length > 0);

  const uploadedUrls = await Promise.all(
    newImages.map((img) => uploadFile(img.rawFile as File)),
  );

  const uploadedImagesPayload = uploadedUrls.map((url, idx) => ({ imgUrl: url, order: newImages[idx]?.order ?? (existingImages.length + idx) }));

  return {
    ...data,
    images: [...existingImagesPayload, ...uploadedImagesPayload],
  };
};

export const dataProvider: DataProvider = {
  // LISTA
  async getList(resource, params) {
    // rezerwacje: filtry po stronie API (status, dzień odbioru, rodzaj punktu, wyszukiwarka)
    if (resource === 'reservations') {
      const query = new URLSearchParams();
      for (const [key, value] of Object.entries(params?.filter ?? {})) {
        if (value !== undefined && value !== null && value !== '') query.set(key, String(value));
      }
      const { json } = await httpClient(`${apiUrl}/reservations?${query}`);
      const data = json as any[];
      return { data, total: data.length };
    }

    if (resource === 'locations') {
      const { json } = await httpClient(`${apiUrl}/contact/locations`);

      if (json === undefined || json === null) {
        return { data: [], total: 0 };
      }

      const data = Array.isArray(json) ? json : [json];
      return { data, total: data.length };
    }

    // blog: panel widzi też wpisy nieopublikowane (tylko newsletter)
    const { json } = await httpClient(resource === 'blog' ? `${apiUrl}/blog/admin/all` : `${apiUrl}/${resource}`);
    const base = Array.isArray(json) ? json : [json];

    const mapped =
      WITH_IMAGES.includes(resource)
        ? (base as any[]).map((product: any) => ({
            ...product,
            images: Array.isArray(product.images)
              ? (product.images as any[]).map((img: any) => ({
                  ...img,
                  src: img.imgUrl ?? img.src,
                }))
              : [],
          }))
        : base;

    return { data: mapped, total: mapped.length };
  },

  // POJEDYNCZY
  async getOne(resource, params) {
    // SPECJALNY CASE – singleton bread-van/description
    if (resource === 'bread-van/description') {
      const { json } = await httpClient(`${apiUrl}/bread-van/description`);
      const description = json as any;
      const mapped = {
        ...description,
        images: Array.isArray(description.images)
          ? (description.images as any[]).map((img: any) => ({
              ...img,
              src: img.imgUrl ?? img.src,
            }))
          : [],
      };
      return { data: mapped };
    }

    if (resource === 'locations') {
      const { json } = await httpClient(
        `${apiUrl}/contact/location/${params.id}`,
      );
      return { data: json };
    }

    const { json } = await httpClient(
      resource === 'blog' ? `${apiUrl}/blog/admin/${params.id}` : `${apiUrl}/${resource}/${params.id}`,
    );

    if (WITH_IMAGES.includes(resource)) {
      const product = json as any;
      const mapped = {
        ...product,
        images: Array.isArray(product.images)
          ? (product.images as any[]).map((img: any) => ({
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
    if (WITH_IMAGES.includes(resource)) {
      const payload = await preparePayload(params.data);
      const { json } = await httpClient(`${apiUrl}/${resource}`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      return { data: json };
    }

    if (resource === 'locations') {
      const { json } = await httpClient(`${apiUrl}/contact/location`, {
        method: 'POST',
        body: JSON.stringify(params.data),
      });
      return { data: json };
    }

    const { json } = await httpClient(`${apiUrl}/${resource}`,
      {
        method: 'POST',
        body: JSON.stringify(params.data),
      },
    );
    return { data: json };
  },

  // UPDATE
  async update(resource, params) {
    if (resource === 'bread-van/description') {
      const payload = await preparePayload(params.data);
      const { json } = await httpClient(`${apiUrl}/bread-van/description`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
      return { data: json };
    }

    if (WITH_IMAGES.includes(resource)) {
      const payload = await preparePayload(params.data);
      const { json } = await httpClient(
        `${apiUrl}/${resource}/${params.id}`,
        {
          method: 'PATCH',
          body: JSON.stringify(payload),
        },
      );
      return { data: json };
    }

    if (resource === 'locations') {
      const { json } = await httpClient(
        `${apiUrl}/contact/location/${params.id}`,
        {
          method: 'PATCH',
          body: JSON.stringify(params.data),
        },
      );
      return { data: json };
    }

    const { json } = await httpClient(
      `${apiUrl}/${resource}/${params.id}`,
      {
        method: 'PATCH',
        body: JSON.stringify(params.data),
      },
    );
    return { data: json };
  },

  // DELETE
  async delete(resource, params) {
    if (resource === 'locations') {
      const { json } = await httpClient(
        `${apiUrl}/contact/location/${params.id}`,
        {
          method: 'DELETE',
        },
      );
      return { data: json };
    }

    const { json } = await httpClient(
      `${apiUrl}/${resource}/${params.id}`,
      {
        method: 'DELETE',
      },
    );
    return { data: json };
  },

  // WIELE (generyczne)
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

  // usuwanie zaznaczonych na liście – po kolei tym samym endpointem co pojedyncze
  async deleteMany(resource, params) {
    await Promise.all(params.ids.map((id) => dataProvider.delete(resource, { id })));
    return { data: params.ids };
  },
};