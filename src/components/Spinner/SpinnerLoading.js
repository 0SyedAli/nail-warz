import { Spinner } from "@chakra-ui/react";
const SpinnerLoading = ({spinner_class}) => {
  return (
    <div className={`spinner_loader ${spinner_class}`}>
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
    </div>
  );
};

export default SpinnerLoading;
