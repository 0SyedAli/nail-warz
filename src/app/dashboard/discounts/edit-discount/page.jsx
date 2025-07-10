import InputField from "@/components/Form/InputField";
import React from "react";

const EditDiscount = () => {
  return (
    <div className="page">
      <div className="edit_discount">
        <form>
          <div className="dash_head2">
            <h3>Coupon Code For Mobile App Users</h3>
          </div>
          <div className="row">
            <div className="col-12 col-md-10 col-lg-8 col-xxl-6">
              <div className="row">
                <div className="col-6">
                  <label htmlFor="email">Coupon Code</label>
                  <InputField
                    type="email"
                    placeholder="Neon Night Bar"
                    id="email"
                    classInput="classInput"
                  />
                </div>
                <div className="col-6">
                  <label htmlFor="email">Coupon Code</label>
                  <InputField
                    type="email"
                    placeholder="USA"
                    id="email"
                    classInput="classInput"
                  />
                </div>
                <div className="col-6">
                  <label htmlFor="email">Discount Type</label>
                  <div className="inputField">
                    <select
                      class="form-select input_select"
                      aria-label="Default select example"
                    >
                      <option selected>Percentage</option>
                      <option value="1">One</option>
                      <option value="2">Two</option>
                      <option value="3">Three</option>
                    </select>
                  </div>
                </div>
                <div className="col-6">
                  <label htmlFor="email">Discount Type</label>
                  <InputField
                    type="email"
                    placeholder="Fixed"
                    id="email"
                    classInput="classInput"
                  />
                </div>
                <div className="col-6">
                  <label htmlFor="email">Discount</label>
                  <InputField
                    type="email"
                    placeholder="40%"
                    id="email"
                    classInput="classInput"
                  />
                </div>
                <div className="col-6">
                  <label htmlFor="email">Amount</label>
                  <InputField
                    type="email"
                    placeholder="200"
                    id="email"
                    classInput="classInput"
                  />
                </div>
                <div className="col-6">
                  <label htmlFor="email">Minimum Order Limit</label>
                  <InputField
                    type="email"
                    placeholder="00000"
                    id="email"
                    classInput="classInput"
                  />
                </div>
                <div className="col-6">
                  <label htmlFor="email">Area of Service</label>
                  <InputField
                    type="email"
                    placeholder="United State"
                    id="email"
                    classInput="classInput"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="dash_head2 pt-3">
            <h3>Time Validation Start & End Date</h3>
          </div>
          <div className="row">
            <div className="col-4 col-xxl-3">
              <label htmlFor="password">From</label>
              <div className="date_picker py-2 d-flex align-items-center justify-content-between">
                <input type="number" placeholder="dd" />
                <input type="number" placeholder="mm" />
                <input type="number" placeholder="yy" />
              </div>
            </div>
            <div className="col-4 col-xxl-3">
              <label htmlFor="password">To</label>
              <div className="date_picker py-2 d-flex align-items-center justify-content-between">
                <input type="number" placeholder="dd" />
                <input type="number" placeholder="mm" />
                <input type="number" placeholder="yy" />
              </div>
            </div>
            <div className="col-4 col-xxl-3">
              <label htmlFor="password">Status</label>
              <div className="inputField">
                <select
                  class="form-select input_select"
                  aria-label="Default select example"
                >
                  <option selected>Active</option>
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                </select>
              </div>
            </div>
          </div>
          <div className="mt-5">
            <button class="themebtn4 green btn" type="button">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDiscount;
