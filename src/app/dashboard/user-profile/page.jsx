"use client";
import UserProductCard from "@/components/UserProductCard";
import { useState } from "react";
import { FaPlus, FaStar } from "react-icons/fa";
const user_cover = "/images/userCover.jpg";
const customer = "/images/user_demo.png";
const edit_icon = "/images/edit_icon.png";
const userRating = "/images/rating_user.png";

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("product");
  return (
    <div className="page">
      <div className="user_banner mt-5">
        <div className="up_upload">
          <div className="up_cover">
            <img src={user_cover} alt="" />
            <div className="up_upload_btn">
              <FaPlus />
            </div>
          </div>
          <div className="user_profile">
            <img src={customer} alt="" />
            <div className="up_upload_btn">
              <FaPlus />
            </div>
          </div>
        </div>
      </div>
      <div className="user_profile_body">
        <div className="row">
          <div className="col-9">
            <h4>
              <FaStar />
              4.7 | Rating
            </h4>
            <div className="up_heading d-flex align-items-center gap-3">
              <h3>Neon Night Bar </h3>
              <button className="border-0 bg-transparent">
                <img src={edit_icon} alt="" />
              </button>
            </div>
            <h4 className="mb-0">927 Hornblend Street, San Diego, 92109</h4>

            <div className="manage_order_head">
              <div className="tabs mo_tabs">
                <button
                  className={activeTab === "product" ? "active" : ""}
                  onClick={() => setActiveTab("product")}
                >
                  Products
                </button>
                <button
                  className={activeTab === "reviews" ? "active" : ""}
                  onClick={() => setActiveTab("reviews")}
                >
                  Reviews
                </button>
                <button
                  className={activeTab === "details" ? "active" : ""}
                  onClick={() => setActiveTab("details")}
                >
                  Details
                </button>
              </div>
            </div>
            <div className="tab-content">
              {activeTab === "product" && (
                <div className="page product_tab">
                  <div className="row">
                    <div className="col-3">
                      <UserProductCard />
                    </div>
                    <div className="col-3">
                      <UserProductCard />
                    </div>
                    <div className="col-3">
                      <UserProductCard />
                    </div>
                    <div className="col-3">
                      <UserProductCard />
                    </div>
                  </div>
                  <div className="row mt-4">
                    <div className="col-12">
                      <div className="pagination justify-content-end">
                        <button className="active">1</button>
                        <button>2</button>
                        <button>3</button>
                        <button>4</button>
                        <button>&gt;&gt;</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === "reviews" && (
                <div className="page reviews_tab">
                  <div className="rating_head">
                    <div className="rh_rating">
                      <h2>4.7</h2>
                    </div>
                    <div>
                      <div className="rh_stars">
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaStar />
                      </div>
                      <p>Based on 168 reviews</p>
                    </div>
                  </div>
                  <div className="user_rating_item">
                    <div className="user_rating_item_inner">
                      <div className="d-flex gap-3">
                        <img src={userRating} alt="" />
                        <div className="user_rating_info">
                          <h3 className="pb-2">Allen Warn</h3>
                          <div className="rh_stars">
                            <FaStar />
                            <FaStar />
                            <FaStar />
                            <FaStar />
                            <FaStar />
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="d-flex align-items-center justify-content-between pb-3">
                          <h3>Amazing Taste</h3>
                          <h4>Order ID - #12345</h4>
                        </div>
                        <p>
                          Lorem Ipsum is simply dummy text of the printing and
                          typesetting industry. Lorem Ipsum is simply dummy text
                          of the printing and typesetting industry.Lorem Ipsum
                          is simply dummy text of the printing and typesetting
                          industry. Lorem Ipsum is simply dummy text of the
                          printing and typesetting industry.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="row mt-4">
                    <div className="col-12">
                      <div className="pagination justify-content-end">
                        <button className="active">1</button>
                        <button>2</button>
                        <button>3</button>
                        <button>4</button>
                        <button>&gt;&gt;</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === "details" && (
                <div className="page details_tab">
                  <form>
                    <label htmlFor="" className="mt-2">
                      Including These Days
                    </label>
                    <div className="d-flex my-3 " style={{ gap: 10 }}>
                      <div className="calender_item">
                        <input
                          type="radio"
                          defaultChecked
                          id="radio101"
                          name="day1"
                        />
                        <label htmlFor="radio101">Mon</label>
                        <div className="calender_spot"></div>
                      </div>
                      <div className="calender_item">
                        <input type="radio" id="radio102" name="day1" />
                        <label htmlFor="radio102">Tue</label>
                        <div className="calender_spot"></div>
                      </div>
                      <div className="calender_item">
                        <input type="radio" id="radio103" name="day1" />
                        <label htmlFor="radio103">Wed</label>
                        <div className="calender_spot"></div>
                      </div>
                      <div className="calender_item">
                        <input type="radio" id="radio104" name="day1" />
                        <label htmlFor="radio104">Thu</label>
                        <div className="calender_spot"></div>
                      </div>
                      <div className="calender_item">
                        <input type="radio" id="radio105" name="day1" />
                        <label htmlFor="radio105">Fri</label>
                        <div className="calender_spot"></div>
                      </div>
                      <div className="calender_item">
                        <input type="radio" id="radio106" name="day1" />
                        <label htmlFor="radio106">Sat</label>
                        <div className="calender_spot"></div>
                      </div>
                      <div className="calender_item">
                        <input type="radio" id="radio107" name="day1" />
                        <label htmlFor="radio107">Sun</label>
                        <div className="calender_spot"></div>
                      </div>
                    </div>
                    <label htmlFor="" className="mt-2">
                      Time Range
                    </label>
                    <div className="cs-form time_picker d-flex gap-3 align-items-center py-3">
                      <input
                        type="time"
                        className="form-control"
                        value="10:05 AM"
                      />
                      <span>To</span>
                      <input
                        type="time"
                        className="form-control"
                        value="12:05 PM"
                      />
                    </div>
                    <div className="mt-4">
                      <button class="themebtn4 green btn" type="button">
                        Update
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
          <div className="col-3">
            <div className="about_sec">
              <h4>About</h4>
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum is simply dummy text of the printing and
                typesetting industry.
              </p>
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum is simply dummy text of the printing and
                typesetting industry.
              </p>
            </div>
            <div className="up_timing">
              <div className="d-flex align-items-center justify-content-between">
                <h4>Mon</h4>
                <h4>
                   <span>10 : 00 AM - 05 : 00 PM</span>
                </h4>
              </div>
              <div className="d-flex align-items-center justify-content-between">
                <h4>Tue</h4>
                <h4>
                  <span>10 : 00 AM - 05 : 00 PM</span>
                </h4>
              </div>
              <div className="d-flex align-items-center justify-content-between">
                <h4>Wed</h4>
                <h4>
                  <span>10 : 00 AM - 05 : 00 PM</span>
                </h4>
              </div>
              <div className="d-flex align-items-center justify-content-between">
                <h4>Thu</h4>
                <h4>
                  <span>10 : 00 AM - 05 : 00 PM</span>
                </h4>
              </div>
              <div className="d-flex align-items-center justify-content-between">
                <h4>Fri</h4>
                <h4>
                  <span>10 : 00 AM - 05 : 00 PM</span>
                </h4>
              </div>
              <div className="d-flex align-items-center justify-content-between">
                <h4>Sat</h4>
                <h4>
                   <span>10 : 00 AM - 05 : 00 PM</span>
                </h4>
              </div>
              <div className="d-flex align-items-center justify-content-between">
                <h4>Sun</h4>
                <h4>
                  <span>Closed</span>
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
