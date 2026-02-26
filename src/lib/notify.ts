import toast from "react-hot-toast";

type NotifyOptions = {
  duration?: number;
  onClose?: () => void;
};

export const Notify = {
  success(message: string, options?: NotifyOptions) {
    const duration = options?.duration ?? 3000;

    toast.success(message, { duration });

    if (options?.onClose) {
      setTimeout(() => {
        options.onClose?.();
      }, duration);
    }
  },

  error(message: string, options?: NotifyOptions) {
    const duration = options?.duration ?? 4000;

    toast.error(message, { duration });

    if (options?.onClose) {
      setTimeout(() => {
        options.onClose?.();
      }, duration);
    }
  },

  info(message: string, options?: NotifyOptions) {
    const duration = options?.duration ?? 3000;

    toast(message, { 
      duration, 
      style: {background: "var(--color-primary)", color: "var(--color-bg-light)"}, 
      iconTheme: {primary: "var(--color-bg-light)",secondary: "var(--color-primary)"}
    });

    if (options?.onClose) {
      setTimeout(() => {
        options.onClose?.();
      }, duration);
    }
  },
};
