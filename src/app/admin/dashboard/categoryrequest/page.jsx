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
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  IconButton,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { FaPlus, FaCheck, FaTimes, FaInfoCircle, FaHourglassHalf, FaCheckCircle, FaTimesCircle, FaEye } from "react-icons/fa";
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
  const { isOpen: isRejectOpen, onOpen: onRejectOpen, onClose: onRejectClose } = useDisclosure();
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
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

  const updateStatus = async (id, newStatus, reason = "") => {
    try {
      setUpdatingId(id);
      const payload = { status: newStatus };
      if (newStatus === "Rejected" && reason) {
        payload.rejectionReason = reason;
      }

      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/categoryRequest/${id}`,
        payload
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

  const handleOpenRejectModal = (id) => {
    setRejectingId(id);
    setRejectionReason("");
    onRejectOpen();
  };

  const handleOpenViewModal = (req) => {
    setSelectedRequest(req);
    onViewOpen();
  };

  const handleConfirmReject = () => {
    if (!rejectionReason.trim()) {
      toast.warning("Please provide a reason for rejection.");
      return;
    }
    updateStatus(rejectingId, "Rejected", rejectionReason);
    onRejectClose();
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
    <Box py={8} >
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
              <StatNumber fontSize="3xl" fontWeight="800" >{stats.total}</StatNumber>
            </Stat>
          </Box>
          <Box bg="white" p={6} borderRadius="md" boxShadow="sm" border="1px solid #ccc" borderColor="gray.100 transition='all 0.3s' _hover={{ transform: 'translateY(-5px)', boxShadow: 'md' }}">
            <Stat >
              <StatLabel color="gray.500" fontWeight="600" fontSize="18px">Pending Review</StatLabel>
              <StatNumber fontSize="3xl" fontWeight="800" color="yellow.500" >{stats.pending}</StatNumber>
            </Stat>
          </Box>
          <Box bg="white" p={6} borderRadius="md" boxShadow="sm" border="1px solid #ccc" borderColor="gray.100 transition='all 0.3s' _hover={{ transform: 'translateY(-5px)', boxShadow: 'md' }}">
            <Stat >
              <StatLabel color="gray.500" fontWeight="600" fontSize="18px">Approved This Month</StatLabel>
              <StatNumber fontSize="3xl" fontWeight="800" color="green.500" >{stats.approved}</StatNumber>
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
                            <Tooltip label="View Details" hasArrow>
                              <IconButton
                                icon={<FaEye />}
                                colorScheme="blue"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleOpenViewModal(req)}
                                aria-label="View"
                              />
                            </Tooltip>
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
                                    onClick={() => handleOpenRejectModal(req._id)}
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

      {/* Rejection Modal */}
      <Modal isOpen={isRejectOpen} onClose={onRejectClose} isCentered>
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent borderRadius="xl" p={6} className="category-reject-modal">
          <ModalHeader fontWeight="800" px={0}>Reject Proposal</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack align="flex-start" spacing={4}>
              <Text color="gray.600">
                Please provide a reason for rejecting this category proposal. This will be sent to the vendor.
              </Text>
              <Textarea
                placeholder="Enter rejection reason here..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={5}
                borderRadius="lg"
                focusBorderColor="red.500"
                resize="none"
              />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack spacing={3}>
              <Button variant="ghost" onClick={onRejectClose}>Cancel</Button>
              <Button
                colorScheme="red"
                onClick={handleConfirmReject}
                isLoading={updatingId === rejectingId}
              >
                Confirm Rejection
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* View Detail Modal */}
      <Modal isOpen={isViewOpen} onClose={onViewClose} size="xl" scrollBehavior="inside">
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent borderRadius="2xl" overflow="hidden" className="category-reject-modal2">
          <ModalHeader bg="gray.50" borderBottom="1px solid" borderColor="gray.100" py={6}>
            <Flex justify="space-between" align="center">
              <VStack align="flex-start" spacing={1}>
                <Heading size="md" fontWeight="800">Proposal Details</Heading>
                <Text fontSize="sm" color="gray.500" fontWeight="400" sx={{ mb: 0 }}>Review complete submission information</Text>
              </VStack>
              <Badge
                colorScheme={selectedRequest ? getStatusInfo(selectedRequest.status).colorScheme : "gray"}
                variant="solid"
                px={4}
                py={1.5}
                borderRadius="full"
                fontSize="xs"
                mr={8}
              >
                {selectedRequest?.status || "Unknown"}
              </Badge>
            </Flex>
          </ModalHeader>
          <ModalCloseButton mt={2} bg="lightgray" />
          <ModalBody p={8}>
            {selectedRequest && (
              <VStack spacing={8} align="stretch">
                {/* Proposal Info Section */}
                <Box>
                  <Heading size="xs" textTransform="uppercase" letterSpacing="wider" color="gray.400" mb={4}>
                    Category Information
                  </Heading>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} >
                    <VStack align="flex-start" spacing={1} sx={{ border: "1px solid #ccc", borderRadius: "10px", p: 3 }}>
                      <Text fontSize="xs" fontWeight="700" color="gray.500" sx={{ mb: 0 }}>REQUESTED CATEGORY</Text>
                      <Text fontWeight="600" fontSize="lg" sx={{ mb: 0 }}>{selectedRequest.categoryName}</Text>
                    </VStack>
                    <VStack align="flex-start" spacing={1} sx={{ border: "1px solid #ccc", borderRadius: "10px", p: 3 }}>
                      <Text fontSize="xs" fontWeight="700" color="gray.500" sx={{ mb: 0 }}>REQUEST REASON</Text>
                      <Text fontWeight="500" sx={{ mb: 0 }}>{selectedRequest.reason}</Text>
                    </VStack>
                  </SimpleGrid>

                  <VStack align="flex-start" spacing={2} mt={3} sx={{ border: "1px solid #ccc", borderRadius: "10px", p: 3 }}>
                    <Text fontSize="xs" fontWeight="700" color="gray.500" sx={{ mb: 0 }}>SUBCATEGORIES</Text>
                    <HStack spacing={2} flexWrap="wrap">
                      {selectedRequest.subCategories?.map((sub, i) => (
                        <Badge key={i} variant="subtle" colorScheme="blue" px={3} py={1} borderRadius="md" textTransform="none">
                          {sub}
                        </Badge>
                      ))}
                      {(!selectedRequest.subCategories || selectedRequest.subCategories.length === 0) && (
                        <Text color="gray.400" fontStyle="italic">No subcategories provided</Text>
                      )}
                    </HStack>
                  </VStack>

                  {selectedRequest.description && (
                    <VStack align="flex-start" spacing={2} mt={3} sx={{ border: "1px solid #ccc", borderRadius: "10px", p: 3 }}>
                      <Text fontSize="xs" fontWeight="700" color="gray.500" sx={{ mb: 0 }}>DESCRIPTION</Text>
                      <Text fontSize="sm" color="gray.700" lineHeight="tall" sx={{ mb: 0 }}>{selectedRequest.description}</Text>
                    </VStack>
                  )}
                </Box>

                <Box height="1px" bg="gray.100" />

                {/* Vendor Info Section */}
                <Box>
                  <Heading size="xs" textTransform="uppercase" letterSpacing="wider" color="gray.400" mb={4}>
                    Vendor Information
                  </Heading>
                  <Flex align="center" mb={6}>
                    <Box mr={4}>
                      {selectedRequest.vendorId?.image?.[0] ? (
                        <Image
                          width={60}
                          height={60}
                          style={{ width: "60px", height: "60px", borderRadius: "16px", objectFit: "cover" }}
                          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${selectedRequest.vendorId.image[0]}`}
                          alt={selectedRequest.vendorId?.salonName || "Vendor"}
                        />
                      ) : (
                        <Box
                          w="60px"
                          h="60px"
                          borderRadius="16px"
                          bg="blue.500"
                          color="white"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          fontSize="2xl"
                          fontWeight="bold"
                        >
                          {(selectedRequest.vendorId?.salonName || selectedRequest.vendorId?.name || "?").charAt(0).toUpperCase()}
                        </Box>
                      )}
                    </Box>
                    <VStack align="flex-start" spacing={0}>
                      <Text fontWeight="800" fontSize="xl" sx={{ mb: 0 }}>{selectedRequest.vendorId?.salonName || "Salon Name Not Provided"}</Text>
                      <Text color="gray.500" fontWeight="500" sx={{ mb: 0 }}>Owner: {selectedRequest.vendorId?.name || "N/A"}</Text>
                    </VStack>
                  </Flex>

                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <VStack align="flex-start" spacing={1} sx={{ border: "1px solid #ccc", borderRadius: "10px", p: 3 }}>
                      <Text fontSize="xs" fontWeight="700" color="gray.500" sx={{ mb: 0 }}>EMAIL ADDRESS</Text>
                      <Text fontWeight="500" sx={{ mb: 0 }}>{selectedRequest.vendorId?.bussinessEmail || selectedRequest.vendorId?.email || "N/A"}</Text>
                    </VStack>
                    <VStack align="flex-start" spacing={1} sx={{ border: "1px solid #ccc", borderRadius: "10px", p: 3 }}>
                      <Text fontSize="xs" fontWeight="700" color="gray.500" sx={{ mb: 0 }}>PHONE NUMBER</Text>
                      <Text fontWeight="500" sx={{ mb: 0 }}>{selectedRequest.vendorId?.bussinessPhoneNumber || selectedRequest.vendorId?.phoneNumber || "N/A"}</Text>
                    </VStack>
                    <VStack align="flex-start" spacing={1} gridColumn={{ md: "span 2" }} sx={{ border: "1px solid #ccc", borderRadius: "10px", p: 3 }}>
                      <Text fontSize="xs" fontWeight="700" color="gray.500" sx={{ mb: 0 }}>BUSINESS ADDRESS</Text>
                      <Text fontWeight="500" sx={{ mb: 0 }}>{selectedRequest.vendorId?.bussinessAddress || selectedRequest.vendorId?.locationName || "N/A"}</Text>
                      {selectedRequest.vendorId?.city && (
                        <Text fontSize="sm" color="gray.500" sx={{ mb: 0 }}>
                          {selectedRequest.vendorId.city}, {selectedRequest.vendorId.state} {selectedRequest.vendorId.zipCode}
                        </Text>
                      )}
                    </VStack>
                  </SimpleGrid>
                </Box>

                {/* Status/Rejection Section if applicable */}
                {selectedRequest.status?.toLowerCase() === "rejected" && (
                  <>
                    <Box height="1px" bg="gray.100" />
                    <Box p={5} bg="red.50" borderRadius="xl" border="1px solid" borderColor="red.100">
                      <HStack spacing={3} mb={2}>
                        {/* <Icon as={FaTimesCircle} color="red.500" /> */}
                        <Text fontWeight="800" color="red.700" fontSize="sm" textTransform="uppercase" sx={{ mb: 0 }}>Rejection Details</Text>
                      </HStack>
                      <Text color="red.600" fontSize="sm" fontWeight="500" sx={{ mb: 0 }}>
                        {selectedRequest.rejectionReason || "No rejection reason provided."}
                      </Text>
                    </Box>
                  </>
                )}
              </VStack>
            )}
          </ModalBody>
          <ModalFooter bg="gray.50" borderTop="1px solid" borderColor="gray.100" py={4}>
            <HStack spacing={3} w="100%" justify="flex-end">
              <Button bg="#000" color="#fff" onClick={onViewClose}>Close</Button>
              {selectedRequest?.status?.toLowerCase() === "pending" && (
                <>
                  <Button
                    colorScheme="red"
                    variant="outline"
                    leftIcon={<FaTimes />}
                    onClick={() => {
                      onViewClose();
                      handleOpenRejectModal(selectedRequest._id);
                    }}
                  >
                    Reject
                  </Button>
                  <Button
                    colorScheme="green"
                    leftIcon={<FaCheck />}
                    onClick={() => {
                      updateStatus(selectedRequest._id, "Approved");
                      onViewClose();
                    }}
                  >
                    Approve Proposal
                  </Button>
                </>
              )}
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AdminCategoryRequestPage;
