import InputField from "@/components/Form/InputField";
import React from "react";

const AddNewService = () => {
  return (
    <div className="page">
      <div className="edit_discount dashboard_panel_inner">
        <form>
          <div className="row">
            <div className="col-12 col-md-10 col-lg-8 col-xxl-6">
              <div className="row">
                <div className="col-12">
                  <label htmlFor="email">Service Name</label>
                  <InputField
                    type="email"
                    placeholder="Neon Night Bar"
                    id="email"
                    classInput="classInput"
                  />
                </div>
                <div className="col-12">
                  <div className="inputField">
                    <label htmlFor="email">Description</label>
                    <textarea
                      placeholder="Lorem Ipsum..."
                      id="desc"
                      rows="4"
                    ></textarea>
                  </div>
                </div>
                <div className="col-12">
                  <label htmlFor="email">Service Pricing</label>
                  <InputField
                    type="email"
                    placeholder="USA"
                    id="email"
                    classInput="classInput"
                  />
                </div>
                <div className="col-12">
                  <label htmlFor="email">Service Duration</label>
                  <InputField
                    type="email"
                    placeholder="Fixed"
                    id="email"
                    classInput="classInput"
                  />
                </div>
                <div className="col-12">
                  <label htmlFor="email">Assign Technicians</label>
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
                <div className="col-12">
                  <label htmlFor="email">Assign Technicians</label>
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

export default AddNewService;
