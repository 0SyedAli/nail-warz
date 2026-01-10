import React from 'react'

const NotificationHistory = ({ history }) => {
    return (
        <div className="card p-4 h-100">
            <h6 className="fw-semibold mb-3">Notification History</h6>

            {history.length === 0 && (
                <p className="text-muted mb-0">No notifications sent yet.</p>
            )}

            {history.map((n, i) => (
                <div key={i} className="history-item mb-3">
                    <div className="d-flex justify-content-between">
                        <strong>{n.title}</strong>
                        <span className="badge bg-dark">Sent</span>
                    </div>

                    <p className="mb-1 text-muted">{n.body}</p>

                    <div className="small text-muted">
                        📢 {n.delivered} &nbsp;•&nbsp;
                        {new Date(n.sentAt).toLocaleString()}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default NotificationHistory