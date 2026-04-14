"use client";

import Modal from "./layout";
import "./modal.css";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { RxCross2 } from "react-icons/rx";

import {
  Modal as ChakraModal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  HStack,
  Box,
  Tag,
  TagLabel,
  TagCloseButton,
  Text,
  IconButton,
  Heading,
} from "@chakra-ui/react";

function CategoryRequestModal({ isOpen, onClose, onSuccess }) {
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [reason, setReason] = useState("");
  const [subCategoryInput, setSubCategoryInput] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [salonId, setSalonId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const cookie = Cookies.get("user");
    if (!cookie) return router.push("/auth/login");

    try {
      const u = JSON.parse(cookie);
      if (u?._id) setSalonId(u._id);
      else router.push("/auth/login");
    } catch {
      router.push("/auth/login");
    }
  }, [router]);

  const handleAddSubCategory = () => {
    const trimmed = subCategoryInput.trim();
    if (trimmed && !subCategories.includes(trimmed)) {
      setSubCategories([...subCategories, trimmed]);
      setSubCategoryInput("");
    }
  };

  const handleRemoveSubCategory = (idx) => {
    setSubCategories(subCategories.filter((_, i) => i !== idx));
  };

  const resetForm = () => {
    setCategoryName("");
    setDescription("");
    setReason("");
    setSubCategoryInput("");
    setSubCategories([]);
    setError(null);
  };

  const handleSubmit = async () => {
    if (isLoading) return;
    setIsLoading(true);

    if (!categoryName.trim()) {
      setError("Please enter category name");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/categoryRequest`,
        {
          vendorId: salonId,
          categoryName: categoryName.trim(),
          subCategories: subCategories,
          reason: reason.trim(),
          description: description.trim(),
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response?.data?.success) {
        toast.success("Category request submitted successfully!", { autoClose: 1500 });
        resetForm();
        onClose();
        onSuccess?.();
      } else {
        toast.error(response?.data?.message || "Failed to submit request");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "API error", { autoClose: 1500 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChakraModal
      isOpen={isOpen}
      onClose={() => { onClose(); resetForm(); }}
      size="xl"
      isCentered
      motionPreset="slideInBottom"
    >
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
      <ModalContent borderRadius="2xl" overflow="hidden" boxShadow="2xl">
        <Box
          bgGradient="linear(to-r, #000, #C11111)"
          p={6}
          position="relative"
        >
          <Heading color="white" size="md">Request New Category</Heading>
          <Text color="whiteAlpha.800" fontSize="sm" mt={1}>Propose a new category for the Nail Warz ecosystem.</Text>
          <IconButton
            icon={<RxCross2 />}
            position="absolute"
            top={4}
            right={4}
            variant="ghost"
            color="white"
            _hover={{ bg: "whiteAlpha.200" }}
            onClick={() => { onClose(); resetForm(); }}
          />
        </Box>

        <ModalBody bg="white">
          <VStack spacing={6} p={6} align="stretch">
            <FormControl isRequired>
              <FormLabel fontWeight="600" color="gray.700">Category Name</FormLabel>
              <Input
                placeholder="e.g., Luxury Spa Pedicure"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                h="50px"
                borderRadius="lg"
                focusBorderColor="#C11111"
                _placeholder={{ color: "gray.400" }}
              />
            </FormControl>

            <FormControl>
              <FormLabel fontWeight="600" color="gray.700">Subcategories</FormLabel>
              <HStack>
                <Input
                  placeholder="Enter a subcategory..."
                  value={subCategoryInput}
                  onChange={(e) => setSubCategoryInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddSubCategory();
                    }
                  }}
                  h="50px"
                  borderRadius="lg"
                  focusBorderColor="#C11111"
                />
                <Button
                  onClick={handleAddSubCategory}
                  bg="#C11111"
                  color="white"
                  h="50px"
                  px={8}
                  _hover={{ bg: "red.700", transform: "translateY(-2px)" }}
                  _active={{ transform: "scale(0.95)" }}
                  transition="all 0.2s"
                >
                  Add
                </Button>
              </HStack>
              <Box mt={3} display="flex" flexWrap="wrap" gap={2}>
                {subCategories.map((sub, idx) => (
                  <Tag
                    key={idx}
                    size="lg"
                    borderRadius="full"
                    variant="subtle"
                    bg="red.50"
                    color="#C11111"
                    border="1px solid"
                    borderColor="red.100"
                  >
                    <TagLabel fontWeight="500">{sub}</TagLabel>
                    <TagCloseButton onClick={() => handleRemoveSubCategory(idx)} />
                  </Tag>
                ))}
              </Box>
            </FormControl>

            <FormControl>
              <FormLabel fontWeight="600" color="gray.700">Reason for Request</FormLabel>
              <Input
                placeholder="Why do you need this category?"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                h="50px"
                borderRadius="lg"
                focusBorderColor="#C11111"
              />
            </FormControl>

            <FormControl>
              <FormLabel fontWeight="600" color="gray.700">Description</FormLabel>
              <Textarea
                placeholder="Tell us more about the services included..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                borderRadius="lg"
                rows={4}
                focusBorderColor="#C11111"
              />
            </FormControl>

            {error && <Text color="red.500" fontSize="sm" fontWeight="500">{error}</Text>}

            <HStack spacing={4} pt={4} justify="flex-end">
              <Button
                variant="ghost"
                onClick={() => { onClose(); resetForm(); }}
                h="50px"
                px={8}
              >
                Cancel
              </Button>
              <Button
                isLoading={isLoading}
                onClick={handleSubmit}
                bgGradient="linear(to-r, #C11111, #800)"
                color="white"
                h="50px"
                px={10}
                borderRadius="lg"
                boxShadow="xl"
                _hover={{
                  bgGradient: "linear(to-r, #D00, #A00)",
                  transform: "translateY(-2px)",
                  boxShadow: "2xl"
                }}
                _active={{ transform: "scale(0.98)" }}
                transition="all 0.3s"
              >
                Submit Request
              </Button>
            </HStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </ChakraModal>
  );
}

export default CategoryRequestModal;
