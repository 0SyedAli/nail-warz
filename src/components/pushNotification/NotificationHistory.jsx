import React, { useState } from 'react';
import { FiRefreshCw, FiCheckCircle, FiClock, FiAlertCircle, FiUser, FiHash, FiTarget, FiInfo, FiActivity, FiX } from 'react-icons/fi';

const NotificationHistory = ({ history, loading, onRefresh }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const getStatusBadge = (status) => {
        switch (status?.toLowerCase()) {
            case 'sent':
                return <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-2 py-1">Sent</span>;
            case 'scheduled':
                return <span className="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25 px-2 py-1">Scheduled</span>;
            case 'failed':
                return <span className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 px-2 py-1">Failed</span>;
            default:
                return <span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25 px-2 py-1">{status || 'Unknown'}</span>;
        }
    };

    const getRecipientLabel = (type) => {
        switch (type) {
            case 'active': return 'Active Users';
            case 'inactive': return 'Inactive Users';
            default: return 'All Users';
        }
    };

    const openDetails = (item) => {
        setSelectedItem(item);
        setShowModal(true);
    };

    return (
        <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
            <div className="card-header bg-white border-0 p-4 d-flex justify-content-between align-items-center" style={{ borderRadius: '16px 16px 0 0' }}>
                <div>
                    <h5 className="fw-bold mb-0">Broadcast History</h5>
                    <p className="text-muted small mb-0">Track your notification performance</p>
                </div>
                <button
                    className={`btn btn-light btn-sm rounded-circle p-2 ${loading ? 'rotate-anim' : ''}`}
                    onClick={onRefresh}
                    disabled={loading}
                    title="Refresh History"
                >
                    <FiRefreshCw size={18} />
                </button>
            </div>

            <div className="card-body p-0">
                {loading && history.length === 0 ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status"></div>
                        <p className="mt-2 text-muted">Retrieving history...</p>
                    </div>
                ) : history.length === 0 ? (
                    <div className="text-center py-5 px-4">
                        <div className="bg-light d-inline-block p-4 rounded-circle mb-3">
                            <FiClock size={40} className="text-muted" />
                        </div>
                        <h6 className="fw-semibold">No Broadcasts Yet</h6>
                        <p className="text-muted small">Notifications you send will appear here for tracking.</p>
                    </div>
                ) : (
                    <div className="history-list overflow-auto" style={{ maxHeight: 'calc(100vh - 400px)', minHeight: '400px' }}>
                        {history.map((item, index) => (
                            <div
                                key={item._id || index}
                                className={`history-item p-4 border-bottom border-light ${index === 0 ? 'bg-light bg-opacity-25' : ''} hover-bg-light transition-all`}
                                style={{ cursor: 'pointer' }}
                                onClick={() => openDetails(item)}
                            >
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                    <h6 className="fw-bold text-dark mb-0">{item.title}</h6>
                                    {getStatusBadge(item.status)}
                                </div>
                                <p className="text-muted small mb-3 text-truncate" style={{ maxWidth: '90%' }}>
                                    {item.body}
                                </p>

                                <div className="row g-2 mt-auto">
                                    <div className="col-auto">
                                        <div className="d-flex align-items-center gap-1 text-muted small bg-light px-2 py-1 rounded">
                                            <FiUser size={12} />
                                            {getRecipientLabel(item.recipientType)}
                                        </div>
                                    </div>
                                    <div className="col-auto">
                                        <div className="d-flex align-items-center gap-1 text-muted small bg-light px-2 py-1 rounded">
                                            {item.sentCount || 0} Sent
                                        </div>
                                    </div>
                                    <div className="col-auto ms-auto">
                                        <div className="text-muted small d-flex align-items-center gap-1">
                                            <FiClock size={12} />
                                            {item.scheduledAt
                                                ? new Date(item.scheduledAt).toLocaleString()
                                                : new Date(item.createdAt).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* DETAIL MODAL */}
            {showModal && selectedItem && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 1050 }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                            <div className="modal-header border-0 p-4 pb-0 d-flex justify-content-between align-items-center">
                                <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                                    <span className="bg-primary bg-opacity-10 p-2 rounded-3 text-primary"><FiInfo size={20} /></span>
                                    Broadcast Details
                                </h5>
                                <button
                                    type="button"
                                    className="btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center"
                                    onClick={() => setShowModal(false)}
                                    style={{ width: '36px', height: '36px' }}
                                >
                                    <FiX size={20} />
                                </button>
                            </div>
                            <div className="modal-body p-4">
                                <div className="mb-4">
                                    <h4 className="fw-bold text-dark">{selectedItem.title}</h4>
                                    <div className="p-3 bg-light rounded-3 mt-2 border border-secondary border-opacity-10" style={{ fontSize: '15px', lineHeight: '1.6' }}>
                                        {selectedItem.body}
                                    </div>
                                </div>

                                <div className="row g-3">
                                    <div className="col-6">
                                        <label className="text-muted small fw-bold text-uppercase mb-1 d-block">Status</label>
                                        <div>{getStatusBadge(selectedItem.status)}</div>
                                    </div>
                                    <div className="col-6">
                                        <label className="text-muted small fw-bold text-uppercase mb-1 d-block">Target Audience</label>
                                        <div className="d-flex align-items-center gap-2 fw-semibold">
                                            <FiUser className="text-primary" /> {getRecipientLabel(selectedItem.recipientType)}
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <label className="text-muted small fw-bold text-uppercase mb-1 d-block">Execution Data</label>
                                        <div className="d-flex flex-column gap-1">
                                            <div className="small"><span className="text-success fw-bold">{selectedItem.sentCount || 0}</span> Successfully Sent</div>
                                            <div className="small"><span className="text-danger fw-bold">{selectedItem.failedCount || 0}</span> Failed Attempts</div>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <label className="text-muted small fw-bold text-uppercase mb-1 d-block">Broadcast ID</label>
                                        <code className="small text-muted">{selectedItem._id || 'N/A'}</code>
                                    </div>
                                    
                                    <div className="col-12 border-top pt-3 mt-3">
                                        <div className="d-flex flex-column gap-2 text-muted small">
                                            <div className="d-flex align-items-center gap-2">
                                                <FiClock size={14} /> 
                                                <strong>Scheduled Deployment:</strong> {selectedItem.scheduledAt ? new Date(selectedItem.scheduledAt).toLocaleString() : 'Executed Immediately'}
                                            </div>
                                            <div className="d-flex align-items-center gap-2">
                                                <FiActivity size={14} /> 
                                                <strong>Created On:</strong> {new Date(selectedItem.createdAt).toLocaleString()}
                                            </div>
                                            {selectedItem.adminId && (
                                                <div className="d-flex align-items-center gap-2">
                                                    <FiUser size={14} /> 
                                                    <strong>Initiated By:</strong> {selectedItem.adminId.email}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer border-0 p-4 pt-0">
                                <button
                                    type="button"
                                    className="btn btn-primary w-100 rounded-pill py-3 fw-bold shadow-sm"
                                    onClick={() => setShowModal(false)}
                                >
                                    Dismiss Details
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .hover-bg-light:hover {
                    background-color: rgba(0,0,0,0.02);
                }
                .rotate-anim {
                    animation: rotate 1s linear infinite;
                }
                @keyframes rotate {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .transition-all {
                    transition: all 0.2s ease-in-out;
                }
                .history-list::-webkit-scrollbar {
                    width: 6px;
                }
                .history-list::-webkit-scrollbar-track {
                    background: transparent;
                }
                .history-list::-webkit-scrollbar-thumb {
                    background: #eee;
                    border-radius: 10px;
                }
                .history-list::-webkit-scrollbar-thumb:hover {
                    background: #ddd;
                }
            `}</style>
        </div>
    );
};

export default NotificationHistory;