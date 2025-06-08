// Utility to use sonner toast in your app
import { toast } from "sonner";

export function showInfoToast(title: string, description?: string) {
  toast.info(title, { description });
}

export function showErrorToast(title: string, description?: string) {
  toast.error(title, { description });
}

export function showSuccessToast(title: string, description?: string) {
  toast.success(title, { description });
}
