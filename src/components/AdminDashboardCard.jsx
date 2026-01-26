import React from 'react'

const AdminDashboardCard = ({
  title,
  value,
  change,
  icon_class,
  icon: Icon,
}) => {
  return (

    <div className="col-md-6 col-xl-3">
      <div className="card dashboard-card h-100">
        <div className="card-body d-flex justify-content-between">
          <div>
            <p className="text-muted small mb-1">{title}</p>
            <h5 className="fw-bold mb-1">{value}</h5>
            {change && <span className="text-success small">{change}</span>}
          </div>
          <div className={`icon-box ${icon_class}`}>
            <Icon />
          </div>
        </div>
      </div>
    </div>

  )
}

export default AdminDashboardCard