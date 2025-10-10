import { useEffect, useState } from "react";

const DeliveryManagement = () => {
  const [orders, setOrders] = useState([]);

  // Fetch only paid orders
  const fetchPaidOrders = async () => {
    try {
      const res = await fetch("/api/delivery/admin/paid-orders"); // our new route
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPaidOrders();
  }, []);

  // Assign Uber or PickMe
  const assignDelivery = async (orderId, method) => {
    try {
      const res = await fetch(`/api/delivery/admin/assign/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method }),
      });
      const updatedOrder = await res.json();
      setOrders(prev => prev.map(o => (o._id === orderId ? updatedOrder : o)));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Delivery Management</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #ccc" }}>
            <th>Order Number</th>
            <th>Customer</th>
            <th>Items</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id} style={{ borderBottom: "1px solid #eee" }}>
              <td>{order.orderNumber}</td>
              <td>{order.customer.username}</td>
              <td>{order.items.map(i => i.name).join(", ")}</td>
              <td>₹{order.total}</td>
              <td>
                <button onClick={() => assignDelivery(order._id, "Uber")} style={{ marginRight: "10px" }}>Uber</button>
                <button onClick={() => assignDelivery(order._id, "PickMe")}>PickMe</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DeliveryManagement;
