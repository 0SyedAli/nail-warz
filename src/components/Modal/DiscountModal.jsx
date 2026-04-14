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
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

export default function DiscountModal({ isOpen, onClose, discount, onSuccess }) {
  const [formData, setFormData] = useState({
    code: "",
    type: "percentage",
    value: 0,
    minOrderAmount: 0,
    expiryDate: "",
    usageLimit: 1,
    usageLimitPerUser: 1,
    description: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (discount) {
      setFormData({
        code: discount.code,
        type: discount.type,
        value: discount.value,
        minOrderAmount: discount.minOrderAmount,
        expiryDate: discount.expiryDate ? new Date(discount.expiryDate).toISOString().split('T')[0] : "",
        usageLimit: discount.usageLimit,
        usageLimitPerUser: discount.usageLimitPerUser,
        description: discount.description || "",
      });
    } else {
      setFormData({
        code: "",
        type: "percentage",
        value: 0,
        minOrderAmount: 0,
        expiryDate: "",
        usageLimit: 0,
        usageLimitPerUser: 0,
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

  const handleSubmit = async () => {
    if (!formData.code || !formData.expiryDate) {
      return toast.error("Code and Expiry Date are required.");
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        expiryDate: new Date(formData.expiryDate).toISOString(),
      };

      let res;
      if (discount) {
        res = await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL}/discount/${discount._id}`,
          payload,
          {
            headers: { Authorization: `Bearer ${Cookies.get("token")}` },
          }
        );
      } else {
        res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/discount`,
          payload,
          {
            headers: { Authorization: `Bearer ${Cookies.get("token")}` },
          }
        );
      }

      if (res.data.success) {
        toast.success(`Discount ${discount ? "updated" : "created"} successfully!`);
        onSuccess?.();
        onClose();
      } else {
        toast.error(res.data.message || "Failed to save discount.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} bg="white" onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent borderRadius="xl" bg="white">
        <ModalHeader bg="white" p={6} borderBottom="1px solid #eee" style={{ borderRadius: "20px 20px 0 0" }}>
          {discount ? "Edit Discount Code" : "Create New Discount"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody bg="white">
          <VStack spacing={4} p={6}>
            <FormControl isRequired>
              <FormLabel fontWeight="600">Discount Code</FormLabel>
              <Input
                name="code"
                placeholder="e.g. NW-WINTER-20"
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
              <FormControl>
                <FormLabel fontWeight="600">Min Order Amount</FormLabel>
                <NumberInput
                  min={0}
                  value={formData.minOrderAmount}
                  onChange={(val) => handleNumberChange("minOrderAmount", val)}
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontWeight="600">Expiry Date</FormLabel>
                <Input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                />
              </FormControl>
            </HStack>

            <HStack w="100%" spacing={4}>
              <FormControl>
                <FormLabel fontWeight="600">Usage Limit (Total)</FormLabel>
                <NumberInput
                  min={0}
                  value={formData.usageLimit}
                  onChange={(val) => handleNumberChange("usageLimit", val)}
                >
                  <NumberInputField />
                </NumberInput>
                <Text fontSize="xs" color="gray.500">Total times this code can be used.</Text>
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="600">Usage Per User</FormLabel>
                <NumberInput
                  min={0}
                  value={formData.usageLimitPerUser}
                  onChange={(val) => handleNumberChange("usageLimitPerUser", val)}
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
                placeholder="Briefly describe the discount…"
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
