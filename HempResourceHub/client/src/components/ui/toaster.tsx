import { useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider data-oid="wt7p-5b">
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props} data-oid="3x70z:j">
            <div className="grid gap-1" data-oid="scpiksp">
              {title && <ToastTitle data-oid=".rkocab">{title}</ToastTitle>}
              {description && (
                <ToastDescription data-oid="v5pc_dz">
                  {description}
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose data-oid="pj68m22" />
          </Toast>
        );
      })}
      <ToastViewport data-oid="vs9w4.r" />
    </ToastProvider>
  );
}
