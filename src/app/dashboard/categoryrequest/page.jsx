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
  Container,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Avatar,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaPlus, FaTrash, FaInfoCircle, FaHourglassHalf, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "react-toastify";
import CategoryRequestModal from "@/components/Modal/CategoryRequestModal";
import AreYouSure2 from "@/components/Modal/AreYouSure2";

const CategoryRequestPage = () => {
  const [requests, setRequests] = useState([]);
  const [adminId, setAdminId] = useState("");
  const [requestToDelete, setRequestToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  useEffect(() => {
    const cookie = Cookies.get("user");
    if (!cookie) return router.push("/auth/login");

    try {
      const u = JSON.parse(cookie);
      if (u?._id) setAdminId(u._id);
      else router.push("/auth/login");
    } catch {
      router.push("/auth/login");
    }
  }, [router]);

  useEffect(() => {
    if (adminId) getRequests();
  }, [adminId]);

  const getRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categoryRequest?vendorId=${adminId}`
      );
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

  const deleteRequest = async (id) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/deleteSalonCategory`,
        { categoryId: id }
      );
      if (response?.data?.success) {
        toast.success("Request removed successfully!", { autoClose: 1500 });
        getRequests();
      } else {
        throw new Error(response?.data?.message || "Failed to remove request");
      }
    } catch (err) {
      toast.error(err?.message || "Error removing request", { autoClose: 1500 });
    }
  };

  const handleConfirmDelete = () => {
    if (requestToDelete) {
      deleteRequest(requestToDelete);
      setRequestToDelete(null);
    }
  };

  const getStatusInfo = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return { colorScheme: "yellow", icon: FaHourglassHalf, label: "Pending Revision" };
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
      <Box className="category-request-page">
        {/* Header Section */}
        <Flex direction={{ base: "column", md: "row" }} justify="space-between" align={{ base: "flex-start", md: "center" }} mb={10}>
          <VStack align="flex-start" spacing={1}>
            <Heading size="lg" fontWeight="800" letterSpacing="tight">Category Requests</Heading>
            <Text color="gray.500">Manage and track your custom category proposals.</Text>
          </VStack>
          <Button
            leftIcon={<FaPlus />}
            bg="#C11111"
            color="white"
            size="lg"
            px={8}
            borderRadius="md"
            // boxShadow="0 4px 14px 0 rgba(193, 17, 17, 0.39)"
            _hover={{
              bg: "red.700",
              boxShadow: "0 6px 20px rgba(193, 17, 17, 0.23)",
              transform: "translateY(-2px)"
            }}
            _active={{ transform: "scale(0.98)" }}
            onClick={onOpen}
            mt={{ base: 4, md: 0 }}
          >
            Request New Category
          </Button>
        </Flex>

        {/* Stats Section */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={10}>
          <Box bg="white" p={6} borderRadius="md" boxShadow="sm" border="1px solid #ccc" borderColor="gray.100 transition='all 0.3s' _hover={{ transform: 'translateY(-5px)', boxShadow: 'md' }}">
            <Stat>
              <StatLabel color="gray.500" fontWeight="600">Total Requests</StatLabel>
              <StatNumber fontSize="3xl" fontWeight="800">{stats.total}</StatNumber>
            </Stat>
          </Box>
          <Box bg="white" p={6} borderRadius="md" boxShadow="sm" border="1px solid #ccc" borderColor="gray.100 transition='all 0.3s' _hover={{ transform: 'translateY(-5px)', boxShadow: 'md' }}">
            <Stat>
              <StatLabel color="gray.500" fontWeight="600">Pending Approvals</StatLabel>
              <StatNumber fontSize="3xl" fontWeight="800" color="yellow.500">{stats.pending}</StatNumber>
            </Stat>
          </Box>
          <Box bg="white" p={6} borderRadius="md" boxShadow="sm" border="1px solid #ccc" borderColor="gray.100 transition='all 0.3s' _hover={{ transform: 'translateY(-5px)', boxShadow: 'md' }}">
            <Stat>
              <StatLabel color="gray.500" fontWeight="600">Approved Categories</StatLabel>
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
                <Text fontWeight="600" color="gray.500">Fetching your records...</Text>
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
                <Box
                  p={10}
                  bg="gray.50"
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon as={FaInfoCircle} color="gray.300" boxSize={20} />
                </Box>
                <VStack spacing={2}>
                  <Heading size="md" color="gray.700">No requests yet</Heading>
                  <Text color="gray.500" textAlign="center">Propose your first category to start expanding your services.</Text>
                </VStack>
                <Button colorScheme="red" variant="ghost" onClick={onOpen}>Propose Category</Button>
              </VStack>
            </Flex>
          ) : (
            <Box overflowX="auto">
              <Table variant="simple">
                <Thead bg="gray.50">
                  <Tr>
                    <Th color="black.800" py={5}>Category Name</Th>
                    <Th color="black.800" py={5}>Subcategories</Th>
                    <Th color="black.800" py={5}>Status</Th>
                    <Th color="black.800" py={5}>Date Requested</Th>
                    <Th color="black.800" py={5} textAlign="right">Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {requests.map((req) => {
                    const status = getStatusInfo(req.status);
                    return (
                      <Tr key={req._id} _hover={{ bg: "gray.50" }} transition="background 0.2s">
                        <Td>
                          <HStack spacing={3}>
                            {/* <Avatar size="sm" name={req.categoryName} bg="red.500" color="white" /> */}
                            <VStack align="flex-start" spacing={0}>
                              <Text fontWeight="700" color="gray.800">{req.categoryName}</Text>
                              <Tooltip label={req.reason} placement="bottom-start" hasArrow>
                                <Text fontSize="xs" color="gray.500" noOfLines={1} maxW="200px">
                                  {req.reason || "No reason provided"}
                                </Text>
                              </Tooltip>
                            </VStack>
                          </HStack>
                        </Td>
                        <Td>
                          <HStack spacing={1} flexWrap="wrap">
                            {req.subCategories?.slice(0, 3).map((sub, i) => (
                              <Badge key={i} variant="subtle" colorScheme="gray" borderRadius="md" textTransform="none" px={2}>
                                {sub}
                              </Badge>
                            ))}
                            {req.subCategories?.length > 3 && (
                              <Badge variant="outline" colorScheme="gray" borderRadius="md" px={2}>
                                +{req.subCategories.length - 3} more
                              </Badge>
                            )}
                          </HStack>
                        </Td>
                        <Td>
                          <HStack spacing={2}>
                            {/* <Icon as={status.icon} color={`${status.colorScheme}.500`} /> */}
                            <Badge
                              colorScheme={status.colorScheme}
                              variant="solid"
                              px={3}
                              py={1}
                              borderRadius="full"
                              fontSize="xs"
                              boxShadow={`0 4px 6px rgba(0,0,0,0.05)`}
                            >
                              {status.label}
                            </Badge>
                          </HStack>
                        </Td>
                        <Td color="gray.600">
                          {new Date(req.createdAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          })}
                        </Td>
                        <Td textAlign="right">
                          <Tooltip label="Remove Request" hasArrow>
                            <IconButton
                              icon={<FaTrash />}
                              colorScheme="red"
                              variant="ghost"
                              size="sm"
                              data-bs-toggle="modal"
                              data-bs-target="#areyousure2"
                              onClick={() => setRequestToDelete(req._id)}
                              aria-label="Delete Request"
                            />
                          </Tooltip>
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
      <CategoryRequestModal
        isOpen={isOpen}
        onClose={onClose}
        onSuccess={getRequests}
      />

      <AreYouSure2
        onConfirm={handleConfirmDelete}
        onCancel={() => setRequestToDelete(null)}
        title="Remove Request"
        message="Are you sure you want to remove this category request? This action cannot be undone."
      />
    </Box>
  );
};

export default CategoryRequestPage;