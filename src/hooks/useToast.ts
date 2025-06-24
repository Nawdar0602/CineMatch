import { useState } from 'react';
import { toast } from 'react-toastify';

type ToastType = 'success' | 'error' | 'info' | 'warning';

export const useToast = () => {
  const showToast = (message: string, type: ToastType = 'info') => {
    toast[type](message, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  return { showToast };
};