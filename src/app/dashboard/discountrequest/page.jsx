"use client"
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  HStack,
  VStack,
  Icon,
  useDisclosure,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FaPlus,
  FaTrash,
  FaInfoCircle,
  FaHourglassHalf,
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaPercent,
} from "react-icons/fa";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "react-toastify";
import DiscountRequestModal from "@/components/Modal/DiscountRequestModal";
import AreYouSure2 from "@/components/Modal/AreYouSure2";

const DiscountRequestPage = () => {
  const [requests, setRequests] = useState([]);
  const [vendorId, setVendorId] = useState("");
  const [requestToDelete, setRequestToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const cookie = Cookies.get("user");
    if (!cookie) return router.push("/auth/login");

    try {
      const u = JSON.parse(cookie);
      if (u?._id) setVendorId(u._id);
      else router.push("/auth/login");
    } catch {
      router.push("/auth/login");
    }
  }, [router]);

  useEffect(() => {
    if (vendorId) getRequests();
  }, [vendorId]);

  const getRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/booking-discount-request?vendorId=${vendorId}`
      );
      if (!response.ok) throw new Error(`Error: ${response.status}`);

      const data = await response.json();
      if (data.success) {
        setRequests(data.data);
      } else {
        throw new Error(data.msg || "Failed to fetch discount requests.");
      }
    } catch (err) {
      const message = err?.message || "Failed to load discount requests.";
      setError(message);
      toast.error(message, { autoClose: 1500 });
    } finally {
      setLoading(false);
    }
  };

  const deleteRequest = async (id) => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/booking-discount-request/${id}`
      );
      if (response?.data?.success) {
        toast.success("Discount request deleted successfully!", { autoClose: 1500 });
        getRequests();
      } else {
        throw new Error(response?.data?.message || "Failed to delete request");
      }
    } catch (err) {
      toast.error(err?.message || "Error deleting request", { autoClose: 1500 });
    }
  };

  const handleConfirmDelete = () => {
    if (requestToDelete) {
      deleteRequest(requestToDelete);
      setRequestToDelete(null);
    }
  };

  const handleOpenViewModal = (req) => {
    setSelectedRequest(req);
    onViewOpen();
  };

  const getStatusInfo = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return { colorScheme: "yellow", icon: FaHourglassHalf, label: "Pending Review" };
      case "approved":
        return { colorScheme: "green", icon: FaCheckCircle, label: "Approved" };
      case "rejected":
        return { colorScheme: "red", icon: FaTimesCircle, label: "Declined" };
      default:
        return { colorScheme: "gray", icon: FaInfoCircle, label: status };
    }
  };

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status?.toLowerCase() === "pending").length,
    approved: requests.filter(r => r.status?.toLowerCase() === "approved").length,
  };

  return (
    <Box py={8}>
      <Box className="discount-request-page">
        {/* Header Section */}
        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align={{ base: "flex-start", md: "center" }}
          mb={10}
        >
          <VStack align="flex-start" spacing={1}>
            <Flex align="center" gap={2}>
              {/* <Icon as={FaPercent} fontSize="28px" color="#C11111" /> */}
              <Heading size="lg" fontWeight="800" letterSpacing="tight">
                Discount Requests
              </Heading>
            </Flex>
            <Text color="gray.500">
              Create and manage your discount proposals for bookings.
            </Text>
          </VStack>
          <Button
            leftIcon={<FaPlus />}
            bg="#C11111"
            color="white"
            size="lg"
            px={8}
            borderRadius="md"
            _hover={{
              bg: "red.700",
              boxShadow: "0 6px 20px rgba(193, 17, 17, 0.23)",
              transform: "translateY(-2px)",
            }}
            _active={{ transform: "scale(0.98)" }}
            onClick={onOpen}
            mt={{ base: 4, md: 0 }}
          >
            Request New Discount
          </Button>
        </Flex>

        {/* Stats Section */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={10}>
          <Box
            bg="white"
            p={6}
            borderRadius="md"
            boxShadow="sm"
            border="1px solid"
            borderColor="gray.100"
            transition="all 0.3s"
            _hover={{
              transform: "translateY(-5px)",
              boxShadow: "md",
            }}
          >
            <Stat>
              <StatLabel color="gray.500" fontWeight="600">
                Total Requests
              </StatLabel>
              <StatNumber fontSize="3xl" fontWeight="800">
                {stats.total}
              </StatNumber>
            </Stat>
          </Box>
          <Box
            bg="white"
            p={6}
            borderRadius="md"
            boxShadow="sm"
            border="1px solid"
            borderColor="gray.100"
            transition="all 0.3s"
            _hover={{
              transform: "translateY(-5px)",
              boxShadow: "md",
            }}
          >
            <Stat>
              <StatLabel color="gray.500" fontWeight="600">
                Pending Review
              </StatLabel>
              <StatNumber fontSize="3xl" fontWeight="800" color="yellow.500">
                {stats.pending}
              </StatNumber>
            </Stat>
          </Box>
          <Box
            bg="white"
            p={6}
            borderRadius="md"
            boxShadow="sm"
            border="1px solid"
            borderColor="gray.100"
            transition="all 0.3s"
            _hover={{
              transform: "translateY(-5px)",
              boxShadow: "md",
            }}
          >
            <Stat>
              <StatLabel color="gray.500" fontWeight="600">
                Approved
              </StatLabel>
              <StatNumber fontSize="3xl" fontWeight="800" color="green.500">
                {stats.approved}
              </StatNumber>
            </Stat>
          </Box>
        </SimpleGrid>

        {/* Main Content */}
        <Box
          bg="white"
          borderRadius="2xl"
          boxShadow="xl"
          overflow="hidden"
          border="1px solid"
          borderColor="gray.100"
        >
          {loading ? (
            <Flex justify="center" align="center" py={20}>
              <VStack spacing={4}>
                <Box className="spinner-border text-danger" role="status" />
                <Text fontWeight="600" color="gray.500">
                  Fetching your discount requests...
                </Text>
              </VStack>
            </Flex>
          ) : error ? (
            <Flex justify="center" align="center" py={20}>
              <VStack spacing={4} textAlign="center">
                <Icon as={FaInfoCircle} fontSize="40px" color="red.500" />
                <Text fontWeight="600" color="red.500">
                  {error}
                </Text>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={getRequests}
                  borderColor="#C11111"
                  color="#C11111"
                  _hover={{ bg: "#fff5f5" }}
                >
                  Try Again
                </Button>
              </VStack>
            </Flex>
          ) : requests.length === 0 ? (
            <Flex justify="center" align="center" py={20}>
              <VStack spacing={4} textAlign="center">
                <Icon as={FaPercent} fontSize="40px" color="gray.300" />
                <Text fontWeight="600" color="gray.500" fontSize="lg">
                  No discount requests yet
                </Text>
                <Text color="gray.400" fontSize="sm">
                  Create your first discount request to get started.
                </Text>
                <Button
                  leftIcon={<FaPlus />}
                  bg="#C11111"
                  color="white"
                  size="sm"
                  onClick={onOpen}
                  _hover={{ bg: "red.700" }}
                >
                  Create Request
                </Button>
              </VStack>
            </Flex>
          ) : (
            <Box overflowX="auto">
              <Table variant="simple">
                <Thead bg="gray.50" borderBottom="2px solid" borderColor="gray.200">
                  <Tr>
                    <Th
                      color="gray.700"
                      fontWeight="700"
                      fontSize="sm"
                      textTransform="capitalize"
                      py={4}
                    >
                      Discount Type
                    </Th>
                    <Th
                      color="gray.700"
                      fontWeight="700"
                      fontSize="sm"
                      textTransform="capitalize"
                      py={4}
                    >
                      Value
                    </Th>
                    <Th
                      color="gray.700"
                      fontWeight="700"
                      fontSize="sm"
                      textTransform="capitalize"
                      py={4}
                    >
                      Start Date
                    </Th>
                    <Th
                      color="gray.700"
                      fontWeight="700"
                      fontSize="sm"
                      textTransform="capitalize"
                      py={4}
                    >
                      End Date
                    </Th>
                    <Th
                      color="gray.700"
                      fontWeight="700"
                      fontSize="sm"
                      textTransform="capitalize"
                      py={4}
                    >
                      Status
                    </Th>
                    <Th
                      color="gray.700"
                      fontWeight="700"
                      fontSize="sm"
                      textTransform="capitalize"
                      py={4}
                    >
                      Actions
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {requests.map((request) => {
                    const statusInfo = getStatusInfo(request.status);
                    return (
                      <Tr
                        key={request._id}
                        borderBottom="1px solid"
                        borderColor="gray.100"
                        _hover={{ bg: "gray.50" }}
                      >
                        <Td py={4} fontWeight="500" color="gray.800">
                          {request.type || "Standard"}
                        </Td>
                        <Td py={4} fontWeight="600" color="#C11111">
                          {request.type === "percentage"
                            ? `${request.value}%`
                            : `$${request.value}`}
                        </Td>
                        <Td py={4} color="gray.600" fontSize="sm">
                          {new Date(request.startedAt).toLocaleDateString()}
                        </Td>
                        <Td py={4} color="gray.600" fontSize="sm">
                          {new Date(request.endedAt).toLocaleDateString()}
                        </Td>
                        <Td py={4}>
                          <Badge
                            colorScheme={statusInfo.colorScheme}
                            px={3}
                            py={1}
                            borderRadius="full"
                            fontSize="xs"
                            fontWeight="600"
                          >
                            {statusInfo.label}
                          </Badge>
                        </Td>
                        <Td py={4}>
                          <HStack spacing={2}>
                            <Tooltip label="View Details" placement="top">
                              <IconButton
                                icon={<FaEye />}
                                size="sm"
                                variant="ghost"
                                colorScheme="blue"
                                onClick={() => handleOpenViewModal(request)}
                                _hover={{ bg: "blue.50", color: "blue.600" }}
                              />
                            </Tooltip>
                            <Tooltip label="Delete" placement="top">
                              <IconButton
                                icon={<FaTrash />}
                                size="sm"
                                variant="ghost"
                                colorScheme="red"
                                onClick={() => setRequestToDelete(request._id)}
                                _hover={{ bg: "red.50", color: "red.600" }}
                              />
                            </Tooltip>
                          </HStack>
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </Box>
          )}
        </Box>
      </Box>

      {/* Modals */}
      <DiscountRequestModal
        isOpen={isOpen}
        onClose={onClose}
        onSuccess={getRequests}
        vendorId={vendorId}
      />

      <DiscountRequestModal
        isOpen={isViewOpen}
        onClose={onViewClose}
        request={selectedRequest}
        isViewOnly
        onSuccess={getRequests}
        vendorId={vendorId}
      />

      <AreYouSure2
        title="Delete Discount Request"
        message="Are you sure you want to delete this discount request?"
        isOpen={!!requestToDelete}
        onClose={() => setRequestToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
};

export default DiscountRequestPage;
