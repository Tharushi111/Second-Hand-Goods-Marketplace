import React, { useState } from "react";

const dummyReplies = [
  {
    id: 1,
    supplierName: "Supplier A",
    subject: "Issue with delivery",
    message: "The delivery for order #123 was delayed by 2 days.",
    date: "2025-09-27",
    status: "Unread",
  },
  {
    id: 2,
    supplierName: "Supplier B",
    subject: "Price update request",
    message: "Requesting an update for price per unit for item #456.",
    date: "2025-09-25",
    status: "Read",
  },
  {
    id: 3,
    supplierName: "Supplier C",
    subject: "Offer clarification",
    message: "Please clarify the quantity offered for offer #789.",
    date: "2025-09-24",
    status: "Unread",
  },
];

const SupplierReplies = () => {
  const [replies, setReplies] = useState(dummyReplies);

  const markAsRead = (id) => {
    setReplies((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Read" } : r))
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">Supplier Replies</h2>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Supplier
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Subject
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Message
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Date
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {replies.map((reply) => (
              <tr key={reply.id} className={reply.status === "Unread" ? "bg-yellow-50" : ""}>
                <td className="px-6 py-4 whitespace-nowrap">{reply.supplierName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{reply.subject}</td>
                <td className="px-6 py-4 whitespace-normal max-w-xs">{reply.message}</td>
                <td className="px-6 py-4 whitespace-nowrap">{reply.date}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      reply.status === "Unread" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                    }`}
                  >
                    {reply.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                  {reply.status === "Unread" && (
                    <button
                      onClick={() => markAsRead(reply.id)}
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    >
                      Mark as Read
                    </button>
                  )}
                  <button className="bg-gray-300 text-gray-800 px-2 py-1 rounded hover:bg-gray-400">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {replies.length === 0 && (
          <p className="p-4 text-gray-500">No replies from suppliers yet.</p>
        )}
      </div>
    </div>
  );
};

export default SupplierReplies;
