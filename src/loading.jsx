import BallsLoading from "./components/Spinner/BallsLoading";

export default function Loading() {
  // Or a custom loading skeleton component
  return (
    <div className="h-100 w-100 d-flex align-items-center justify-content-center">
      <BallsLoading />
    </div>
  )
}