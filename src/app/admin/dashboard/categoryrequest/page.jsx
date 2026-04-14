"use client";
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
  Container,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Avatar,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { FaPlus, FaCheck, FaTimes, FaInfoCircle, FaHourglassHalf, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Image from "next/image";

const AdminCategoryRequestPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const cookie = Cookies.get("user");
    if (!cookie) return router.push("/admin/auth/login");
    getRequests();
  }, [router]);

  const getRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categoryRequest`);
      if (!response.ok) throw new Error(`Error: ${response.status}`);

      const data = await response.json();
      if (data.success) {
        setRequests(data.data);
      } else {
        throw new Error(data.msg || "Failed to fetch category requests.");
      }
    } catch (err) {
      const message = err?.message || "Failed to load category requests.";
      setError(message);
      toast.error(message, { autoClose: 1500 });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      setUpdatingId(id);
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/categoryRequest/${id}`,
        { status: newStatus }
      );

      if (response?.data?.success) {
        toast.success(`Request ${newStatus} successfully!`, { autoClose: 1500 });
        // Update local state without re-fetching
        setRequests(prev => prev.map(req =>
          req._id === id ? { ...req, status: newStatus } : req
        ));
      } else {
        throw new Error(response?.data?.message || `Failed to ${newStatus} request`);
      }
    } catch (err) {
      toast.error(err?.message || `Error updating request to ${newStatus}`, { autoClose: 1500 });
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusInfo = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return { colorScheme: "yellow", icon: FaHourglassHalf, label: "Pending" };
      case "approved":
        return { colorScheme: "green", icon: FaCheckCircle, label: "Approved" };
      case "rejected":
        return { colorScheme: "red", icon: FaTimesCircle, label: "Rejected" };
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
      <Box className="category-request-page">
        {/* Header Section */}
        <Flex direction={{ base: "column", md: "row" }} justify="space-between" align={{ base: "flex-start", md: "center" }} mb={10}>
          <VStack align="flex-start" spacing={1}>
            <Heading size="lg" fontWeight="800" letterSpacing="tight">Category Proposals</Heading>
            <Text color="gray.500">Review and manage category requests submitted by vendors.</Text>
          </VStack>
        </Flex>

        {/* Stats Section */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={10}>
          <Box bg="white" p={6} borderRadius="md" boxShadow="sm" border="1px solid #ccc" borderColor="gray.100 transition='all 0.3s' _hover={{ transform: 'translateY(-5px)', boxShadow: 'md' }}">
            <Stat>
              <StatLabel color="gray.500" fontWeight="600" fontSize="18px">Incoming Proposals</StatLabel>
              <StatNumber fontSize="3xl" fontWeight="800">{stats.total}</StatNumber>
            </Stat>
          </Box>
          <Box bg="white" p={6} borderRadius="md" boxShadow="sm" border="1px solid #ccc" borderColor="gray.100 transition='all 0.3s' _hover={{ transform: 'translateY(-5px)', boxShadow: 'md' }}">
            <Stat>
              <StatLabel color="gray.500" fontWeight="600" fontSize="18px">Pending Review</StatLabel>
              <StatNumber fontSize="3xl" fontWeight="800" color="yellow.500">{stats.pending}</StatNumber>
            </Stat>
          </Box>
          <Box bg="white" p={6} borderRadius="md" boxShadow="sm" border="1px solid #ccc" borderColor="gray.100 transition='all 0.3s' _hover={{ transform: 'translateY(-5px)', boxShadow: 'md' }}">
            <Stat>
              <StatLabel color="gray.500" fontWeight="600" fontSize="18px">Approved This Month</StatLabel>
              <StatNumber fontSize="3xl" fontWeight="800" color="green.500">{stats.approved}</StatNumber>
            </Stat>
          </Box>
        </SimpleGrid>

        {/* Main Content */}
        <Box bg="white" borderRadius="2xl" boxShadow="xl" overflow="hidden" border="1px solid" borderColor="gray.100">
          {loading ? (
            <Flex justify="center" align="center" py={20}>
              <VStack spacing={4}>
                <Box className="spinner-border text-danger" role="status" />
                <Text fontWeight="600" color="gray.500">Loading proposals...</Text>
              </VStack>
            </Flex>
          ) : error ? (
            <Flex justify="center" align="center" py={20}>
              <VStack spacing={4}>
                <Icon as={FaTimesCircle} color="red.500" boxSize={12} />
                <Text fontWeight="600" color="red.500">{error}</Text>
                <Button onClick={getRequests} variant="outline" colorScheme="red">Retry</Button>
              </VStack>
            </Flex>
          ) : requests.length === 0 ? (
            <Flex justify="center" align="center" py={20} direction="column">
              <VStack spacing={6}>
                <Box p={10} bg="gray.50" borderRadius="full">
                  <Icon as={FaCheckCircle} color="gray.300" boxSize={20} />
                </Box>
                <VStack spacing={2}>
                  <Heading size="md" color="gray.700">All clear!</Heading>
                  <Text color="gray.500">There are no category proposals to review at the moment.</Text>
                </VStack>
              </VStack>
            </Flex>
          ) : (
            <Box overflowX="auto">
              <Table variant="simple">
                <Thead bg="gray.50">
                  <Tr>
                    <Th color="black.800" py={5}>Category Name</Th>
                    <Th color="black.800" py={5}>Subcategories</Th>
                    <Th color="black.800" py={5}>Reason</Th>
                    <Th color="black.800" py={5}>Requested By</Th>
                    <Th color="black.800" py={5}>Status</Th>
                    <Th color="black.800" py={5} textAlign="right">Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {requests.map((req) => {
                    const status = getStatusInfo(req.status);
                    const vendorName = req.vendorId?.salonName || req.vendorId?.name || "Unknown Vendor";
                    const isPending = req.status?.toLowerCase() === "pending";

                    return (
                      <Tr key={req._id} _hover={{ bg: "gray.50" }}>
                        <Td>
                          <VStack align="flex-start" spacing={0}>
                            <Text fontWeight="700" color="gray.800">{req.categoryName}</Text>
                          </VStack>
                        </Td>
                        <Td>
                          <HStack spacing={1} flexWrap="wrap">
                            {req.subCategories?.slice(0, 3).map((sub, i) => (
                              <Badge key={i} variant="subtle" colorScheme="gray" textTransform="none" px={2}>
                                {sub}
                              </Badge>
                            ))}
                            {req.subCategories?.length > 3 && (
                              <Badge variant="outline" colorScheme="gray" px={2}>
                                +{req.subCategories.length - 3} more
                              </Badge>
                            )}
                          </HStack>
                        </Td>
                        <Td>
                          <VStack align="flex-start" spacing={0}>
                            <Text fontWeight="500" color="gray.800" fontSize="sm">{req.reason}</Text>
                          </VStack>
                        </Td>
                        <Td>
                          <HStack spacing={2}>
                            {req.vendorId?.image?.[0] ? (
                              <Image
                                width={30}
                                height={30}
                                style={{ width: "30px", height: "30px", borderRadius: "50%" }}
                                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${req.vendorId.image[0]}`}
                                alt={vendorName}
                              />
                            ) : (
                              <div
                                style={{
                                  width: "30px",
                                  height: "30px",
                                  borderRadius: "50%",
                                  backgroundColor: "#3182ce",
                                  color: "#fff",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontWeight: "bold",
                                  fontSize: "14px",
                                  textTransform: "uppercase"
                                }}
                              >
                                {vendorName?.charAt(0) || "?"}
                              </div>
                            )}

                            <Text fontSize="sm" fontWeight="500" style={{ textTransform: "capitalize" }}>
                              {vendorName}
                            </Text>
                          </HStack>

                          {/* <Text fontSize="10px" color="gray.400">
                            {req.vendorId?._id || req.vendorId}
                          </Text> */}
                        </Td>

                        <Td>
                          <Badge colorScheme={status.colorScheme} variant="solid" px={3} py={1} borderRadius="full" fontSize="xs">
                            {status.label}
                          </Badge>
                        </Td>
                        <Td textAlign="right">
                          <HStack justify="flex-end" spacing={2}>
                            {isPending ? (
                              <>
                                <Tooltip label="Approve Proposal" hasArrow>
                                  <IconButton
                                    icon={<FaCheck />}
                                    colorScheme="green"
                                    size="sm"
                                    onClick={() => updateStatus(req._id, "Approved")}
                                    isLoading={updatingId === req._id}
                                    aria-label="Approve"
                                  />
                                </Tooltip>
                                <Tooltip label="Reject Proposal" hasArrow>
                                  <IconButton
                                    icon={<FaTimes />}
                                    colorScheme="red"
                                    size="sm"
                                    onClick={() => updateStatus(req._id, "Rejected")}
                                    isLoading={updatingId === req._id}
                                    aria-label="Reject"
                                  />
                                </Tooltip>
                              </>
                            ) : (
                              // <Text fontSize="xs" color="gray.400" borderRadius="full" fontStyle="italic">Processed</Text>
                              <Badge bg="white" color="gray.400" border="1px solid #d1d5db" variant="solid" px={3} py={1} borderRadius="full" fontSize="xs">
                                Processed
                              </Badge>
                            )}
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
    </Box>
  );
};

export default AdminCategoryRequestPage;
