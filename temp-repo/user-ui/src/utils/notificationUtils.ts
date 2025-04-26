import { toast } from 'react-toastify';

export const notificationUtils = {
  success: (message: string) => {
    toast.success(message, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  },

  error: (message: string) => {
    toast.error(message, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  },

  warning: (message: string) => {
    toast.warning(message, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  },

  info: (message: string) => {
    toast.info(message, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  },

  loading: (message: string) => {
    return toast.loading(message, {
      position: 'top-right',
      autoClose: false,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  },

  update: (toastId: string | number, message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    toast.update(toastId, {
      render: message,
      type,
      isLoading: false,
      autoClose: 3000,
    });
  },

  dismiss: (toastId: string | number) => {
    toast.dismiss(toastId);
  },
}; 