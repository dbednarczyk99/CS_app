import React, { useCallback, useEffect, useRef, useState, type JSX } from 'react';
import { useInput } from 'react-admin';
import { Button, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ImageCropDialog } from './ImageCropDialog';
import { IMAGE_PRESETS, presetHint, type ImagePreset } from './image-presets';

type ImageItem = {
  id?: string;
  imgUrl?: string;
  src?: string;
  title?: string;
  rawFile?: File | null;
  order?: number;
};

export const SortableImageInput = ({
  source,
  validate = true,
  maxQty = 10,
  preset = IMAGE_PRESETS.place,
}: {
  source: string;
  validate?: boolean;
  maxQty?: number;
  /** proporcje i rozmiary – każde dodane zdjęcie przechodzi przez okno kadrowania */
  preset?: ImagePreset;
}) => {
  const {
    field,
    fieldState,
  } = useInput({
    source,
    validate: (value: ImageItem[] | undefined) => {
      if (!validate) return undefined;
      if (!value || value.length === 0) return 'Dodaj co najmniej jedno zdjęcie';
      if (maxQty && value.length > maxQty) return `Najwyżej ${maxQty} zdjęć`;
      return undefined;
    },
    defaultValue: [],
  });

  const values = field.value as ImageItem[] | undefined;
  const itemsRef = useRef<Record<string, ImageItem>>({});

  // initialize itemsRef for stable ids
  useEffect(() => {
    const arr = values ?? [];
    arr.forEach((item, idx) => {
      const key = item.id ?? item.imgUrl ?? item.src ?? `new-${idx}`;
      itemsRef.current[key] = item;
    });
  }, [values]);

  const setOrdered = useCallback(
    (arr: ImageItem[]) => {
      try {
        const ordered = arr.map((it, idx) => ({ ...it, order: idx }));
        field.onChange(ordered);
      } catch (e) {
        console.error('Error in setOrdered:', e);
      }
    },
    [field],
  );

  // Ensure images have order set on first load or when length changes
  const initializedRef = useRef(false);
  useEffect(() => {
    if (!initializedRef.current && (values ?? []).length > 0) {
      setOrdered(values ?? []);
      initializedRef.current = true;
    }
  }, [values, setOrdered]);

  // wybrane pliki czekają w kolejce na kadrowanie – po jednym
  const [queue, setQueue] = useState<File[]>([]);

  const onAddFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      let picked = Array.from(files);
      if (fileInputRef.current) fileInputRef.current.value = '';

      // Ogranicz ilość zdjęć
      const free = maxQty - (values?.length ?? 0) - queue.length;
      if (maxQty && picked.length > free) {
        alert(`Możesz dodać maksymalnie ${maxQty} zdjęć`);
        picked = picked.slice(0, Math.max(0, free));
      }

      const accepted = picked.filter((f) => {
        if (!f.type.startsWith('image/')) {
          alert(`${f.name} nie jest zdjęciem`);
          return false;
        }
        if (f.size > 30 * 1024 * 1024) {
          alert(`${f.name} jest za duży (najwyżej 30 MB)`);
          return false;
        }
        return true;
      });
      setQueue((q) => [...q, ...accepted]);
    },
    [values, queue.length, maxQty],
  );

  // przycięte zdjęcie trafia na koniec listy (wgra się przy zapisie formularza)
  const onCropped = (f: File) => {
    setQueue((q) => q.slice(1));
    setOrdered([...(values ?? []), { rawFile: f, src: URL.createObjectURL(f), title: f.name }]);
  };
  const cropDialog = queue[0] && (
    <ImageCropDialog
      key={`${queue[0].name}-${queue[0].lastModified}-${queue.length}`}
      file={queue[0]}
      preset={preset}
      onDone={onCropped}
      onCancel={() => setQueue((q) => q.slice(1))}
    />
  );
  const hint = (
    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
      {presetHint(preset)}
    </Typography>
  );

  const onRemove = useCallback(
    (index: number) => {
      try {
        const arr = values ? [...values] : [];
        const item = arr.splice(index, 1)[0];
        // revoke object URL if it was created
        if (item?.rawFile && item.src) {
          try {
            URL.revokeObjectURL(item.src);
          } catch (e) {
            console.error('Error revoking URL:', e);
          }
        }
        setOrdered(arr);
      } catch (e) {
        console.error('Error in onRemove:', e);
      }
    },
    [values, setOrdered],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!active || !over || !active.id || !over.id) return;
      if (active.id !== over.id) {
        const oldIndex = Number(String(active.id).split('::')[0]);
        const newIndex = Number(String(over.id).split('::')[0]);
        const arr = values ? [...values] : [];
        const newArr = arrayMove(arr, oldIndex, newIndex);
        setOrdered(newArr);
      }
    },
    [values, setOrdered],
  );

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // cleanup object urls on unmount (tylko przy zamknięciu formularza – nie przy każdej zmianie listy)
  const latestRef = useRef(values);
  useEffect(() => {
    latestRef.current = values;
  }, [values]);
  useEffect(() => {
    return () => {
      const arr = latestRef.current;
      (arr ?? []).forEach((it) => {
        if (it?.rawFile && it.src) {
          try {
            URL.revokeObjectURL(it.src);
          } catch (e) {
            console.error('Error revoking URL on cleanup:', e);
          }
        }
      });
    };
  }, []);

  let error = fieldState?.error?.message;
  if (error && typeof error === 'string') {
    error = error.replace(/^@@react-admin@@("|')?|("|')?$/g, '');
  }

  if (!values || values.length === 0) {
    return (
      <div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <Button variant="outlined" startIcon={<ImageIcon />} onClick={() => fileInputRef.current?.click()}>
            Dodaj zdjęcia
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            onChange={(e) => onAddFiles(e.target.files)}
          />
        </div>
        {hint}
        {error && <Typography color="error" variant="body2" sx={{ mb: 1 }}>{error}</Typography>}
        {cropDialog}
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <Button variant="outlined" startIcon={<ImageIcon />} onClick={() => fileInputRef.current?.click()}>
          Dodaj zdjęcia
        </Button>
        <Typography variant="caption" color="text.secondary" sx={{ alignSelf: 'center' }}>
          Przeciągnij, aby zmienić kolejność – pierwsze zdjęcie jest główne
        </Typography>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          onChange={(e) => onAddFiles(e.target.files)}
        />
      </div>

      {hint}
      {error && <Typography color="error" variant="body2" sx={{ mb: 1 }}>{error}</Typography>}
      {cropDialog}

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={(values ?? []).map((_, idx) => `${idx}::item`)}
          strategy={verticalListSortingStrategy}
        >
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {(values ?? []).map((item, idx) => (
              <SortableImageCard
                key={idx}
                id={`${idx}::item`}
                index={idx}
                item={item}
                onRemove={() => onRemove(idx)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

type SortableImageCardProps = {
  id: string;
  index: number;
  item: ImageItem;
  onRemove: () => void;
};

const SortableImageCard = ({ id, index, item, onRemove }: SortableImageCardProps): JSX.Element => {
  const { setNodeRef, listeners, attributes, transform, transition } =
    useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    width: 140,
    height: 140,
    borderRadius: 2,
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 1px 6px rgba(0,0,0,0.2)',
    background: '#222',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {item?.src || item?.imgUrl ? (
        <img
          src={item.src ?? item.imgUrl}
          alt={item.title ?? ''}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <div style={{ color: '#b9b1a4', fontSize: 13 }}>Brak zdjęcia</div>
      )}

      <IconButton
        onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); onRemove(); }}
        size="small"
        sx={{ position: 'absolute', right: 6, top: 6, bgcolor: 'rgba(255,255,255,0.8)' }}
        aria-label="Usuń zdjęcie"
      >
        <DeleteIcon color="error" />
      </IconButton>

      {index === 0 && (
        <div style={{ position: 'absolute', left: 6, bottom: 6, background: '#c9a36a', color: '#141618', padding: '2px 8px', borderRadius: 2, fontSize: 11, fontFamily: '"Oswald", sans-serif', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          Główne
        </div>
      )}
    </div>
  );
};

export default SortableImageInput;