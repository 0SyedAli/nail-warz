import React from 'react'

const AdminDashboardCard = ({
  title,
  value,
  change,
  icon_class,
  icon: Icon,
}) => {
  return (

    <div className="col">
      <div className="card dashboard-card h-100">
        <div className="card-body">
          <div className=' d-flex justify-content-between mb-2'>
            <div>
              <p className="text-muted small mb-1">{title}</p>
              <h5 className="fw-bold mb-1">{value}</h5>
            </div>
            <div className={`icon-box ${icon_class}`}>
              <Icon />
            </div>
          </div>
          {change && <span className="text-success d-inline-block" style={{ fontSize: "12px", lineHeight: "15px" }}>{change}</span>}
        </div>
      </div>
    </div>

  )
}

export default AdminDashboardCard