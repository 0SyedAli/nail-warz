import Modal from "./layout";
import { FiRotateCcw } from "react-icons/fi";
import "./modal.css";
function Filter({ isOpen, onClose, btntitle }) {
  return (
    <>
      {/* Passing AddNewProduct as children to Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="filter_modal_body">
          <h3>Filter</h3>
          <form>
            <div className="sorting">
              <h4>Categories Sorting</h4>
              <div className="sorting-labels">
                <div className="form-control">
                  <input
                    type="radio"
                    defaultChecked
                    id="c_sort1"
                    name="cat_sort"
                  />
                  <label htmlFor="c_sort1">Mango</label>
                </div>
                <div className="form-control">
                  <input type="radio" id="c_sort2" name="cat_sort" />
                  <label htmlFor="c_sort2">Mango</label>
                </div>
                <div className="form-control">
                  <input type="radio" id="c_sort3" name="cat_sort" />
                  <label htmlFor="c_sort3">Mango</label>
                </div>
                <div className="form-control">
                  <input type="radio" id="c_sort4" name="cat_sort" />
                  <label htmlFor="c_sort4">Mango</label>
                </div>
              </div>
            </div>
            <div className="sorting">
              <h4>Stock Sorting</h4>
              <div className="sorting-labels d-flex justify-content-center">
                <div className="form-control">
                  <input
                    type="radio"
                    defaultChecked
                    id="st_sort1"
                    name="st_sort"
                  />
                  <label htmlFor="st_sort1">Stock</label>
                </div>
                <div className="form-control">
                  <input type="radio" id="st_sort2" name="st_sort" />
                  <label htmlFor="st_sort2">Out of Stock</label>
                </div>
              </div>
            </div>
            <div className="sort_btn">
              <button className="reset_btn" type="button">
                <FiRotateCcw />
                Reset all
              </button>
              <button className="themebtn4 green btn" href="/">
                Add Now
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}

export default Filter;
