import { httpClient } from '../../dataProvider';

/** Wersja treści z historii (stan sprzed zapisu) */
export type Revision = { id: number; data: Record<string, unknown>; createdBy: string | null; createdAt: string };

/** Pobranie listy wersji z API */
export const fetchRevisions = async (url: string) => (await httpClient(url)).json as Revision[];
