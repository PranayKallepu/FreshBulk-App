export default function UpdateAddress({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black bg-opacity-40 z-40"
      />

      {/* Modal Content */}
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
        <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full pointer-events-auto relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl font-bold"
          >
            &times;
          </button>
          <p className="text-center text-base text-gray-800">{message}</p>
          <button
            onClick={onClose}
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            OK
          </button>
        </div>
      </div>
    </>
  );
}
