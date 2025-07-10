"use client";
import NewOrderProductCard from "@/components/NewOrderProductCard";
import Link from "next/link";
const user1 = "/images/customer.png";
const Order = () => {
  const newOrder = [
    {
      title: "Orange Juice",
      id: "123456",
      quantity: "5",
      coupon: "V1231231",
           status: "new",
    },
    {
      title: "Orange Juice",
      id: "123456",
      quantity: "5",
      coupon: "V1231231",
           status: "new",
    },
    {
      title: "Orange Juice",
      id: "123456",
      quantity: "5",
      coupon: "V1231231",
           status: "new",
    },
    {
      title: "Orange Juice",
      id: "123456",
      quantity: "5",
      coupon: "V1231231",
           status: "new",
    },
  ];
  const variantOrder = [
    {
      title: "Orange Juice",
      id: "123456",
      quantity: "5",
      coupon: "V1231231",
      status: "new",
    },
    {
      title: "Orange Juice",
      id: "123456",
      quantity: "5",
      coupon: "V1231231",
      status: "new",
    },
    {
      title: "Orange Juice",
      id: "123456",
      quantity: "5",
      coupon: "V1231231",
      status: "new",
    },
    {
      title: "Orange Juice",
      id: "123456",
      quantity: "5",
      coupon: "V1231231",
      status: "new",
    },
  ];
  return (
    <div className="page">
      <div className="manage_order_head mt-3">
        <h3>New Orders</h3>
      </div>
      <div className="manage_order_body new_order_display">
        <div className="row">
          <div className="col-9">
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 gx-3 pb-3">
              {newOrder.map((order, index) => (
                <div key={index} className="col">
                  <NewOrderProductCard
                    title={order.title}
                    id={order.id}
                    quantity={order.quantity}
                    coupon={order.coupon}
                    status={order.status}
                  />
                </div>
              ))}
            </div>
            <div className="SubHeading">
              <h5>Variants</h5>
            </div>
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 gx-3 pb-3">
              {variantOrder.map((order, index) => (
                <div key={index} className="col">
                  <NewOrderProductCard
                    title={order.title}
                    id={order.id}
                    quantity={order.quantity}
                    coupon={order.coupon}
                    status={order.status}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="col-3">
            <div className="new_order_rightBar">
              <div className="order_map">
                <div
                  style={{
                    position: "relative",
                    height: "350px",
                    width: "100%",
                  }}
                >
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117944.0852058463!2d-94.4387242276673!3d39.03045329060634!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87c0f75eafe99997%3A0x558525e66aaa51a2!2sKansas%20City%2C%20MO%2C%20USA!5e0!3m2!1sen!2s!4v1726036305513!5m2!1sen!2s"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
              <div className="special_cont">
                <h4>Special Instructions</h4>
                <p>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum is simply dummy text of the
                  printing and typesetting industry.
                </p>
                <p>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum is simply dummy text of the
                  printing and typesetting industry.
                </p>
                <div className="grand_total mt-4 d-flex align-items-center justify-content-between pt-3 border-top">
                  <h5 className="m-0">Grand Total</h5>
                  <h4 className="m-0">
                    <span>$/456</span>
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-9">
            <div className="customer_section">
              <p>Customer Name</p>
              <div className="d-flex align-items-center justify-content-between">
                <div className="cs_user d-flex align-items-center gap-2">
                  <img src={user1} alt="" />
                  <h3 className="m-0">Ronald Richards</h3>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <Link href="/" className="themebtn4 red btn">
                    Accept
                  </Link>
                  <Link href="/" className="themebtn4 green btn">
                    Reject
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="col-3"></div>
        </div>
        {/* <div className="row mt-4">
          <div className="col-11">
            <div className="pagination justify-content-end">
              <button className="active">1</button>
              <button>2</button>
              <button>3</button>
              <button>4</button>
              <button>&gt;&gt;</button>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Order;
