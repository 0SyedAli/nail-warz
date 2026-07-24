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
  FormControl,
  FormLabel,
  Input,
  Select,
  NumberInput,
  NumberInputField,
  VStack,
  HStack,
  Textarea,
  Text,
  Box,
  Checkbox,
  Stack,
  Spinner,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import moment from "moment";

export default function BookingDiscountModal({ isOpen, onClose, discount, onSuccess }) {
  const [formData, setFormData] = useState({
    code: "",
    type: "percentage",
    value: 0,
    fundingType: "Platform",
    applicableSalons: [],
    startDate: "",
    endDate: "",
    startTime: "00:00",
    endTime: "23:59",
    maxUses: "",
    maxUsesPerCustomer: 1,
    description: "",
  });
  const [salons, setSalons] = useState([]);
  const [loadingSalons, setLoadingSalons] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch Salons list
  useEffect(() => {
    if (isOpen) {
      fetchSalons();
    }
  }, [isOpen]);

  const fetchSalons = async () => {
    setLoadingSalons(true);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/superAdmin/vendor`, {
        headers: { Authorization: `Bearer ${Cookies.get("token")}` },
      });
      if (res.data.success) {
        setSalons(res.data.vendors || []);
      }
    } catch (err) {
      console.error("Error fetching salons:", err);
      toast.error("Failed to load salons list.");
    } finally {
      setLoadingSalons(false);
    }
  };

  useEffect(() => {
    if (discount) {
      const startMoment = discount.startedAt
        ? moment(discount.startedAt).local()
        : null;

      const endMoment = discount.endedAt
        ? moment(discount.endedAt).local()
        : null;

      setFormData({
        code: discount.code || "",
        type: discount.type || "percentage",
        value: discount.value || 0,
        fundingType: discount.fundingType || "Platform",

        applicableSalons: (discount.applicableSalons || []).map(
          (salon) =>
            salon && typeof salon === "object"
              ? salon._id
              : salon
        ),

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

        maxUses:
          discount.maxUses !== null &&
            discount.maxUses !== undefined
            ? discount.maxUses
            : "",

        maxUsesPerCustomer:
          discount.maxUsesPerCustomer !== undefined
            ? discount.maxUsesPerCustomer
            : 1,

        description: discount.description || "",
      });
    } else {
      setFormData({
        code: "",
        type: "percentage",
        value: 0,
        fundingType: "Platform",
        applicableSalons: [],
        startDate: "",
        endDate: "",
        startTime: "00:00",
        endTime: "23:59",
        maxUses: "",
        maxUsesPerCustomer: 1,
        description: "",
      });
    }
  }, [discount, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
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
  const handleSubmit = async () => {
    if (!formData.code || !formData.startDate || !formData.endDate) {
      return toast.error(
        "Code, Start Date, and End Date are required."
      );
    }

    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      if (!apiUrl) {
        throw new Error("NEXT_PUBLIC_API_URL is missing");
      }

      const startDateISO = combineDateTimeToISO(
        formData.startDate,
        formData.startTime || "00:00"
      );

      const endDateISO = combineDateTimeToISO(
        formData.endDate,
        formData.endTime || "23:59"
      );

      if (new Date(endDateISO) <= new Date(startDateISO)) {
        throw new Error("End date/time must be after start date/time");
      }

      const payload = {
        code: formData.code.trim().toUpperCase(),
        type: formData.type,
        value: Number(formData.value),
        fundingType: formData.fundingType,
        applicableSalons: formData.applicableSalons,

        startedAt: combineDateTimeToISO(
          formData.startDate,
          formData.startTime || "00:00"
        ),

        endedAt: combineDateTimeToISO(
          formData.endDate,
          formData.endTime || "23:59"
        ),

        maxUses:
          formData.maxUses === ""
            ? null
            : Number.parseInt(formData.maxUses, 10),

        maxUsesPerCustomer:
          Number.parseInt(formData.maxUsesPerCustomer, 10) || 1,

        description: formData.description,
      };

      const endpoint = discount
        ? `${apiUrl}/booking-discount/${discount._id}`
        : `${apiUrl}/booking-discount`;

      console.log("API endpoint:", endpoint);
      console.log("Sending payload:", payload);

      const config = {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
          "Content-Type": "application/json",
        },
      };

      const res = discount
        ? await axios.patch(endpoint, payload, config)
        : await axios.post(endpoint, payload, config);

      if (res.data.success) {
        toast.success(
          `Discount ${discount ? "updated" : "created"
          } successfully!`
        );

        onSuccess?.();
        onClose();
      } else {
        toast.error(
          res.data.message || "Failed to save Discount."
        );
      }
    } catch (error) {
      console.error("Discount request error:", {
        message: error.message,
        status: error.response?.status,
        response: error.response?.data,
        url: error.config?.url,
        requestPayload: error.config?.data,
      });

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        (typeof error.response?.data === "string"
          ? error.response.data
          : null) ||
        error.message ||
        "Server Error";

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };



  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent borderRadius="xl" bg="white">
        <ModalHeader bg="white" p={6} borderBottom="1px solid #eee" style={{ borderRadius: "20px 20px 0 0" }}>
          {discount ? "Edit Booking Discount" : "Create New Booking Discount"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody bg="white">
          <VStack spacing={4} p={6}>
            <FormControl isRequired>
              <FormLabel fontWeight="600">Discount Code</FormLabel>
              <Input
                name="code"
                placeholder="e.g. WELCOME52026"
                value={formData.code}
                onChange={handleChange}
                textTransform="uppercase"
              />
            </FormControl>

            <HStack w="100%" spacing={4}>
              <FormControl isRequired>
                <FormLabel fontWeight="600">Type</FormLabel>
                <Select name="type" value={formData.type} onChange={handleChange}>
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount ($)</option>
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontWeight="600">Value</FormLabel>
                <NumberInput
                  min={0}
                  value={formData.value}
                  onChange={(val) => handleNumberChange("value", val)}
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>
            </HStack>

            <HStack w="100%" spacing={4}>
              <FormControl isRequired>
                <FormLabel fontWeight="600">Funding Type</FormLabel>
                <Select name="fundingType" value={formData.fundingType} onChange={handleChange}>
                  <option value="Platform">Platform</option>
                  <option value="Vendor">Vendor</option>
                </Select>
              </FormControl>
            </HStack>

            <FormControl>
              <FormLabel fontWeight="600">Applicable Salon</FormLabel>
              <Select
                name="applicableSalon"
                value={formData.applicableSalons[0] || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    applicableSalons: val ? [val] : [],
                  }));
                }}
                placeholder={loadingSalons ? "Loading salons..." : "All Salons"}
                isDisabled={loadingSalons}
              >
                {salons.map((salon) => (
                  <option key={salon._id} value={salon._id}>
                    {salon.salonName || salon.email}
                  </option>
                ))}
              </Select>
              <Text fontSize="xs" color="gray.500" mt={1}>
                Select a specific salon or leave as "All Salons".
              </Text>
            </FormControl>

            <HStack w="100%" spacing={4}>
              <FormControl isRequired>
                <FormLabel fontWeight="600">Start Date</FormLabel>
                <Input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontWeight="600">Start Time</FormLabel>
                <Input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                />
              </FormControl>
            </HStack>

            <HStack w="100%" spacing={4}>
              <FormControl isRequired>
                <FormLabel fontWeight="600">End Date</FormLabel>
                <Input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontWeight="600">End Time</FormLabel>
                <Input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                />
              </FormControl>
            </HStack>

            <HStack w="100%" spacing={4}>
              <FormControl>
                <FormLabel fontWeight="600">Max Uses (Total)</FormLabel>
                <Input
                  name="maxUses"
                  placeholder="Unlimited"
                  value={formData.maxUses}
                  onChange={handleChange}
                  type="number"
                />
                <Text fontSize="xs" color="gray.500">Leave blank for unlimited uses.</Text>
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontWeight="600">Max Uses Per Customer</FormLabel>
                <NumberInput
                  min={1}
                  value={formData.maxUsesPerCustomer}
                  onChange={(val) => handleNumberChange("maxUsesPerCustomer", val)}
                >
                  <NumberInputField />
                </NumberInput>
                <Text fontSize="xs" color="gray.500">Times a single user can use it.</Text>

              </FormControl>
            </HStack>

            <FormControl>
              <FormLabel fontWeight="600">Description</FormLabel>
              <Textarea
                name="description"
                placeholder="Briefly describe the booking discount…"
                value={formData.description}
                onChange={handleChange}
                rows={3}
              />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter borderTop="1px solid #eee" bg="white" style={{ borderRadius: "0 0 20px 20px" }}>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            bg="#C11111"
            color="white"
            _hover={{ bg: "red.700" }}
            isLoading={loading}
            onClick={handleSubmit}
          >
            {discount ? "Update Discount" : "Create Discount"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
