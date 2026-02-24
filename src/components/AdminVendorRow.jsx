import React from 'react'
import { LuUsers } from 'react-icons/lu'

const AdminVendorRow = ({
  name,
  location,
  amount,
}) => {

  return (
    <div className="d-flex justify-content-between align-items-center mb-3">
      <div className='d-flex align-items-center gap-3'>
        <div
          className="icon-box d-flex align-items-center justify-content-center"
          style={{
            backgroundColor: status.bg,
            width: "40px",
            height: "40px",
            borderRadius: "8px"
          }}
        >
          <LuUsers size={18} />
        </div>
        <div>
          <div className="fw-medium">{name}</div>
          <small className="text-muted">{location}</small>
        </div>
      </div>
      <div className="fw-semibold text-success">{amount}</div>
    </div>

  )
}

export default AdminVendorRow