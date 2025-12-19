import React from 'react'

const AdminVendorRow = ({
  name,
  location,
  amount,
}) => {

  return (
    <div className="d-flex justify-content-between align-items-center mb-3">
      <div>
        <div className="fw-medium">{name}</div>
        <small className="text-muted">{location}</small>
      </div>
      <div className="fw-semibold text-success">{amount}</div>
    </div>

  )
}

export default AdminVendorRow