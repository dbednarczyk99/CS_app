import React, { useCallback, useEffect, useRef, type JSX } from 'react';
import { useInput } from 'react-admin';
import { IconButton } from '@mui/material';
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
}: {
  source: string;
  validate?: boolean;
  maxQty?: number;
}) => {
  const {
    field,
    fieldState,
  } = useInput({
    source,
    validate: (value: ImageItem[] | undefined) => {
      if (!validate) return undefined;
      if (!value || value.length === 0) return 'At least one image is required';
      if (maxQty && value.length > maxQty) return `Max ${maxQty} images allowed`;
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

  const onAddFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const arr = values ? [...values] : [];

      // Ogranicz ilość zdjęć
      if (maxQty && arr.length + files.length > maxQty) {
        alert(`Możesz dodać maksymalnie ${maxQty} zdjęć`);
        files = Array.from(files).slice(0, maxQty - arr.length) as unknown as FileList;
      }

      for (const f of Array.from(files)) {
        if (validate) {
          if (f.size > 5_000_000) {
            alert(`${f.name} jest za duży (max 5MB)`);
            continue;
          }
          if (!f.type.startsWith('image/')) {
            alert(`${f.name} nie jest obrazkiem`);
            continue;
          }
        }
        const src = URL.createObjectURL(f);
        arr.push({ rawFile: f, src, title: f.name });
      }
      setOrdered(arr);
    },
    [values, setOrdered, validate, maxQty],
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

  // cleanup object urls on unmount
  useEffect(() => {
    return () => {
      const arr = values as ImageItem[] | undefined;
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
  }, [values]);

  let error = fieldState?.error?.message;
  if (error && typeof error === 'string') {
    error = error.replace(/^@@react-admin@@("|')?|("|')?$/g, '');
  }

  if (!values || values.length === 0) {
    return (
      <div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
          >
            <ImageIcon /> Add images
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            onChange={(e) => onAddFiles(e.target.files)}
          />
        </div>
        {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
        >
          <ImageIcon /> Add images
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          onChange={(e) => onAddFiles(e.target.files)}
        />
      </div>

      {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}

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
    borderRadius: 8,
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
        <div style={{ color: '#fff' }}>No image</div>
      )}

      <IconButton
        onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); onRemove(); }}
        size="small"
        sx={{ position: 'absolute', right: 6, top: 6, bgcolor: 'rgba(255,255,255,0.8)' }}
        aria-label="remove"
      >
        <DeleteIcon color="error" />
      </IconButton>

      {index === 0 && (
        <div style={{ position: 'absolute', left: 6, bottom: 6, background: 'rgba(0, 26, 255, 1)', color: '#fff', padding: '2px 6px', borderRadius: 4, fontSize: 12 }}>
          MAIN
        </div>
      )}
    </div>
  );
};

export default SortableImageInput;