"use client";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Box,
    FormControl,
    FormLabel,
    Input,
    Select,
    VStack,
    HStack,
    Text,
    Textarea,
    Badge,
    Divider,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { FaPercent, FaDollarSign, FaCalendarAlt } from "react-icons/fa";
import moment from "moment";
import { toast } from "react-toastify";

const DiscountRequestModal = ({
    isOpen,
    onClose,
    request,
    isViewOnly,
    onSuccess,
    vendorId,
}) => {
    const [formData, setFormData] = useState({
        type: "percentage",
        value: "",
        startDate: "",
        endDate: "",
        startTime: "00:00",
        endTime: "23:59",
        description: "",
    });

    const [loading, setLoading] = useState(false);

    // Populate form when viewing existing request
    useEffect(() => {
        if (request && isViewOnly) {
            const startMoment = request.startedAt
                ? moment(request.startedAt).local()
                : null;

            const endMoment = request.endedAt
                ? moment(request.endedAt).local()
                : null;

            setFormData({
                type: request.type || "percentage",
                value: request.value || "",
                startDate:
                    startMoment && startMoment.isValid()
                        ? startMoment.format("YYYY-MM-DD")
                        : "",
                startTime:
                    startMoment && startMoment.isValid()
                        ? startMoment.format("HH:mm")
                        : "00:00",
                endDate:
                    endMoment && endMoment.isValid()
                        ? endMoment.format("YYYY-MM-DD")
                        : "",
                endTime:
                    endMoment && endMoment.isValid()
                        ? endMoment.format("HH:mm")
                        : "23:59",
                description: request.description || "",
            });
        } else {
            setFormData({
                type: "percentage",
                value: "",
                startDate: "",
                endDate: "",
                startTime: "00:00",
                endTime: "23:59",
                description: "",
            });
        }
    }, [request, isViewOnly, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const combineDateTimeToISO = (date, time) => {
        const dateTime = moment(
            `${date} ${time}`,
            "YYYY-MM-DD HH:mm",
            true
        );

        if (!dateTime.isValid()) {
            throw new Error(`Invalid date/time: ${date} ${time}`);
        }

        return dateTime.toISOString();
    };

    const onSubmit = async (e) => {
        e?.preventDefault();

        if (!formData.startDate || !formData.endDate || !formData.value) {
            toast.error("Start Date, End Date, and Discount Value are required.");
            return;
        }

        setLoading(true);

        try {
            const startedAt = combineDateTimeToISO(
                formData.startDate,
                formData.startTime || "00:00"
            );

            const endedAt = combineDateTimeToISO(
                formData.endDate,
                formData.endTime || "23:59"
            );

            if (new Date(endedAt) <= new Date(startedAt)) {
                throw new Error("End date/time must be after start date/time");
            }

            const payload = {
                vendorId: vendorId,
                type: formData.type,
                value: Number(formData.value),
                startedAt: startedAt,
                endedAt: endedAt,
                description: formData.description?.trim() || "",
            };

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/booking-discount-request/`,
                payload
            );

            if (response?.data?.success) {
                toast.success("Discount request submitted successfully!");
                setFormData({
                    type: "percentage",
                    value: "",
                    startDate: "",
                    endDate: "",
                    startTime: "00:00",
                    endTime: "23:59",
                    description: "",
                });
                onClose();
                onSuccess?.();
            } else {
                throw new Error(response?.data?.msg || "Failed to create request");
            }
        } catch (error) {
            toast.error(error?.message || "Failed to submit discount request");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="2xl" isCentered>
            <ModalOverlay backdropFilter="blur(4px)" />
            <ModalContent borderRadius="xl" boxShadow="2xl">
                <ModalHeader
                    bg="linear-gradient(135deg, #C11111 0%, #ff6b6b 100%)"
                    color="white"
                    borderTopRadius="xl"
                    fontSize="xl"
                    fontWeight="800"
                    py={6}
                >
                    {isViewOnly
                        ? "Discount Request Details"
                        : "Request New Discount"}
                </ModalHeader>
                <ModalCloseButton
                    color="white"
                    _hover={{ bg: "rgba(255,255,255,0.1)" }}
                />

                <ModalBody py={6}>
                    {isViewOnly && request ? (
                        <VStack spacing={5} align="stretch" className="bg-white p-4">
                            {/* Status Badge */}
                            <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                <Text fontSize="sm" fontWeight="600" color="gray.500" mb={0}>
                                    Status
                                </Text>
                                <Badge
                                    colorScheme={
                                        request.status?.toLowerCase() === "approved"
                                            ? "green"
                                            : request.status?.toLowerCase() === "rejected"
                                                ? "red"
                                                : "yellow"
                                    }
                                    px={3}
                                    py={1}
                                    fontSize="md"
                                    borderRadius="full"
                                    fontWeight="600"
                                >
                                    {request.status}
                                </Badge>
                            </Box>

                            <Divider />

                            {/* Discount Details */}
                            <Box>
                                <Text fontSize="sm" fontWeight="600" color="gray.500" mb={2}>
                                    Discount Value
                                </Text>
                                <HStack spacing={2}>
                                    <Text fontSize="2xl"  mb={0} fontWeight="800" color="#C11111">
                                        {request.type === "percentage"
                                            ? `${request.value}%`
                                            : `$${request.value}`}
                                    </Text>
                                    <Badge colorScheme="purple" px={2}>
                                        {request.type}
                                    </Badge>
                                </HStack>
                            </Box>

                            {/* Dates and Times */}
                            <HStack spacing={8} w="full">
                                <Box flex={1}>
                                    <Text fontSize="sm" fontWeight="600" color="gray.500" mb={2}>
                                        Start Date & Time
                                    </Text>
                                    <Text fontSize="md" fontWeight="500">
                                        {moment(request.startedAt).local().format("YYYY-MM-DD HH:mm")}
                                    </Text>
                                </Box>
                                <Box flex={1}>
                                    <Text fontSize="sm" fontWeight="600" color="gray.500" mb={2}>
                                        End Date & Time
                                    </Text>
                                    <Text fontSize="md" fontWeight="500">
                                        {moment(request.endedAt).local().format("YYYY-MM-DD HH:mm")}
                                    </Text>
                                </Box>
                            </HStack>


                            {/* Description */}
                            {request.description && (
                                <Box>
                                    <Text fontSize="sm" fontWeight="600" color="gray.500" mb={2}>
                                        Description
                                    </Text>
                                    <Text fontSize="md" color="gray.700">
                                        {request.description}
                                    </Text>
                                </Box>
                            )}

                            {/* Admin Notes */}
                            {request.adminNotes && (
                                <Box
                                    bg="blue.50"
                                    p={4}
                                    borderRadius="md"
                                    borderLeft="4px solid"
                                    borderLeftColor="blue.500"
                                >
                                    <Text fontSize="xs" fontWeight="600" color="blue.600" mb={2}>
                                        ADMIN NOTES
                                    </Text>
                                    <Text fontSize="sm" color="blue.900">
                                        {request.adminNotes}
                                    </Text>
                                </Box>
                            )}
                        </VStack>
                    ) : (
                        <form onSubmit={onSubmit} className="bg-white p-4">
                            <VStack spacing={5}>
                                {/* Discount Type Selection */}
                                <FormControl isRequired>
                                    <FormLabel fontWeight="600" fontSize="sm">
                                        Discount Type
                                    </FormLabel>
                                    <Select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleChange}
                                        borderColor="gray.300"
                                        _focus={{
                                            borderColor: "#C11111",
                                            boxShadow: "0 0 0 1px rgba(193, 17, 17, 0.2)",
                                        }}
                                    >
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="fixed">Fixed Amount ($)</option>
                                    </Select>
                                </FormControl>

                                {/* Discount Value */}
                                <FormControl isRequired>
                                    <FormLabel fontWeight="600" fontSize="sm">
                                        Discount Value
                                    </FormLabel>
                                    <Input
                                        name="value"
                                        type="number"
                                        placeholder={
                                            formData.type === "percentage"
                                                ? "Enter percentage (0-100)"
                                                : "Enter amount ($)"
                                        }
                                        value={formData.value}
                                        onChange={handleChange}
                                        step="0.01"
                                        min="0"
                                        borderColor="gray.300"
                                        _focus={{
                                            borderColor: "#C11111",
                                            boxShadow: "0 0 0 1px rgba(193, 17, 17, 0.2)",
                                        }}
                                    />
                                </FormControl>

                                {/* Start Date and Time */}
                                <HStack w="100%" spacing={4}>
                                    <FormControl isRequired>
                                        <FormLabel fontWeight="600" fontSize="sm">
                                            Start Date
                                        </FormLabel>
                                        <Input
                                            type="date"
                                            name="startDate"
                                            value={formData.startDate}
                                            onChange={handleChange}
                                            borderColor="gray.300"
                                            _focus={{
                                                borderColor: "#C11111",
                                                boxShadow: "0 0 0 1px rgba(193, 17, 17, 0.2)",
                                            }}
                                        />
                                    </FormControl>

                                    <FormControl isRequired>
                                        <FormLabel fontWeight="600" fontSize="sm">
                                            Start Time
                                        </FormLabel>
                                        <Input
                                            type="time"
                                            name="startTime"
                                            value={formData.startTime}
                                            onChange={handleChange}
                                            borderColor="gray.300"
                                            _focus={{
                                                borderColor: "#C11111",
                                                boxShadow: "0 0 0 1px rgba(193, 17, 17, 0.2)",
                                            }}
                                        />
                                    </FormControl>
                                </HStack>

                                {/* End Date and Time */}
                                <HStack w="100%" spacing={4}>
                                    <FormControl isRequired>
                                        <FormLabel fontWeight="600" fontSize="sm">
                                            End Date
                                        </FormLabel>
                                        <Input
                                            type="date"
                                            name="endDate"
                                            value={formData.endDate}
                                            onChange={handleChange}
                                            borderColor="gray.300"
                                            _focus={{
                                                borderColor: "#C11111",
                                                boxShadow: "0 0 0 1px rgba(193, 17, 17, 0.2)",
                                            }}
                                        />
                                    </FormControl>

                                    <FormControl isRequired>
                                        <FormLabel fontWeight="600" fontSize="sm">
                                            End Time
                                        </FormLabel>
                                        <Input
                                            type="time"
                                            name="endTime"
                                            value={formData.endTime}
                                            onChange={handleChange}
                                            borderColor="gray.300"
                                            _focus={{
                                                borderColor: "#C11111",
                                                boxShadow: "0 0 0 1px rgba(193, 17, 17, 0.2)",
                                            }}
                                        />
                                    </FormControl>
                                </HStack>

                                {/* Description */}
                                <FormControl>
                                    <FormLabel fontWeight="600" fontSize="sm">
                                        Description
                                    </FormLabel>
                                    <Textarea
                                        name="description"
                                        placeholder="Describe your discount request or any special details..."
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={3}
                                        borderColor="gray.300"
                                        _focus={{
                                            borderColor: "#C11111",
                                            boxShadow: "0 0 0 1px rgba(193, 17, 17, 0.2)",
                                        }}
                                        resize="vertical"
                                    />
                                </FormControl>
                            </VStack>
                        </form>
                    )}
                </ModalBody>

                <ModalFooter bg="gray.50" borderBottomRadius="xl" gap={3} py={4}>
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        fontWeight="600"
                        _hover={{ bg: "gray.100" }}
                    >
                        {isViewOnly ? "Close" : "Cancel"}
                    </Button>
                    {!isViewOnly && (
                        <Button
                            bg="#C11111"
                            color="white"
                            onClick={onSubmit}
                            isLoading={loading}
                            loadingText="Submitting..."
                            fontWeight="600"
                            _hover={{
                                bg: "red.700",
                                boxShadow: "0 4px 12px rgba(193, 17, 17, 0.4)",
                            }}
                        >
                            Submit Request
                        </Button>
                    )}
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default DiscountRequestModal;
