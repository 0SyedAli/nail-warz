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
    Container,
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
import DiscountModal from "@/components/Modal/DiscountModal";
import DiscountDetailModal from "@/components/Modal/DiscountDetailModal";
import React from "react";

const DiscountManagement = () => {
    const router = useRouter();
    const [discounts, setDiscounts] = useState([]);
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
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/discount`, {
                headers: { Authorization: `Bearer ${Cookies.get("token")}` },
            });
            if (res.data.success) {
                setDiscounts(res.data.discountCodes);
            } else {
                throw new Error("Failed to load discount codes.");
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
            const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/discount/${deleteId}`, {
                headers: { Authorization: `Bearer ${Cookies.get("token")}` },
            });
            if (res.data.success) {
                toast.success("Discount deleted successfully!");
                fetchDiscounts();
            } else {
                throw new Error("Failed to delete discount.");
            }
        } catch (e) {
            toast.error(e.message);
        } finally {
            onConfirmClose();
            setDeleteId(null);
        }
    };

    const filteredDiscounts = discounts.filter(d =>
        d.code.toLowerCase().includes(search.toLowerCase()) ||
        d.description?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Box py={8}>
            <Box className="category-request-page">
                {/* Header */}
                <Flex direction={{ base: "column", md: "row" }} justify="space-between" align={{ base: "flex-start", md: "center" }} mb={10}>
                    <VStack align="flex-start" spacing={1}>
                        <Heading size="lg" fontWeight="800" letterSpacing="tight">Discount Management</Heading>
                        <Text color="gray.500">Create and manage coupon codes for the eStore.</Text>
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
                    <StatBox title="Active Codes" value={discounts.filter(d => d.isActive).length} color="green.500" />
                    <StatBox title="Total Usages" value={discounts.reduce((acc, d) => acc + (d.usages?.length || 0), 0)} color="blue.500" />
                    <StatBox title="Expired" value={discounts.filter(d => new Date(d.expiryDate) < new Date()).length} color="red.500" />
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
                                <Th>Usage</Th>
                                <Th>Expiry</Th>
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
                                        <Td><Skeleton height="20px" width="100px" /></Td>
                                        <Td><Skeleton height="20px" width="60px" /></Td>
                                        <Td><Skeleton height="20px" width="100px" ml="auto" /></Td>
                                    </Tr>
                                ))
                            ) : filteredDiscounts.length === 0 ? (
                                <Tr>
                                    <Td colSpan={6} py={20} textAlign="center">
                                        <VStack spacing={2}>
                                            <Icon as={BsTag} boxSize={10} color="gray.300" />
                                            <Text fontWeight="600" color="gray.500">No discount codes found.</Text>
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
                                                    {d.type.charAt(0).toUpperCase() + d.type.slice(1)}
                                                </Badge>
                                                <Text fontWeight="700" fontSize="sm">
                                                    {d.type === "percentage" ? `${d.value}%` : `$${d.value}`}
                                                </Text>
                                            </VStack>
                                        </Td>
                                        <Td>
                                            <VStack align="flex-start" spacing={0}>
                                                <Text fontSize="sm" fontWeight="600">{d.usages?.length || 0} used</Text>
                                                <Text fontSize="10px" color="gray.400">Limit: {d.usageLimit || "∞"}</Text>
                                            </VStack>
                                        </Td>
                                        <Td>
                                            <Text fontSize="sm" fontWeight="500">
                                                {new Date(d.expiryDate).toLocaleDateString()}
                                            </Text>
                                            <Text fontSize="10px" color={new Date(d.expiryDate) < new Date() ? "red.500" : "gray.400"}>
                                                {new Date(d.expiryDate) < new Date() ? "EXPIRED" : "VALID"}
                                            </Text>
                                        </Td>
                                        <Td>
                                            <Badge colorScheme={d.isActive ? "green" : "red"} borderRadius="full" px={2}>
                                                {d.isActive ? "Active" : "Inactive"}
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
            <DiscountModal
                isOpen={isFormOpen}
                onClose={onFormClose}
                discount={selectedDiscount}
                onSuccess={fetchDiscounts}
            />

            <DiscountDetailModal
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
                            Delete Discount
                        </AlertDialogHeader>

                        <AlertDialogHeader bg="white" color="gray.700" fontWeight="500" fontSize="sm">
                            Are you sure you want to delete this discount code? This action cannot be undone and will prevent new users from using it.
                        </AlertDialogHeader>

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

export default DiscountManagement;
