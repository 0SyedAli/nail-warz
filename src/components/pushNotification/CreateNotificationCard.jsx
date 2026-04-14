import React from 'react';
import { BsSend } from 'react-icons/bs';
import { FiUsers, FiCalendar, FiType, FiMessageSquare, FiTarget } from 'react-icons/fi';

const CreateNotificationCard = ({
    title,
    body,
    recipientType,
    scheduledAt,
    setTitle,
    setBody,
    setRecipientType,
    setScheduledAt,
    onSend,
    loading,
}) => {
    return (
        <div className="card border-0 shadow-sm p-4 h-100" style={{ borderRadius: '16px' }}>
            <div className="d-flex align-items-center gap-2 mb-4">
                <div className="bg-danger bg-opacity-10 p-2 rounded-3 text-danger">
                    <BsSend size={20} />
                </div>
                <h5 className="fw-bold mb-0">Create Broadcast</h5>
            </div>

            <div className="mb-4">
                <label className="form-label fw-semibold text-secondary d-flex align-items-center gap-2 small">
                    <FiType size={14} /> Notification Title
                </label>
                <input
                    className="form-control form-control-lg border-2"
                    placeholder="Enter Notification Title"
                    style={{ fontSize: '15px', borderRadius: '10px' }}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>

            <div className="mb-4">
                <label className="form-label fw-semibold text-secondary d-flex align-items-center gap-2 small">
                    <FiMessageSquare size={14} /> Message Body
                </label>
                <textarea
                    className="form-control border-2"
                    rows={4}
                    maxLength={200}
                    placeholder="Write your announcement here..."
                    style={{ fontSize: '14px', borderRadius: '10px', resize: 'none' }}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                />
                <div className="d-flex justify-content-end mt-1">
                    <small className={`px-2 py-1 rounded-pill ${body.length > 180 ? 'bg-danger text-white' : 'text-muted bg-light'}`} style={{ fontSize: '10px' }}>
                        {body.length} / 200
                    </small>
                </div>
            </div>

            <div className="row g-3 mb-4">
                <div className="col-md-6">
                    <label className="form-label fw-semibold text-secondary d-flex align-items-center gap-2 small">
                        <FiTarget size={14} /> Target Audience
                    </label>
                    <select
                        className="form-select border-2"
                        style={{ fontSize: '14px', borderRadius: '10px' }}
                        value={recipientType}
                        onChange={(e) => setRecipientType(e.target.value)}
                    >
                        <option value="">All Users</option>
                        <option value="active">Active Users</option>
                        <option value="inactive">Inactive Users</option>
                    </select>
                </div>
                <div className="col-md-6">
                    <label className="form-label fw-semibold text-secondary d-flex align-items-center gap-2 small">
                        <FiCalendar size={14} /> Schedule (Optional)
                    </label>
                    <input
                        type="datetime-local"
                        className="form-control border-2"
                        style={{ fontSize: '14px', borderRadius: '10px' }}
                        value={scheduledAt}
                        onChange={(e) => setScheduledAt(e.target.value)}
                    />
                </div>
            </div>

            <div className="mt-auto pt-3">
                <button
                    className="btn btn-danger btn-lg w-100 py-3 d-flex align-items-center justify-content-center gap-2 shadow-sm transition-all"
                    style={{ borderRadius: '12px', fontWeight: '600' }}
                    onClick={onSend}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            Initiating...
                        </>
                    ) : (
                        <>
                            <BsSend />
                            Dispatch Notification
                        </>
                    )}
                </button>
                <p className="text-center text-muted mt-3 small">
                    <i className="bi bi-info-circle me-1"></i>
                    This action will be logged in the history.
                </p>
            </div>
        </div>
    );
}

export default CreateNotificationCard;