"use client";

import { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import CreateNotificationCard from "@/components/pushNotification/CreateNotificationCard";
import NotificationHistory from "@/components/pushNotification/NotificationHistory";
import { showErrorToast, showSuccessToast } from "@/lib/toast";

export default function PushNotificationPage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [recipientType, setRecipientType] = useState(""); // active, inactive, or empty (all)
  const [scheduledAt, setScheduledAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingHistory, setFetchingHistory] = useState(false);
  const [history, setHistory] = useState([]);

  // 🔔 FETCH HISTORY
  const fetchHistory = useCallback(async () => {
    try {
      setFetchingHistory(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/superAdmin/notificationHistory`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      const json = await res.json();
      if (res.ok) {
        setHistory(json.data || []);
      }
    } catch (err) {
      console.error("History fetch error:", err);
    } finally {
      setFetchingHistory(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // 🔔 SEND NOTIFICATION
  const handleSend = async () => {
    if (!title || !body) {
      showErrorToast("Title and body are required");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        title,
        body,
        data: {
          type: "admin broadcast",
        },
        recipientType: recipientType || undefined,
        scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : undefined,
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/superAdmin/sendNotification`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const json = await res.json();

      if (!res.ok) throw new Error(json.message || "Failed to send notification");

      setTitle("");
      setBody("");
      setRecipientType("");
      setScheduledAt("");
      showSuccessToast("Notification broadcast initiated! ✅");
      
      // Refresh history
      fetchHistory();

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
            Send targeted notifications to users and manage your broadcast history.
          </p>
        </div>

        <div className="row g-4">

          {/* LEFT – CREATE */}
          <div className="col-lg-5">
            <CreateNotificationCard
              title={title}
              body={body}
              recipientType={recipientType}
              scheduledAt={scheduledAt}
              setTitle={setTitle}
              setBody={setBody}
              setRecipientType={setRecipientType}
              setScheduledAt={setScheduledAt}
              loading={loading}
              onSend={handleSend}
            />
          </div>

          {/* RIGHT – HISTORY */}
          <div className="col-lg-7">
            <NotificationHistory 
              history={history} 
              loading={fetchingHistory} 
              onRefresh={fetchHistory}
            />
          </div>

        </div>
      </div>
    </div>
  );
}
