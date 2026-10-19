/* eslint-disable @typescript-eslint/no-explicit-any */

import { fetchUtils, type DataProvider } from 'react-admin';

export const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const httpClient = (url: string, options: fetchUtils.Options = {}) => {
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

/** Produkt: etykiety z API (obiekty) → labelIds do pól wyboru w formularzu (zapis wysyła labelIds) */
const labelIdsOf = (resource: string, record: any) =>
  resource === 'products' && Array.isArray(record.labels)
    ? { labelIds: (record.labels as { id: string }[]).map((l) => l.id) }
    : {};

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

    // etykiety do zaznaczenia przy produkcie – bez stałych (np. „Promocja” nadawana przez stronę)
    if (resource === 'products/labels' && params?.filter?.assignable) {
      const data = (base as { system?: string | null }[]).filter((l) => !l.system);
      return { data, total: data.length } as any;
    }

    const mapped =
      WITH_IMAGES.includes(resource)
        ? (base as any[]).map((product: any) => ({
            ...product,
            ...labelIdsOf(resource, product),
            images: Array.isArray(product.images)
              ? (product.images as any[]).map((img: any) => ({
                  ...img,
                  src: img.imgUrl ?? img.src,
                }))
              : [],
          }))
        : base;

    // API zwraca całą listę – sortowanie (kliknięcie w nagłówek kolumny) i strony liczone w panelu;
    // bez wybranego pola („id”) zostaje kolejność z API
    const { field, order } = params?.sort ?? {};
    const sorted =
      field && field !== 'id'
        ? [...mapped].sort((a: any, b: any) => {
            const x = field.split('.').reduce((o: any, k: string) => o?.[k], a);
            const y = field.split('.').reduce((o: any, k: string) => o?.[k], b);
            const cmp =
              x == null ? 1 : y == null ? -1 : String(x).localeCompare(String(y), 'pl', { numeric: true });
            return order === 'DESC' ? -cmp : cmp;
          })
        : mapped;
    const { page = 1, perPage = sorted.length } = params?.pagination ?? {};
    return { data: sorted.slice((page - 1) * perPage, page * perPage), total: sorted.length };
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
        ...labelIdsOf(resource, product),
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