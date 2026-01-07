const AlertCard = ({ id, type = 'info', message, onClose, isModal = false }) => {
  const borderClass = type === 'success' ? 'border-green-100' : type === 'error' ? 'border-red-100' : 'border-blue-100';
  const dotClass = type === 'success' ? 'bg-green-400' : type === 'error' ? 'bg-red-400' : 'bg-blue-400';
  const titleColorClass = type === 'success' ? 'text-green-700' : type === 'error' ? 'text-red-700' : 'text-blue-700';

  const containerClass = isModal
    ? `max-w-2xl w-full bg-white border-2 ${borderClass} shadow-2xl rounded-xl overflow-hidden`
    : `max-w-md w-full bg-white border-2 ${borderClass} shadow-lg rounded-lg overflow-hidden`;

  const titleSize = isModal ? 'text-lg' : 'text-sm';
  const messageSize = isModal ? 'text-lg' : 'text-sm';
  const padding = isModal ? 'p-6' : 'p-4';
  const closeClass = isModal ? 'text-gray-400 hover:text-gray-600 text-2xl font-semibold' : 'text-gray-400 hover:text-gray-600';

  return (
    <div className={containerClass}>
      <div className={`flex items-start gap-3 ${padding}`}>
        <div className={`w-3 h-3 rounded-full mt-1 ${dotClass}`} />
        <div className="flex-1">
          <p className={`${titleSize} font-semibold ${titleColorClass}`}>{type.toUpperCase()}</p>
          <p className={`${messageSize} text-gray-700 mt-2`}>{message}</p>
        </div>
        <button onClick={onClose} className={closeClass} aria-label="Close alert">✕</button>
      </div>
    </div>
  );
};

export default AlertCard;
