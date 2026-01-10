import React from 'react'
import { BsSend } from 'react-icons/bs';

const CreateNotificationCard = ({
    title,
    body,
    setTitle,
    setBody,
    onSend,
    loading,
}) => {
    return (
        <div className="card p-4 h-100">
            <h6 className="fw-semibold mb-3">Create Push Notification</h6>

            <div className="mb-3">
                <label className="form-label">Notification Title</label>
                <input
                    className="form-control"
                    placeholder="Enter notification title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>

            <div className="mb-2">
                <label className="form-label">Message</label>
                <textarea
                    className="form-control"
                    rows={4}
                    maxLength={200}
                    placeholder="Enter your message..."
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                />
                <small className="text-muted">
                    {body.length}/200 characters
                </small>
            </div>

            <div className="d-flex gap-2 mt-4">
                <button
                    className="btn btn-dark px-4 d-flex align-items-center gap-2"
                    onClick={onSend}
                    disabled={loading}
                >
                    <BsSend />
                    {loading ? "Sending..." : "Send Now"}
                </button>

                {/* <button className="btn btn-outline-secondary px-4" disabled>
                    Save as Draft
                </button> */}
            </div>
        </div>
    );
}

export default CreateNotificationCard