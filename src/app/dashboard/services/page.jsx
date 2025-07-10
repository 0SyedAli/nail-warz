"use client"
const img4 = "/images/avatar.png";
const DashboardPanel = ({ activeTab }) => {
  // Sample order data
  const orders = [
    {
      _id: "#4FE21",
      servicesName: "Nail Art",
      serviceImage: img4,
      price: "$40:00",
      estimatedTime: "30 min to 50 min",
      assignedTechnicians: "Alex Clarke",
    },
    {
      _id: "#4FE21",
      servicesName: "Nail Art",
      serviceImage: img4,
      price: "$40:00",
      estimatedTime: "30 min to 50 min",
      assignedTechnicians: "Alex Clarke",
    },
    {
      _id: "#4FE21",
      servicesName: "Nail Art",
      serviceImage: img4,
      price: "$40:00",
      estimatedTime: "30 min to 50 min",
      assignedTechnicians: "Alex Clarke",
    },
    {
      _id: "#4FE21",
      servicesName: "Nail Art",
      serviceImage: img4,
      price: "$40:00",
      estimatedTime: "30 min to 50 min",
      assignedTechnicians: "Alex Clarke",
    },
    {
      _id: "#4FE21",
      servicesName: "Nail Art",
      serviceImage: img4,
      price: "$40:00",
      estimatedTime: "30 min to 50 min",
      assignedTechnicians: "Alex Clarke",
    },
    {
      _id: "#4FE21",
      servicesName: "Nail Art",
      serviceImage: img4,
      price: "$40:00",
      estimatedTime: "30 min to 50 min",
      assignedTechnicians: "Alex Clarke",
    },

  ];

  // Filter orders based on the active tab
  const filteredOrders = orders.filter((order) =>
    activeTab
      ? order.status.toLowerCase().includes(activeTab.toLowerCase())
      : true
  );

  return (
    <div className="page">
      <div className="dashboard_panel_inner">
        <div className="py-4 dash_list">
          <div className="table-responsive">
            <table className="table caption-top">
              <thead>
                <tr>
                  <th scope="col"># ID</th>
                  <th scope="col">Services Name</th>
                  <th scope="col">Price</th>
                  <th scope="col">Estimated Time</th>
                  <th scope="col">Assigned Technicians</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, index) => (
                  <tr key={index}>
                    <td scope="row">{order._id}</td>
                    <td className="user_td">
                      <img src={order.serviceImage} alt="User Avatar" />
                      {order.servicesName}
                    </td>
                    <td>{order.price}</td>
                    {/* <td
                      className={`dollar_td ${order.price &&
                        !isNaN(
                          parseFloat(order.price.replace(/[^\d.-]/g, ""))
                        ) &&
                        parseFloat(order.price.replace(/[^\d.-]/g, "")) < 0
                        ? "loss"
                        : ""
                        }`}
                    >
                      {order.price}
                    </td> */}
                    <td>{order.estimatedTime}</td>
                    <td>{order.assignedTechnicians}</td>
                    <td>
                      <div className="d-flex align-items-center gap-2 justify-content-end">
                        <button className="btn orderBtn green">Edit</button>
                        <button className="btn orderBtn red">Delete</button>
                      </div>
                    </td>
                    {/* <td className={`status_td ${order.status.toLowerCase()}`}>
                      <span>{order.status}</span>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="d-flex justify-content-end mt-4">
              <button className="btn dash_btn2">Add New Service</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPanel;
