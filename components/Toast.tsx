import { FC, useEffect, useState, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { v4 as uuidv4 } from 'uuid';

interface ToastProps {
  id: string;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

const Toast: FC<ToastProps> = ({ id, message, duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  return (
    <div
      style={{
        backgroundColor: 'rgba(245, 241, 232, 0.95)',
        color: '#1a1614',
        padding: '14px 24px',
        borderRadius: '1rem',
        marginBottom: '10px',
        textAlign: 'center',
        border: '1px solid rgba(212, 207, 200, 0.6)',
        boxShadow: '0 10px 25px rgba(212, 165, 116, 0.2)',
        fontFamily: 'Lora, serif',
        fontWeight: '600',
        fontSize: '14px',
      }}
    >
      {message}
    </div>
  );
};

interface ToastData {
  id: string;
  message: string;
  duration?: number;
}

let toasts: ToastData[] = [];
let listeners: ((toasts: ToastData[]) => void)[] = [];

const ToastContainer: FC = () => {
  const [toastList, setToastList] = useState(toasts);

  const handleClose = useCallback((id: string) => {
    toasts = toasts.filter(t => t.id !== id);
    listeners.forEach(listener => listener(toasts));
  }, []);

  useEffect(() => {
    const newListener = (newToasts: ToastData[]) => {
      setToastList([...newToasts]);
    };
    listeners.push(newListener);

    return () => {
      listeners = listeners.filter(l => l !== newListener);
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
      }}
    >
      {toastList.map(toast => (
        <Toast key={toast.id} {...toast} onClose={handleClose} />
      ))}
    </div>
  );
};

export const openToast = (message: string, duration?: number) => {
  const id = uuidv4();
  toasts = [...toasts, { id, message, duration }];
  listeners.forEach(listener => listener(toasts));
};

let toastContainerRoot: any = null;
export const installToast = () => {
  if (toastContainerRoot) {
    return;
  }
  const container = document.createElement('div');
  document.body.appendChild(container);
  toastContainerRoot = createRoot(container);
  toastContainerRoot.render(<ToastContainer />);
}