const EventRegisterModal = ({ onClose, onConfirm, event }) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-lg">

        <h2 className="text-lg font-semibold mb-3">
          Confirm Registration
        </h2>

        <p className="text-sm text-slate-600">
          Do you want to register for <b>{event?.title}</b>?
        </p>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white"
          >
            Confirm
          </button>
        </div>

      </div>
    </div>
  );
};

export default EventRegisterModal;