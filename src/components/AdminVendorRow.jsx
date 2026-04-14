import Link from 'next/link'
import React from 'react'
import { LuUsers } from 'react-icons/lu'

const AdminVendorRow = ({
  name,
  location,
  amount,
  vendorId,
  image,
}) => {

  return (
    <Link href={`/admin/dashboard/vendors/${vendorId}`} className="d-flex justify-content-between align-items-center mb-3">
      <div className='d-flex align-items-center gap-3'>
        <div
          className="icon-box d-flex align-items-center justify-content-center overflow-hidden"
          style={{
            backgroundColor: "#f0f2f5",
            width: "40px",
            minWidth: "40px",
            height: "40px",
            borderRadius: "8px"
          }}
        >
          {image ? (
            <img 
              src={image} 
              alt={name} 
              className="w-100 h-100 object-fit-cover" 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = ""; // Clear src to trigger fallback or empty state
              }}
            />
          ) : (
            <LuUsers size={18} className="text-secondary" />
          )}
        </div>
        <div>
          <div className="fw-medium text-dark">{name}</div>
          <small className="text-muted d-block">{location}</small>
        </div>
      </div>
      <div className="fw-semibold text-success">{amount}</div>
    </Link>
  )
}

export default AdminVendorRow