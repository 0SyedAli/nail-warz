"use client";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  HStack,
  Text,
  Badge,
  Box,
  Divider,
  Spinner,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import moment from "moment";
export default function BookingDiscountDetailModal({ isOpen, onClose, discount }) {
  const [salonsMap, setSalonsMap] = useState({});
  const [loadingSalons, setLoadingSalons] = useState(false);

  const formatDateTime = (value) => {
    if (!value) return "N/A";

    const dateTime = moment(value);

    return dateTime.isValid()
      ? dateTime.local().format("DD-MM-YYYY hh:mm A")
      : "N/A";
  };
  useEffect(() => {
    if (isOpen && discount?.applicableSalons?.length > 0) {
      fetchSalons();
    }
  }, [isOpen, discount]);

  const fetchSalons = async () => {
    setLoadingSalons(true);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/superAdmin/vendor`, {
        headers: { Authorization: `Bearer ${Cookies.get("token")}` },
      });
      if (res.data.success) {
        const map = {};
        res.data.vendors.forEach((s) => {
          map[s._id] = s.salonName || s.email || s._id;
        });
        setSalonsMap(map);
      }
    } catch (err) {
      console.error("Error fetching salons for detail view:", err);
    } finally {
      setLoadingSalons(false);
    }
  };

  if (!discount) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl">
      <ModalOverlay />
      <ModalContent borderRadius="xl" bg="white">
        <ModalHeader className="category-request-page" bg="white" p={6} borderBottom="1px solid #eee" style={{ borderRadius: "20px 20px 0 0" }} display="flex" justifyContent="space-between" alignItems="center">
          <HStack>
            <Text fontWeight="800" fontSize="2xl">{discount.code}</Text>
            <Badge colorScheme={discount.isActive !== false ? "green" : "red"} variant="subtle" borderRadius="full">
              {discount.isActive !== false ? "Active" : "Inactive"}
            </Badge>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody p={6} bg="white" className="category-request-page2">
          <VStack spacing={6} p={6} align="stretch">
            {/* Summary Info */}
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <InfoRow label="Discount Type" value={discount.type ? (discount.type.charAt(0).toUpperCase() + discount.type.slice(1)) : "N/A"} />
              <InfoRow label="Value" value={discount.type === "percentage" ? `${discount.value}%` : `$${discount.value}`} />
              <InfoRow label="Funding Type" value={discount.fundingType || "Platform"} />
              <InfoRow
                label="Start Date & Time"
                value={formatDateTime(discount.startedAt)}
              />

              <InfoRow
                label="End Date & Time"
                value={formatDateTime(discount.endedAt)}
              />
              <InfoRow label="Usage Statistics" value={`${discount.usages?.length || 0} / ${discount.maxUses || "∞"}`} />
              <InfoRow label="Limit Per User" value={discount.maxUsesPerCustomer || "1"} />
            </SimpleGrid>

            {discount.description && (
              <Box bg="gray.50" p={4} borderRadius="md" border="1px dashed #ccc">
                <Text fontWeight="600" fontSize="sm" mb={1} color="gray.600">DESCRIPTION</Text>
                <Text fontSize="sm">{discount.description}</Text>
              </Box>
            )}

            <Divider my={0} />

            {/* Applicable Salons Section */}
            <Box>
              <Text color="gray.500" fontSize="xs" fontWeight="600" textTransform="uppercase" letterSpacing="widest" mb={2}>
                APPLICABLE SALONS
              </Text>
              {discount.applicableSalons && discount.applicableSalons.length > 0 ? (
                <Box display="flex" flexWrap="wrap" gap={2}>
                  {discount.applicableSalons.map((salon) => {
                    const id = salon && typeof salon === 'object' ? salon._id : salon;
                    const name = salon && typeof salon === 'object' ? (salon.salonName || salon.email) : (salonsMap[salon] || salon);
                    return (
                      <Badge key={id} colorScheme="red" variant="solid" borderRadius="md" px={2} py={1}>
                        {name}
                      </Badge>
                    );
                  })}
                </Box>
              ) : (
                <Text fontSize="sm" color="gray.800" fontWeight="700">All Salons</Text>
              )}
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

const SimpleGrid = ({ children, columns, spacing }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: `repeat(${columns.md}, 1fr)`,
    gap: `${spacing}px`
  }}>
    {children}
  </div>
);

const InfoRow = ({ label, value }) => (
  <Box>
    <Text color="gray.500" fontSize="xs" fontWeight="600" textTransform="uppercase" letterSpacing="widest">{label}</Text>
    <Text fontWeight="700" fontSize="md" color="gray.800">{value}</Text>
  </Box>
);
