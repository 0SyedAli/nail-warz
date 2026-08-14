"use client";
import Image from "next/image";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { requestForToken, onMessageListener } from "@/lib/firebase";
import { toast } from "react-toastify";
import { FaStripeS } from "react-icons/fa";
import AbuseWarningModal from "./Modal/AbuseWarningModal";


const TopBar = ({ header }) => {
  const router = useRouter();

  const [salonId, setSalonId] = useState(null);
  const [token, setToken] = useState(null);
  const [salonName, setSalonName] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isStripeConnected, setIsStripeConnected] = useState(false);
  const [stripeLoading, setStripeLoading] = useState(false);

  // Abuse flag states
  const [showAbuseModal, setShowAbuseModal] = useState(false);
  const [isFlaggedForAbuse, setIsFlaggedForAbuse] = useState(false);
  const [abuseReasons, setAbuseReasons] = useState([]);
  const [activeAbuseFlags, setActiveAbuseFlags] = useState([]);

  // STEP 1: get cookie only once
  useEffect(() => {
    const cookie = Cookies.get("user");
    const token = Cookies.get("token");

    if (!cookie || !token) return router.push("/auth/login");

    try {
      const u = JSON.parse(cookie);

      if (!u?._id) return router.push("/auth/login");

      setSalonId(u._id);
      setToken(token);

      // Read isStripeConnected from cookie initially
      if (u?.isStripeConnected) {
        setIsStripeConnected(true);
      }

      // Store email for stripe connect API call
      const email = u?.email || u?.bussinessEmail || "";
      setUserEmail(email);

    } catch (e) {
      router.push("/auth/login");
    }
  }, []);


  // STEP 2: call API only after salonId & token exist
  useEffect(() => {
    if (!salonId || !token) return;

    const fetchData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/getAdminById?salonId=${salonId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const json = await res.json();

        if (!json.success) return router.push("/auth/login");

        setSalonName(json.data.salonName || "");
        setLocation(json.data.location?.locationName || json.data.locationName || "");
        setImage(json.data.image?.[0] || "");

        // Check for abuse flags
        if (json.data.isFlaggedForAbuse) {
          setIsFlaggedForAbuse(json.data.isFlaggedForAbuse || false);
          setAbuseReasons(json.data.abuseReasons || []);
          setActiveAbuseFlags(json.data.activeAbuseFlags || []);
          setShowAbuseModal(true);
        }

        // Sync isStripeConnected from latest API response
        const stripeStatus = json.data?.isStripeConnected === true;
        setIsStripeConnected(stripeStatus);

        // Update cookie with latest stripe status
        try {
          const existingCookie = Cookies.get("user");
          if (existingCookie) {
            const parsed = JSON.parse(existingCookie);
            Cookies.set("user", JSON.stringify({ ...parsed, isStripeConnected: stripeStatus }), {
              expires: 7,
              secure: process.env.NODE_ENV === "production",
              sameSite: "Strict",
            });
          }
        } catch (_) { }

        // Sync email if not already set
        if (!userEmail) {
          const email = json.data?.email || json.data?.bussinessEmail || "";
          setUserEmail(email);
        }

        // FCM Token logic
        if (!json.data.FCMToken) {
          const fcmToken = await requestForToken();
          if (fcmToken) {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/updateAdminProfile`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                id: salonId,
                FCMToken: fcmToken,
              }),
            });
          }
        }
        console.log(stripeStatus, 'jkj');
      } catch (err) {
        console.error("Error in TopBar fetchData:", err);
        router.push("/auth/login");
      }
    };

    fetchData();
  }, [salonId, token]); // <-- will run only when both available


  // Handle foreground notifications
  useEffect(() => {
    onMessageListener()
      .then((payload) => {
        if (payload?.notification) {
          toast.info(
            <div>
              <strong>{payload.notification.title}</strong>
              <p>{payload.notification.body}</p>
            </div>,
            { position: "top-right" }
          );
        }
      })
      .catch((err) => console.log("failed: ", err));
  }, []);


  // Handle Stripe Connect button click
  const handleStripeConnect = async () => {
    if (isStripeConnected || stripeLoading) return;

    setStripeLoading(true);
    try {
      const emailToUse = userEmail;

      if (!emailToUse) {
        toast.error("User email not found. Please try again.");
        setStripeLoading(false);
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/superAdmin/connectVendorAccount`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email: emailToUse }),
        }
      );

      const json = await res.json();

      if (!json.success && !json.onboardingUrl) {
        throw new Error(json.message || "Failed to get Stripe onboarding link.");
      }

      const onboardingUrl = json.onboardingUrl || json.data?.onboardingUrl;
      if (onboardingUrl) {
        // Redirect user to Stripe onboarding page
        window.location.href = onboardingUrl;
      } else {
        throw new Error("No onboarding URL received from server.");
      }
    } catch (err) {
      console.error("Stripe Connect error:", err);
      toast.error(err.message || "Something went wrong with Stripe Connect.");
      setStripeLoading(false);
    }
  };


  return (
    <div className="topbar_container">
      <div>
        <h1>{header}</h1>
      </div>

      <div className="tc_profile flex-wrap">
        {/* Stripe Connect Button */}
        {isStripeConnected ? (
          <button className="stripe_btn_connected" disabled title="Stripe account is connected">
            {/* Checkmark icon */}
            <FaStripeS color="black" size={20} />
            Stripe Connected
          </button>
        ) : (
          <button
            className="stripe_btn_connect"
            onClick={handleStripeConnect}
            disabled={stripeLoading}
            title="Connect your Stripe account to receive payouts"
          >
            {stripeLoading ? (
              <span className="stripe_btn_spinner" aria-label="Loading" />
            ) : (
              /* Stripe "S" card icon */
              <svg
                className="stripe_icon"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <rect width="24" height="24" rx="5" fill="rgba(255,255,255,0.2)" />
                <path
                  d="M11.515 9.234c0-.612.504-.847 1.337-.847.849 0 1.922.258 2.77.716V6.437A7.358 7.358 0 0012.852 6c-2.446 0-4.074 1.276-4.074 3.407 0 3.325 4.582 2.791 4.582 4.222 0 .723-.628.958-1.505.958-1.304 0-2.97-.538-4.285-1.263v2.69c1.46.63 2.934.895 4.285.895 3.271 0 4.515-1.617 4.515-3.747-.013-3.59-4.855-2.95-4.855-3.928z"
                  fill="#ffffff"
                />
              </svg>
            )}
            {stripeLoading ? "Connecting…" : "Connect Stripe"}
          </button>
        )}

        {isFlaggedForAbuse && (
          <div
            className="cursor-pointer"
            style={{
              padding: "6px 16px",
              borderRadius: "50px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(255, 75, 75, 0.15)",
              border: "1px solid rgba(255, 75, 75, 0.3)",
              backdropFilter: "blur(10px)",
              color: "rgb(255, 75, 75)",
              fontWeight: "500",
              fontSize: "13px"
            }}
            onClick={() => setShowAbuseModal(true)}
          >
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "rgb(255, 75, 75)", boxShadow: "0 0 0 3px rgba(255, 75, 75, 0.12)" }}></div>
            Review Warning
          </div>
        )}
        <div className="d-flex flex-row-reverse flex-md-row flex-wrap gap-2">
          <div>
            {salonName && <h4>{salonName}</h4>}
            {location && <h5>{location}</h5>}
          </div>
          <Image
            src={image ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${image}` : "/images/avatar.png"}
            width={50}
            height={50}
            style={{ borderRadius: "100%", minWidth: "50px", minHeight: "50px" }}
            alt=""
          />
        </div>
      </div>

      {/* Abuse Warning Modal */}
      <AbuseWarningModal
        isOpen={showAbuseModal}
        onClose={() => setShowAbuseModal(false)}
        abuseReasons={abuseReasons}
        activeAbuseFlags={activeAbuseFlags}
      />
    </div>
  );
};

export default TopBar;
