"use client"
import { useEffect, useState } from "react";

const image1 = "/images/user1.png";
const image2 = "/images/user1.png";
const image3 = "/images/user1.png";
const image4 = "/images/user1.png";
const image5 = "/images/user1.png";
const image6 = "/images/user1.png";
const image7 = "/images/user1.png";
const image8 = "/images/user1.png";
const image9 = "/images/user1.png";
const image10 = "/images/user1.png";
const image11 = "/images/user1.png";
const image12 = "/images/user1.png";
const image13 = "/images/user1.png";

const NewOrder = ({ activeTab }) => {

  const [ tab, setTab ] = useState();
  useEffect(() => {
    setTab();
    setTimeout(() => {
      setTab(activeTab);
    }, 1);
  }, [activeTab])
  const orders = [
    {
      id: "#4FE21",
      image: image1,
      name: "Ronald Richards",
      category: "Burger",
      amount: "+$10",
      date: "20/09/2022",
      quantity: 4,
      status: activeTab,
    },
    {
      id: "#4FE22",
      image: image2,
      name: "John Doe",
      category: "Pizza",
      amount: "-$12",
      date: "21/09/2022",
      quantity: 2,
      status: activeTab,
    },
    {
      id: "#4FE23",
      image: image3,
      name: "Jane Smith",
      category: "Salad",
      amount: "+$8",
      date: "19/09/2022",
      quantity: 3,
      status: activeTab,
    },
    {
      id: "#4FE24",
      image: image4,
      name: "Emma Brown",
      category: "Pasta",
      amount: "+$15",
      date: "22/09/2022",
      quantity: 1,
      status: activeTab,
    },
    {
      id: "#4FE25",
      image: image5,
      name: "Liam Wilson",
      category: "Sushi",
      amount: "+$20",
      date: "23/09/2022",
      quantity: 5,
      status: activeTab,
    },
    {
      id: "#4FE26",
      image: image6,
      name: "Sophia Garcia",
      category: "Steak",
      amount: "-$25",
      date: "24/09/2022",
      quantity: 1,
      status: activeTab,
    },
    {
      id: "#4FE27",
      image: image7,
      name: "Oliver Martinez",
      category: "Sandwich",
      amount: "+$7",
      date: "25/09/2022",
      quantity: 2,
      status: activeTab,
    },
    {
      id: "#4FE28",
      image: image8,
      name: "Isabella Davis",
      category: "Soup",
      amount: "+$5",
      date: "26/09/2022",
      quantity: 4,
      status: activeTab,
    },
    {
      id: "#4FE29",
      image: image9,
      name: "Mason Miller",
      category: "Fries",
      amount: "+$4",
      date: "27/09/2022",
      quantity: 3,
      status: activeTab,
    },
    {
      id: "#4FE30",
      image: image10,
      name: "Ethan Wilson",
      category: "Tacos",
      amount: "+$10",
      date: "28/09/2022",
      quantity: 6,
      status: activeTab,
    },
    {
      id: "#4FE31",
      image: image11,
      name: "Mia Anderson",
      category: "Wings",
      amount: "-$12",
      date: "29/09/2022",
      quantity: 2,
      status: activeTab,
    },
    {
      id: "#4FE32",
      image: image12,
      name: "Lucas Taylor",
      category: "Pasta",
      amount: "+$15",
      date: "30/09/2022",
      quantity: 3,
      status: activeTab,
    },
  ];

  if (!tab) {
    return <></>;
  }

  return (
    <div className="py-4 dash_list page">
      <div className="table-responsive">
        <table className="table caption-top">
          <thead>
            <tr className="borderless">
              <th scope="col">ID</th>
              <th scope="col">Customer Name</th>
              <th scope="col">Category</th>
              <th scope="col">Amount</th>
              <th scope="col">Date</th>
              <th scope="col">Quantity</th>
              <th scope="col">Status</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders
              .filter((val) => val.status.toLowerCase().includes(activeTab))
              .map((order, index) => (
                <tr key={index}>
                  <th scope="row">{order.id}</th>
                  <td className="user_td">
                    <img src={order.image} alt="User Avatar"></img>
                    {order.name}
                  </td>
                  <td>{order.category}</td>
                  {/* <td
                    className={`dollar_td ${
                      parseFloat(order.amount.replace(/[^\d.-]/g, "")) < 0
                        ? "loss"
                        : ""
                    }`}
                  >
                    {order.amount}
                  </td> */}
                  <td
                    className={`dollar_td ${
                      order.amount &&
                      !isNaN(
                        parseFloat(order.amount.replace(/[^\d.-]/g, ""))
                      ) &&
                      parseFloat(order.amount.replace(/[^\d.-]/g, "")) < 0
                        ? "loss"
                        : ""
                    }`}
                  >
                    {order.amount}
                  </td>
                  <td>{order.date}</td>
                  <td>{order.quantity}</td>
                  <td className={`status_td ${order.status.toLowerCase()}`}>
                    <span>{order.status}</span>
                  </td>
                  <td>View more</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="pagination justify-content-end">
        <button className="active">1</button>
        <button>2</button>
        <button>3</button>
        <button>4</button>
        <button>&gt;&gt;</button>
      </div>
    </div>
  );
};

export default NewOrder;
