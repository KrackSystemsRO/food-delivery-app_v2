import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  Button,
} from "@/components/ui";
import { memo } from "react";

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title: string;
  description?: string;
  submitLabel?: string;
  cancelLabel?: string;
  children: React.ReactNode;
  loading?: boolean;
}

export const FormModal = memo(function FormModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  description,
  submitLabel = "Submit",
  cancelLabel = "Cancel",
  children,
  loading = false,
}: FormModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className="space-y-4">{children}</div>

        <DialogFooter className="space-x-2">
          <Button variant="outline" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button onClick={onSubmit} disabled={loading}>
            {loading ? "Saving..." : submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});
