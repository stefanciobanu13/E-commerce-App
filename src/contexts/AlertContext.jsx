import { createContext, useContext, useState, useCallback } from 'react';
import AlertCard from '../components/AlertCard';

const AlertContext = createContext();
export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  const removeAlert = useCallback((id) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const showAlert = useCallback((message, type = 'info', duration = 4000) => {
    // Keep error alerts until manually closed by default
    if (type === 'error' && duration === 4000) duration = 0;
    const id = Date.now() + Math.random();
    const alert = { id, message, type };
    setAlerts((prev) => [alert, ...prev]);
    if (duration > 0) {
      setTimeout(() => removeAlert(id), duration);
    }
    return id;
  }, [removeAlert]);

  const errorAlerts = alerts.filter((a) => a.type === 'error');
  const otherAlerts = alerts.filter((a) => a.type !== 'error');

  return (
    <AlertContext.Provider value={{ alerts, showAlert, removeAlert }}>
      {children}

      {/* Non-error alerts (top-right) */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-4 items-end pointer-events-none">
        <div className="pointer-events-auto flex flex-col gap-4">
          {otherAlerts.map((a) => (
            <AlertCard key={a.id} id={a.id} type={a.type} message={a.message} onClose={() => removeAlert(a.id)} />
          ))}
        </div>
      </div>

      {/* Error modal(s) - centered with backdrop */}
      {errorAlerts.length > 0 && (
        <div className="fixed inset-0" style={{ zIndex: 9999 }}>
          <div className="absolute inset-0 bg-gray-800 opacity-60" />
          <div className="relative z-10 flex items-center justify-center min-h-screen pointer-events-none">
            <div className="pointer-events-auto flex flex-col gap-4 items-center">
              {errorAlerts.map((a) => (
                <AlertCard key={a.id} id={a.id} type={a.type} message={a.message} onClose={() => removeAlert(a.id)} isModal />
              ))}
            </div>
          </div>
        </div>
      )}
    </AlertContext.Provider>
  );
};
