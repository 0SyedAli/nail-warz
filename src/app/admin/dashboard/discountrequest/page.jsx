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
  Input,
  useDisclosure,
  Divider,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import {
  FaCheck,
  FaTimes,
  FaInfoCircle,
  FaHourglassHalf,
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaSearch,
  FaTag,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Image from "next/image";
import moment from "moment";

const BookingDiscountRequestPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  // Modals disclosure
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  const { isOpen: isApproveOpen, onOpen: onApproveOpen, onClose: onApproveClose } = useDisclosure();
  const { isOpen: isRejectOpen, onOpen: onRejectOpen, onClose: onRejectClose } = useDisclosure();

  // Selected request for view/approve/reject actions
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Form states
  const [couponCode, setCouponCode] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  const router = useRouter();

  // Authentication guard
  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) return router.push("/admin/auth/login");
    fetchRequests();
  }, [router]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = Cookies.get("token");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/booking-discount-request`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.success) {
        setRequests(response.data.data || []);
      } else {
        throw new Error(response.data.msg || "Failed to fetch booking discount requests.");
      }
    } catch (err) {
      const message = err?.response?.data?.msg || err?.message || "Failed to load discount requests.";
      setError(message);
      toast.error(message, { autoClose: 2000 });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status, extraPayload = {}) => {
    try {
      setUpdatingId(id);
      const token = Cookies.get("token");
      const payload = { status, ...extraPayload };

      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/booking-discount-request/${id}/status`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response?.data?.success) {
        toast.success(`Discount request successfully updated to ${status}!`, { autoClose: 1500 });
        // Refresh local requests list
        fetchRequests();
        // Close modals
        onApproveClose();
        onRejectClose();
      } else {
        throw new Error(response?.data?.msg || `Failed to update status to ${status}`);
      }
    } catch (err) {
      const message = err?.response?.data?.msg || err?.message || `Error updating status to ${status}`;
      toast.error(message, { autoClose: 2000 });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleOpenApproveModal = (req) => {
    setSelectedRequest(req);
    setCouponCode("");
    onApproveOpen();
  };

  const handleConfirmApprove = (e) => {
    e.preventDefault();
    if (!couponCode.trim()) {
      toast.warning("Please enter a coupon code.");
      return;
    }
    handleStatusUpdate(selectedRequest._id, "Approved", { code: couponCode.trim().toUpperCase() });
  };

  const handleOpenRejectModal = (req) => {
    setSelectedRequest(req);
    setRejectionReason("");
    onRejectOpen();
  };

  const handleConfirmReject = (e) => {
    e.preventDefault();
    if (!rejectionReason.trim()) {
      toast.warning("Please enter a rejection reason.");
      return;
    }
    handleStatusUpdate(selectedRequest._id, "Rejected", { rejectionReason: rejectionReason.trim() });
  };

  const handleOpenViewModal = (req) => {
    setSelectedRequest(req);
    onViewOpen();
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
        return { colorScheme: "gray", icon: FaInfoCircle, label: status || "Unknown" };
    }
  };

  // Filter requests based on search query
  const filteredRequests = requests.filter((req) => {
    const salonName = req.vendorId?.salonName || "";
    const vendorName = req.vendorId?.name || "";
    const email = req.vendorId?.email || "";
    const desc = req.description || "";
    const query = search.toLowerCase();

    return (
      salonName.toLowerCase().includes(query) ||
      vendorName.toLowerCase().includes(query) ||
      email.toLowerCase().includes(query) ||
      desc.toLowerCase().includes(query)
    );
  });

  // Calculate statistics
  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status?.toLowerCase() === "pending").length,
    approved: requests.filter((r) => r.status?.toLowerCase() === "approved").length,
    rejected: requests.filter((r) => r.status?.toLowerCase() === "rejected").length,
  };

  return (
    <Box py={8}>
      <Box className="discount-requests-container">
        {/* Header */}
        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align={{ base: "flex-start", md: "center" }}
          mb={8}
        >
          <VStack align="flex-start" spacing={1}>
            <Heading size="lg" fontWeight="800" letterSpacing="tight">
              Booking Discount Proposals
            </Heading>
            <Text color="gray.500">
              Manage discount requests submitted by vendors for service bookings.
            </Text>
          </VStack>
        </Flex>

        {/* Stats Section */}
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={6} mb={10}>
          <Box bg="white" p={6} borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="gray.100">
            <Stat>
              <StatLabel color="gray.500" fontWeight="600" fontSize="sm">Total Proposals</StatLabel>
              <StatNumber fontSize="3xl" fontWeight="800" color="blue.500">{stats.total}</StatNumber>
            </Stat>
          </Box>
          <Box bg="white" p={6} borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="gray.100">
            <Stat>
              <StatLabel color="gray.500" fontWeight="600" fontSize="sm">Pending Review</StatLabel>
              <StatNumber fontSize="3xl" fontWeight="800" color="yellow.500">{stats.pending}</StatNumber>
            </Stat>
          </Box>
          <Box bg="white" p={6} borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="gray.100">
            <Stat>
              <StatLabel color="gray.500" fontWeight="600" fontSize="sm">Approved Discounts</StatLabel>
              <StatNumber fontSize="3xl" fontWeight="800" color="green.500">{stats.approved}</StatNumber>
            </Stat>
          </Box>
          <Box bg="white" p={6} borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="gray.100">
            <Stat>
              <StatLabel color="gray.500" fontWeight="600" fontSize="sm">Rejected Proposals</StatLabel>
              <StatNumber fontSize="3xl" fontWeight="800" color="red.500">{stats.rejected}</StatNumber>
            </Stat>
          </Box>
        </SimpleGrid>

        {/* Search & Main Table */}
        <Box bg="white" borderRadius="2xl" boxShadow="xl" overflow="hidden" border="1px solid" borderColor="gray.100">
          <Flex p={4} borderBottom="1px solid" borderColor="gray.100" bg="gray.50" align="center">
            <HStack spacing={2} w="full" maxW="400px">
              <Icon as={FaSearch} color="gray.400" />
              <Input
                placeholder="Search by salon, vendor, email or desc..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                bg="white"
                size="md"
                borderRadius="lg"
                focusBorderColor="#C11111"
              />
            </HStack>
          </Flex>

          {loading ? (
            <Flex justify="center" align="center" py={20}>
              <VStack spacing={4}>
                <Box className="spinner-border text-danger" role="status" />
                <Text fontWeight="600" color="gray.500">Loading discount proposals...</Text>
              </VStack>
            </Flex>
          ) : error ? (
            <Flex justify="center" align="center" py={20}>
              <VStack spacing={4}>
                <Icon as={FaTimesCircle} color="red.500" boxSize={12} />
                <Text fontWeight="600" color="red.500">{error}</Text>
                <Button onClick={fetchRequests} variant="outline" colorScheme="red" borderColor="#C11111" color="#C11111" _hover={{ bg: "#fff5f5" }}>
                  Retry
                </Button>
              </VStack>
            </Flex>
          ) : filteredRequests.length === 0 ? (
            <Flex justify="center" align="center" py={20} direction="column">
              <VStack spacing={6}>
                <Box p={8} bg="gray.50" borderRadius="full">
                  <Icon as={FaCheckCircle} color="gray.300" boxSize={16} />
                </Box>
                <VStack spacing={2}>
                  <Heading size="md" color="gray.700">No proposals found</Heading>
                  <Text color="gray.500">There are no discount proposals matching your criteria.</Text>
                </VStack>
              </VStack>
            </Flex>
          ) : (
            <Box overflowX="auto">
              <Table variant="simple">
                <Thead bg="gray.50">
                  <Tr>
                    <Th color="gray.700" py={5}>Vendor / Salon</Th>
                    <Th color="gray.700" py={5}>Discount Type</Th>
                    <Th color="gray.700" py={5}>Discount Value</Th>
                    <Th color="gray.700" py={5}>Validity Period</Th>
                    <Th color="gray.700" py={5}>Status</Th>
                    <Th color="gray.700" py={5} textAlign="right">Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredRequests.map((req) => {
                    const status = getStatusInfo(req.status);
                    const vendorName = req.vendorId?.salonName || req.vendorId?.name || "Unknown Vendor";
                    const isPending = req.status?.toLowerCase() === "pending";

                    return (
                      <Tr key={req._id} _hover={{ bg: "gray.50" }} transition="background 0.2s">
                        <Td>
                          <HStack spacing={3}>
                            {req.vendorId?.image?.[0] ? (
                              <div style={{ position: "relative", width: "40px", height: "40px", borderRadius: "50%", overflow: "hidden" }}>
                                <Image
                                  fill
                                  style={{ objectFit: "cover" }}
                                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${req.vendorId.image[0]}`}
                                  alt={vendorName}
                                />
                              </div>
                            ) : (
                              <div
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  borderRadius: "50%",
                                  backgroundColor: "#C11111",
                                  color: "#fff",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontWeight: "bold",
                                  fontSize: "16px",
                                  textTransform: "uppercase"
                                }}
                              >
                                {vendorName.charAt(0)}
                              </div>
                            )}
                            <VStack align="flex-start" spacing={0}>
                              <Text fontWeight="700" color="gray.800" fontSize="sm" mb={0}>
                                {req.vendorId?.salonName || "No Salon Name"}
                              </Text>
                              <Text fontSize="xs" color="gray.500" mb={0}>
                                {req.vendorId?.name || "No Owner Name"}
                              </Text>
                            </VStack>
                          </HStack>
                        </Td>
                        <Td>
                          <Badge colorScheme={req.type === "percentage" ? "purple" : "orange"} textTransform="none" borderRadius="md" px={2} py={0.5}>
                            {req.type ? req.type.charAt(0).toUpperCase() + req.type.slice(1) : "N/A"}
                          </Badge>
                        </Td>
                        <Td>
                          <Text fontWeight="800" color="#C11111" mb={0}>
                            {req.type === "percentage" ? `${req.value}%` : `$${req.value}`}
                          </Text>
                        </Td>
                        <Td>
                          <VStack align="flex-start" flexWrap="no-wrap" flexDirection="row" spacing={1}>
                            <Text fontSize="xs" fontWeight="600" color="gray.700" mb={0}>
                              {req.startedAt ? moment(req.startedAt).local().format("DD-MM-YYYY") : "N/A"} &nbsp; - &nbsp;
                            </Text>
                            <Text fontSize="xs" fontWeight="600" color="gray.700" mb={0}>
                              {req.endedAt ? moment(req.endedAt).local().format("DD-MM-YYYY") : "N/A"}
                            </Text>
                          </VStack>
                        </Td>
                        <Td>
                          <Badge colorScheme={status.colorScheme} px={3} py={1} borderRadius="full" fontSize="xs" fontWeight="700">
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
                                    onClick={() => handleOpenApproveModal(req)}
                                    isLoading={updatingId === req._id}
                                    aria-label="Approve"
                                  />
                                </Tooltip>
                                <Tooltip label="Reject Proposal" hasArrow>
                                  <IconButton
                                    icon={<FaTimes />}
                                    colorScheme="red"
                                    size="sm"
                                    onClick={() => handleOpenRejectModal(req)}
                                    isLoading={updatingId === req._id}
                                    aria-label="Reject"
                                  />
                                </Tooltip>
                              </>
                            ) : (
                              <Badge bg="white" color="gray.400" border="1px solid" borderColor="gray.200" px={3} py={1} borderRadius="full" fontSize="xs" fontWeight="600">
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

      {/* View Details Modal */}
      <Modal isOpen={isViewOpen} onClose={onViewClose} size="xl" scrollBehavior="inside" isCentered>
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent borderRadius="2xl" overflow="hidden">
          <ModalHeader bg="gray.50" borderBottom="1px solid" borderColor="gray.100" py={5}>
            <Flex justify="space-between" align="center">
              <VStack align="flex-start" spacing={0}>
                <Heading size="md" fontWeight="800">Proposal Details</Heading>
                <Text fontSize="xs" color="gray.500" mb={0}>Review complete submission information</Text>
              </VStack>
              <Badge
                colorScheme={selectedRequest ? getStatusInfo(selectedRequest.status).colorScheme : "gray"}
                px={3}
                py={1}
                borderRadius="full"
                fontSize="xs"
                mr={8}
              >
                {selectedRequest?.status || "Unknown"}
              </Badge>
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody p={6} className="bg-white">
            {selectedRequest && (
              <VStack spacing={6} align="stretch" className="p-4">
                {/* Vendor Details */}
                <Box>
                  <Heading size="xs" textTransform="uppercase" letterSpacing="wider" color="gray.400" mb={3}>
                    Vendor Details
                  </Heading>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <Box bg="gray.50" p={3} borderRadius="lg" border="1px solid" borderColor="gray.100">
                      <Text fontSize="10px" fontWeight="700" color="gray.500" mb={0}>SALON NAME</Text>
                      <Text fontWeight="700" color="gray.800" mb={0}>{selectedRequest.vendorId?.salonName || "N/A"}</Text>
                    </Box>
                    <Box bg="gray.50" p={3} borderRadius="lg" border="1px solid" borderColor="gray.100">
                      <Text fontSize="10px" fontWeight="700" color="gray.500" mb={0}>OWNER NAME</Text>
                      <Text fontWeight="600" color="gray.800" mb={0}>{selectedRequest.vendorId?.name || "N/A"}</Text>
                    </Box>
                    <Box bg="gray.50" p={3} borderRadius="lg" border="1px solid" borderColor="gray.100">
                      <Text fontSize="10px" fontWeight="700" color="gray.500" mb={0}>BUSINESS EMAIL</Text>
                      <Text fontWeight="600" color="gray.800" mb={0}>{selectedRequest.vendorId?.email || "N/A"}</Text>
                    </Box>
                    <Box bg="gray.50" p={3} borderRadius="lg" border="1px solid" borderColor="gray.100">
                      <Text fontSize="10px" fontWeight="700" color="gray.500" mb={0}>PHONE NUMBER</Text>
                      <Text fontWeight="600" color="gray.800" mb={0}>{selectedRequest.vendorId?.phoneNumber || "N/A"}</Text>
                    </Box>
                    <Box bg="gray.50" p={3} borderRadius="lg" border="1px solid" borderColor="gray.100" gridColumn={{ md: "span 2" }}>
                      <Text fontSize="10px" fontWeight="700" color="gray.500" mb={0}>BUSINESS ADDRESS</Text>
                      <Text fontWeight="600" color="gray.800" mb={0}>{selectedRequest.vendorId?.bussinessAddress || "N/A"}</Text>
                    </Box>
                  </SimpleGrid>
                </Box>

                <Divider />

                {/* Discount details */}
                <Box>
                  <Heading size="xs" textTransform="uppercase" letterSpacing="wider" color="gray.400" mb={3}>
                    Discount Information
                  </Heading>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <Box bg="gray.50" p={3} borderRadius="lg" border="1px solid" borderColor="gray.100">
                      <Text fontSize="10px" fontWeight="700" color="gray.500" mb={0}>DISCOUNT VALUE</Text>
                      <Text fontWeight="800" fontSize="lg" color="#C11111" mb={0}>
                        {selectedRequest.type === "percentage" ? `${selectedRequest.value}%` : `$${selectedRequest.value}`}
                      </Text>
                    </Box>
                    <Box bg="gray.50" p={3} borderRadius="lg" border="1px solid" borderColor="gray.100">
                      <Text fontSize="10px" fontWeight="700" color="gray.500" mb={0}>DISCOUNT TYPE</Text>
                      <Badge colorScheme="purple" mt={1} mb={0}>{selectedRequest.type}</Badge>
                    </Box>
                    <Box bg="gray.50" p={3} borderRadius="lg" border="1px solid" borderColor="gray.100">
                      <Text fontSize="10px" fontWeight="700" color="gray.500" mb={0}>START DATE</Text>
                      <Text fontWeight="600" color="gray.800" mb={0}>
                        {selectedRequest.startedAt ? moment(selectedRequest.startedAt).local().format("YYYY-MM-DD hh:mm A") : "N/A"}
                      </Text>
                    </Box>
                    <Box bg="gray.50" p={3} borderRadius="lg" border="1px solid" borderColor="gray.100">
                      <Text fontSize="10px" fontWeight="700" color="gray.500" mb={0}>END DATE</Text>
                      <Text fontWeight="600" color="gray.800" mb={0}>
                        {selectedRequest.endedAt ? moment(selectedRequest.endedAt).local().format("YYYY-MM-DD hh:mm A") : "N/A"}
                      </Text>
                    </Box>
                    {selectedRequest.description && (
                      <Box bg="gray.50" p={3} borderRadius="lg" border="1px solid" borderColor="gray.100" gridColumn={{ md: "span 2" }}>
                        <Text fontSize="10px" fontWeight="700" color="gray.500" mb={0}>DESCRIPTION</Text>
                        <Text fontWeight="500" color="gray.700" fontSize="sm" mb={0}>{selectedRequest.description}</Text>
                      </Box>
                    )}
                  </SimpleGrid>
                </Box>

                {/* Decisions metadata */}
                {(selectedRequest.createdDiscountCodeId?.code || selectedRequest.rejectionReason) && (
                  <>
                    <Divider />
                    <Box>
                      <Heading size="xs" textTransform="uppercase" letterSpacing="wider" color="gray.400" mb={3}>
                        Decision Details
                      </Heading>
                      {selectedRequest.status?.toLowerCase() === "approved" && selectedRequest.createdDiscountCodeId?.code && (
                        <Box bg="green.50" p={4} borderRadius="lg" borderLeft="4px solid" borderColor="green.500">
                          <HStack spacing={2} mb={1}>
                            <Icon as={FaTag} color="green.600" />
                            <Text fontSize="xs" fontWeight="700" color="green.700" mb={0}>APPROVED COUPON CODE</Text>
                          </HStack>
                          <Text fontWeight="800" fontSize="lg" color="green.800" mb={0}>{selectedRequest.createdDiscountCodeId?.code}</Text>
                        </Box>
                      )}
                      {selectedRequest.status?.toLowerCase() === "rejected" && selectedRequest.rejectionReason && (
                        <Box bg="red.50" p={4} borderRadius="lg" borderLeft="4px solid" borderColor="red.500">
                          <Text fontSize="xs" fontWeight="700" color="red.700" mb={1}>REJECTION REASON</Text>
                          <Text fontWeight="500" color="red.800" fontSize="sm" mb={0}>{selectedRequest.rejectionReason}</Text>
                        </Box>
                      )}
                    </Box>
                  </>
                )}
              </VStack>
            )}
          </ModalBody>
          <ModalFooter bg="gray.50" py={4}>
            <Button colorScheme="blue" bg="#C11111" color="white" _hover={{ bg: "red.700" }} onClick={onViewClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Approve Modal */}
      <Modal isOpen={isApproveOpen} onClose={onApproveOpen} isCentered >

        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent borderRadius="xl" p={6} className="dra_modal_wrapper">
          <ModalHeader fontWeight="800" px={0} py={2} display="flex" alignItems="center" gap={2}>
            <Icon as={FaCheckCircle} color="green.500" />
            Approve Discount Request
          </ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleConfirmApprove}>
            <ModalBody px={0} py={4}>
              <VStack align="flex-start" spacing={4}>
                <Text color="gray.600" fontSize="sm">
                  Please generate or assign a coupon code for this discount proposal. This code will be sent to the vendor and applied to service bookings.
                </Text>
                <FormControl isRequired>
                  <FormLabel fontWeight="700" fontSize="xs" color="gray.500">COUPON CODE</FormLabel>
                  <Input
                    placeholder="e.g. DISCOUNT20, NAILWARZ5"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    focusBorderColor="green.500"
                    borderRadius="lg"
                    size="lg"
                    textTransform="uppercase"
                  />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter px={0} pb={0} pt={4}>
              <HStack spacing={3} w="full" justify="flex-end">
                <Button variant="ghost" onClick={onApproveClose}>Cancel</Button>
                <Button
                  colorScheme="green"
                  type="submit"
                  isLoading={updatingId === selectedRequest?._id}
                  fontWeight="bold"
                >
                  Approve & Activate
                </Button>
              </HStack>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      {/* Reject Modal */}
      <Modal isOpen={isRejectOpen} onClose={onRejectClose} isCentered>
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent borderRadius="xl" p={6} className="dra_modal_wrapper">
          <ModalHeader fontWeight="800" px={0} py={2} display="flex" alignItems="center" gap={2}>
            <Icon as={FaTimesCircle} color="red.500" />
            Reject Discount Request
          </ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleConfirmReject}>
            <ModalBody px={0} py={4}>
              <VStack align="flex-start" spacing={4}>
                <Text color="gray.600" fontSize="sm">
                  Please provide a reason for rejecting this discount proposal. This information will be sent to the vendor.
                </Text>
                <FormControl isRequired>
                  <FormLabel fontWeight="700" fontSize="xs" color="gray.500">REJECTION REASON</FormLabel>
                  <Textarea
                    placeholder="Enter reason here..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    focusBorderColor="red.500"
                    borderRadius="lg"
                    rows={4}
                    resize="none"
                  />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter px={0} pb={0} pt={4}>
              <HStack spacing={3} w="full" justify="flex-end">
                <Button variant="ghost" onClick={onRejectClose}>Cancel</Button>
                <Button
                  colorScheme="red"
                  type="submit"
                  isLoading={updatingId === selectedRequest?._id}
                  bg="red.500"
                  _hover={{ bg: "red.600" }}
                  fontWeight="bold"
                >
                  Confirm Rejection
                </Button>
              </HStack>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default BookingDiscountRequestPage;
