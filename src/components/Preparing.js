const Preparing = () => {
  return (
    <div className="py-4 dash_list">
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
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">#4FE21</th>
              <td className="user_td">
                <img src="/images/user1.png"></img>Ronald Richards
              </td>
              <td>Burger</td>
              <td className="dollar_td">+$10</td>
              <td>20/09/2022</td>
              <td>4</td>
              <td className="status_td status_preparing">
                <span>Preparing</span>
              </td>
              <td>View more</td>
            </tr>
            <tr>
              <th scope="row">#4FE21</th>
              <td className="user_td">
                <img src="/images/user1.png"></img>Ronald Richards
              </td>
              <td>Burger</td>
              <td className="dollar_td danger">+$10</td>
              <td>20/09/2022</td>
              <td>4</td>
              <td className="status_td status_preparing">
                <span>Preparing</span>
              </td>
              <td>View more</td>
            </tr>
            <tr>
              <th scope="row">#4FE21</th>
              <td className="user_td">
                <img src="/images/user1.png"></img>Ronald Richards
              </td>
              <td>Burger</td>
              <td className="dollar_td">+$10</td>
              <td>20/09/2022</td>
              <td>4</td>
              <td className="status_td status_preparing">
                <span>Preparing</span>
              </td>
              <td>View more</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Preparing;
