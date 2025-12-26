"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51SfTtV0hRTyG4Njch0NcOfD4pwUF22Dfwh70Vs0TH2vahC2yr2qNBHG41S2FjQDINfv9Y4vik0hkOAVjpeh1y1cY00o2ieAOEw"
);

export default function StripeProvider({ children, clientSecret }) {
  return <Elements stripe={stripePromise} options={{ clientSecret }}>{children}</Elements>;
}
