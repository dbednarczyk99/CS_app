import { useMemo, useState } from 'react';
import { AutocompleteArrayInput, useGetList } from 'react-admin';

type TagChoice = { id: string; name: string };
// tagi przychodzą z API jako { tag: { name } } (relacja), a do API wysyłamy same nazwy
type TagValue = string | { name?: string; tag?: { name: string } };

const toName = (t: TagValue) => (typeof t === 'string' ? t : (t.tag?.name ?? t.name ?? ''));

const TagInput = ({ source = 'tags', label = 'Tagi' }: { source?: string; label?: string }) => {
  const { data } = useGetList<TagChoice>('tags', {
    pagination: { page: 1, perPage: 100 },
    sort: { field: 'name', order: 'ASC' },
  });
  // tagi dopisane w tym formularzu, jeszcze niezapisane w bazie
  const [created, setCreated] = useState<TagChoice[]>([]);

  const choices = useMemo(() => {
    const seen = new Set<string>();
    return [...(data ?? []), ...created]
      .map((t) => ({ id: t.name, name: t.name }))
      .filter((t) => !seen.has(t.name) && seen.add(t.name));
  }, [data, created]);

  return (
    <AutocompleteArrayInput
      source={source}
      label={label}
      choices={choices}
      optionText="name"
      optionValue="id"
      format={(value: TagValue[] | undefined) => (Array.isArray(value) ? value.map(toName).filter(Boolean) : [])}
      onCreate={(name?: string) => {
        const trimmed = name?.trim();
        if (!trimmed) return undefined;
        const tag = { id: trimmed, name: trimmed };
        setCreated((prev) => [...prev, tag]);
        return tag;
      }}
      fullWidth
      filterSelectedOptions
      helperText="Wybierz istniejący lub wpisz nowy tag i naciśnij Enter"
    />
  );
};

export default TagInput;
