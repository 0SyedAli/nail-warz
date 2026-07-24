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
    useDisclosure,
    SimpleGrid,
    Stat,
    StatLabel,
    StatNumber,
    IconButton,
    Tooltip,
    Input,
    InputGroup,
    InputLeftElement,
    Skeleton,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { IoMdAdd, IoMdSearch } from "react-icons/io";
import { BsPencil, BsTrash, BsInfoCircle, BsTag } from "react-icons/bs";
import axios from "axios";
import { toast } from "react-toastify";
import BookingDiscountModal from "@/components/Modal/BookingDiscountModal";
import BookingDiscountDetailModal from "@/components/Modal/BookingDiscountDetailModal";
import React from "react";
import moment from "moment";
const BookingDiscountManagement = () => {
    const router = useRouter();
    const [discounts, setDiscounts] = useState([]);
    const [discountObject, setDiscountObject] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");

    const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure();
    const { isOpen: isDetailOpen, onOpen: onDetailOpen, onClose: onDetailClose } = useDisclosure();
    const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onClose: onConfirmClose } = useDisclosure();
    const cancelRef = React.useRef();

    const [selectedDiscount, setSelectedDiscount] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    // 🔐 Auth Guard & Initial Load
    useEffect(() => {
        if (!Cookies.get("token")) return router.push("/admin/auth/login");
        fetchDiscounts();
    }, [router]);

    const fetchDiscounts = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/booking-discount`, {
                headers: { Authorization: `Bearer ${Cookies.get("token")}` },
            });
            if (res.data.success) {
                const list = res.data.bookingDiscounts || res.data.discountCodes || res.data.discounts || res.data.data || [];
                setDiscounts(list);
                setDiscountObject(res.data);
            } else {
                throw new Error("Failed to load booking discount codes.");
            }
        } catch (e) {
            setError(e.message);
            toast.error(e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/booking-discount/${deleteId}`, {
                headers: { Authorization: `Bearer ${Cookies.get("token")}` },
            });
            if (res.data.success) {
                toast.success("Booking discount deleted successfully!");
                fetchDiscounts();
            } else {
                throw new Error("Failed to delete booking discount.");
            }
        } catch (e) {
            toast.error(e.message);
        } finally {
            onConfirmClose();
            setDeleteId(null);
        }
    };

    const filteredDiscounts = discounts.filter(d =>
        d.code?.toLowerCase().includes(search.toLowerCase()) ||
        d.description?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Box py={8}>
            <Box className="category-request-page">
                {/* Header */}
                <Flex direction={{ base: "column", md: "row" }} justify="space-between" align={{ base: "flex-start", md: "center" }} mb={10}>
                    <VStack align="flex-start" spacing={1}>
                        <Heading size="lg" fontWeight="800" letterSpacing="tight">Booking Discount</Heading>
                        <Text color="gray.500">Create and manage coupon codes for service bookings.</Text>
                    </VStack>
                    <Button
                        leftIcon={<IoMdAdd size={22} />}
                        bg="#C11111"
                        color="white"
                        size="lg"
                        px={8}
                        borderRadius="md"
                        _hover={{ bg: "red.700", transform: "translateY(-2px)" }}
                        _active={{ transform: "scale(0.98)" }}
                        onClick={() => {
                            setSelectedDiscount(null);
                            onFormOpen();
                        }}
                    >
                        Create Discount
                    </Button>
                </Flex>

                {/* Stats */}
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={10}>
                    <StatBox title="Total Codes" value={discountObject?.count || discounts.length} color="green.500" />
                </SimpleGrid>

                {/* Main Content */}
                <Box bg="white" borderRadius="xl" boxShadow="sm" border="1px solid #eee" overflow="hidden">
                    <Flex p={4} borderBottom="1px solid #eee" bg="gray.50">
                        <InputGroup maxW="400px">
                            <InputLeftElement children={<IoMdSearch color="gray.300" />} />
                            <Input
                                placeholder="Search by code or description…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                bg="white"
                            />
                        </InputGroup>
                    </Flex>

                    <Table variant="simple">
                        <Thead bg="gray.100">
                            <Tr>
                                <Th>Discount Code</Th>
                                <Th>Type & Value</Th>
                                <Th>Funding Type</Th>
                                <Th>Usage</Th>
                                <Th>Validity Period</Th>
                                <Th>Status</Th>
                                <Th textAlign="right">Actions</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <Tr key={i}>
                                        <Td><Skeleton height="20px" width="100px" /></Td>
                                        <Td><Skeleton height="20px" width="100px" /></Td>
                                        <Td><Skeleton height="20px" width="80px" /></Td>
                                        <Td><Skeleton height="20px" width="80px" /></Td>
                                        <Td><Skeleton height="20px" width="120px" /></Td>
                                        <Td><Skeleton height="20px" width="60px" /></Td>
                                        <Td><Skeleton height="20px" width="100px" ml="auto" /></Td>
                                    </Tr>
                                ))
                            ) : filteredDiscounts.length === 0 ? (
                                <Tr>
                                    <Td colSpan={7} py={20} textAlign="center">
                                        <VStack spacing={2}>
                                            <Icon as={BsTag} boxSize={10} color="gray.300" />
                                            <Text fontWeight="600" color="gray.500">No booking discounts found.</Text>
                                        </VStack>
                                    </Td>
                                </Tr>
                            ) : (
                                filteredDiscounts.map(d => (
                                    <Tr key={d._id} _hover={{ bg: "gray.50" }} transition="background 0.2s">
                                        <Td>
                                            <Text fontWeight="800" color="gray.800">{d.code}</Text>
                                            <Text fontSize="xs" color="gray.500" noOfLines={1} maxW="200px">{d.description || "No description"}</Text>
                                        </Td>
                                        <Td>
                                            <VStack align="flex-start" spacing={0}>
                                                <Badge colorScheme={d.type === "percentage" ? "purple" : "orange"} textTransform="none">
                                                    {d.type ? (d.type.charAt(0).toUpperCase() + d.type.slice(1)) : "N/A"}
                                                </Badge>
                                                <Text fontWeight="700" fontSize="sm">
                                                    {d.type === "percentage" ? `${d.value}%` : `$${d.value}`}
                                                </Text>
                                            </VStack>
                                        </Td>
                                        <Td>
                                            <Badge colorScheme={d.fundingType === "Platform" ? "blue" : "teal"} textTransform="none">
                                                {d.fundingType || "Platform"}
                                            </Badge>
                                        </Td>
                                        <Td>
                                            <VStack align="flex-start" spacing={0}>
                                                <Text fontSize="sm" fontWeight="600">{d.usedCount || 0} used</Text>
                                                <Text fontSize="12px" color="gray.400">Limit: {d.maxUses !== null && d.maxUses !== undefined ? d.maxUses : "Unlimited"}</Text>
                                            </VStack>
                                        </Td>
                                        <Td>
                                            <VStack align="flex-start" spacing={0}>
                                                <Text fontSize="sm" fontWeight="500">
                                                    {d.startedAt
                                                        ? moment(d.startedAt).local().format("DD-MM-YYYY")
                                                        : "N/A"}
                                                    {" - "}
                                                    {d.endedAt
                                                        ? moment(d.endedAt).local().format("DD-MM-YYYY")
                                                        : "N/A"}
                                                </Text>

                                                <Text fontSize="xs" color="gray.500">
                                                    {d.startedAt
                                                        ? moment(d.startedAt).local().format("hh:mm A")
                                                        : ""}
                                                    {" - "}
                                                    {d.endedAt
                                                        ? moment(d.endedAt).local().format("hh:mm A")
                                                        : ""}
                                                </Text>
                                            </VStack>
                                        </Td>
                                        <Td>
                                            <Badge colorScheme={d.isActive !== false ? "green" : "red"} borderRadius="full" px={2}>
                                                {d.isActive !== false ? "Active" : "Inactive"}
                                            </Badge>
                                        </Td>
                                        <Td textAlign="right">
                                            <HStack justify="flex-end" spacing={2}>
                                                <Tooltip label="View Details" hasArrow>
                                                    <IconButton
                                                        icon={<BsInfoCircle />}
                                                        size="sm"
                                                        variant="ghost"
                                                        colorScheme="blue"
                                                        onClick={() => {
                                                            setSelectedDiscount(d);
                                                            onDetailOpen();
                                                        }}
                                                    />
                                                </Tooltip>
                                                <Tooltip label="Edit" hasArrow>
                                                    <IconButton
                                                        icon={<BsPencil />}
                                                        size="sm"
                                                        variant="ghost"
                                                        colorScheme="gray"
                                                        onClick={() => {
                                                            setSelectedDiscount(d);
                                                            onFormOpen();
                                                        }}
                                                    />
                                                </Tooltip>
                                                <Tooltip label="Delete" hasArrow>
                                                    <IconButton
                                                        icon={<BsTrash />}
                                                        size="sm"
                                                        variant="ghost"
                                                        colorScheme="red"
                                                        onClick={() => {
                                                            setDeleteId(d._id);
                                                            onConfirmOpen();
                                                        }}
                                                    />
                                                </Tooltip>
                                            </HStack>
                                        </Td>
                                    </Tr>
                                ))
                            )}
                        </Tbody>
                    </Table>
                </Box>
            </Box>

            {/* Modals */}
            <BookingDiscountModal
                isOpen={isFormOpen}
                onClose={onFormClose}
                discount={selectedDiscount}
                onSuccess={fetchDiscounts}
            />

            <BookingDiscountDetailModal
                isOpen={isDetailOpen}
                onClose={onDetailClose}
                discount={selectedDiscount}
            />

            <AlertDialog
                isOpen={isConfirmOpen}
                leastDestructiveRef={cancelRef}
                onClose={onConfirmClose}
                isCentered
            >
                <AlertDialogOverlay>
                    <AlertDialogContent borderRadius="xl" bg="white" >
                        <AlertDialogHeader fontSize="lg" fontWeight="800" bg="white" color="gray.800">
                            Delete Booking Discount
                        </AlertDialogHeader>

                        <AlertDialogBody bg="white" color="gray.700" fontWeight="500" fontSize="sm">
                            Are you sure you want to delete this booking discount code? This action cannot be undone and will prevent new users from using it.
                        </AlertDialogBody>

                        <AlertDialogFooter bg="white" gap={3}>
                            <Button ref={cancelRef} onClick={onConfirmClose} variant="ghost">
                                Cancel
                            </Button>
                            <Button
                                colorScheme="red"
                                onClick={handleDelete}
                                bg="#C11111"
                                _hover={{ bg: "red.700" }}
                                fontWeight="bold"
                            >
                                Delete Forever
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Box>
    );
};

const StatBox = ({ title, value, color }) => (
    <Box bg="white" p={6} borderRadius="xl" boxShadow="sm" border="1px solid #eee">
        <Stat>
            <StatLabel color="gray.500" fontWeight="600">{title}</StatLabel>
            <StatNumber fontSize="3xl" fontWeight="800" color={color}>{value}</StatNumber>
        </Stat>
    </Box>
);

export default BookingDiscountManagement;
