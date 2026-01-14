import { useRecordContext } from 'react-admin';
import {
  Dialog,
  DialogContent,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState, type ReactNode } from 'react';

type ImagePreviewDialogProps = {
  children: ReactNode;
}

type ImageRecord = {
  src: string;
  title?: string;
  rawFile?: File;
};

export const ImagePreview = ({ children }: ImagePreviewDialogProps) => {
  const record = useRecordContext<ImageRecord>();
  const [open, setOpen] = useState(false);

  if (!record?.src) return null;

  return (
    <>
      <span
        style={{ cursor: 'pointer', display: 'inline-block' }}
        onClick={() => setOpen(true)}
      >
        {children}
      </span>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <IconButton
          onClick={() => setOpen(false)}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>

        <DialogContent>
          <img
            src={record.src}
            alt={record.title || ''}
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: 8,
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
