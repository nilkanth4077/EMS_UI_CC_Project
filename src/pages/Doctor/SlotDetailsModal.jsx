import React, { useState } from "react";

export default function SlotDetailsModal({ slot, onUpdate }) {
    const [isOpen, setIsOpen] = useState(false);

    const handleChange = (e) => {
        setFile(e.target.value);
    };

    const handleSubmit = () => {
        // Pass slot info back to parent
        onUpdate({ slotId: slot.id });
        setIsOpen(false);
    };

    return (
        <div>
            {/* Update Button */}
            <button
                className="bg-blue-600 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                onClick={() => setIsOpen(true)}
            >
                Update
            </button>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
                        <h2 className="text-xl font-bold mb-4 text-center">Slot Details</h2>

                        <table className="min-w-full border border-gray-300">
                            <tbody>
                                <tr>
                                    <th className="border border-gray-300 px-2 py-2 w-1/3 text-center">
                                        Slot ID
                                    </th>
                                    <td className="border border-gray-300 px-4 py-2 w-2/3">
                                        <input
                                            type="number"
                                            name="slotId"
                                            placeholder="Slot ID"
                                            value={slot.slotId}
                                            onChange={handleChange}
                                            required
                                            className="w-full rounded bg-white text-mtext focus:outline-none focus:ring-2 focus:ring-back"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th className="border border-gray-300 px-2 py-2 w-1/3 text-center">
                                        Start Time
                                    </th>
                                    <td className="border border-gray-300 px-4 py-2 w-2/3">
                                        <input
                                            type="text"
                                            name="newStartTime"
                                            placeholder="Start Time"
                                            value={slot.startTime}
                                            onChange={handleChange}
                                            required
                                            className="w-full rounded bg-white text-mtext focus:outline-none focus:ring-2 focus:ring-back"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th className="border border-gray-300 px-2 py-2 text-center">
                                        Type
                                    </th>
                                    <td className="border border-gray-300 px-4 py-2">
                                        <input
                                            type="text"
                                            name="slotType"
                                            placeholder="Slot Type"
                                            value={slot.slotType}
                                            onChange={handleChange}
                                            required
                                            className="w-full rounded bg-white text-mtext focus:outline-none focus:ring-2 focus:ring-back"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th className="border border-gray-300 px-2 py-2 text-center">
                                        Availability
                                    </th>
                                    <td className="border border-gray-300 px-4 py-2">
                                        <input
                                            type="text"
                                            name="available"
                                            placeholder="Mobile"
                                            value={slot.available}
                                            onChange={handleChange}
                                            required
                                            className="w-full rounded bg-white text-mtext focus:outline-none focus:ring-2 focus:ring-back"
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        {/* Buttons */}
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                                onClick={() => setIsOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                                onClick={handleSubmit}
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}