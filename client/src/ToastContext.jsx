import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null); // { type: 'success' | 'error', message }

  const showToast = useCallback((type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 2500); // auto-hide after 2.5s
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            backgroundColor: toast.type === 'success' ? '#16a34a' : '#dc2626',
            color: 'white',
            padding: '10px 16px',
            borderRadius: '6px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
            zIndex: 1000,
          }}
        >
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
