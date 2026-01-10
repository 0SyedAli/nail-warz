"use client";

import { useState } from "react";
import Cookies from "js-cookie";
import CreateNotificationCard from "@/components/pushNotification/CreateNotificationCard";
import NotificationHistory from "@/components/pushNotification/NotificationHistory";
import { showErrorToast, showSuccessToast } from "@/lib/toast";

export default function PushNotificationPage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  // 🔔 SEND NOTIFICATION
  const handleSend = async () => {
    if (!title || !body) {
      alert("Title and message are required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/superAdmin/sendNotification`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, body }),
        }
      );

      const json = await res.json();

      if (!res.ok) throw new Error(json.message || "Failed");

      // prepend to history
      setHistory(prev => [
        {
          title,
          body,
          sentAt: new Date().toISOString(),
          delivered: "All Users",
        },
        ...prev,
      ]);

      setTitle("");
      setBody("");
      showSuccessToast("Notification sent successfully ✅");

    } catch (err) {
      showErrorToast(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="dashboard_panel_inner pt-4">

        {/* ===== HEADER ===== */}
        <div className="mb-4">
          <h4 className="fw-bold">Push Notification</h4>
          <p className="text-muted">
            Send Notifications To Users And Manage Messaging
          </p>
        </div>

        <div className="row g-4">

          {/* LEFT – CREATE */}
          <div className="col-lg-6">
            <CreateNotificationCard
              title={title}
              body={body}
              setTitle={setTitle}
              setBody={setBody}
              loading={loading}
              onSend={handleSend}
            />
          </div>

          {/* RIGHT – HISTORY */}
          <div className="col-lg-6">
            <NotificationHistory history={history} />
          </div>

        </div>
      </div>
    </div>
  );
}
