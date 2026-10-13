import {
  AutocompleteArrayInput,
  useGetList,
  useInput,
} from 'react-admin';
import { useState, useEffect } from 'react';

const TagInput = ({ source = 'tags', label = 'Tags' }) => {
  const { data: tags = [] } = useGetList('tags', {
    pagination: { page: 1, perPage: 100 },
    sort: { field: 'name', order: 'ASC' },
  });

  const {
    field: { onChange, value },
  } = useInput({ source });

  const [choices, setChoices] = useState(tags);

  // aktualizuj choices gdy useGetList zwróci dane
  useEffect(() => {
    setChoices(tags);
  }, [tags]);

  const formattedChoices = (choices || []).map(v => (typeof v === 'string' ? { id: v, name: v } : v));


  const handleCreate = (newTagName?: string) => {
  const trimmedName = newTagName?.trim();
  if (!trimmedName) return undefined;
  console.log('Creating tag:', trimmedName);

  const newTag = { id: trimmedName, name: trimmedName };

  // dodaj nowy tag do choices
  setChoices((prev) => {
    // unikaj duplikatów
    if (prev.find((t) => t.name === trimmedName)) return prev;
    return [...prev, newTag];
  });

  // dodaj nowy tag do formularza - tylko nazwa
  const currentValue = value || [];
  if (!currentValue.includes(trimmedName)) {
    onChange([...currentValue, trimmedName]);
  }

  return newTag;
};


  return (
    <AutocompleteArrayInput
      source={source}
      label={label}
      choices={formattedChoices}
      optionText="name"
      optionValue="name"
      fullWidth
      filterSelectedOptions
      helperText="Wybierz istniejący lub wpisz nowy tag i naciśnij Enter"
      onCreate={handleCreate}
    />
  );
};

export default TagInput;
