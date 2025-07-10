import { Spinner } from "@chakra-ui/react";
const SpinnerLoading = () => {
  return (
    <div className="spinner_loader">
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
