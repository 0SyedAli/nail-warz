"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_51RqOmjDDujdJ0hKzkfAi12EJB6WVvYYtY1SUTME4kjdisOMNtrFCG99JNvFR8phsJ5DySlnaehCMyp6pX3L5gYip00ibakNmG3");

export default function StripeProvider({ children, clientSecret }) {
  return <Elements stripe={stripePromise} options={{ clientSecret }}>{children}</Elements>;
}
