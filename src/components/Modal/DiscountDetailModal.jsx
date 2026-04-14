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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Heading,
  Divider,
} from "@chakra-ui/react";

export default function DiscountDetailModal({ isOpen, onClose, discount }) {
  if (!discount) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl">
      <ModalOverlay />
      <ModalContent borderRadius="xl" bg="white">
        <ModalHeader className="category-request-page" bg="white" p={6} borderBottom="1px solid #eee" style={{ borderRadius: "20px 20px 0 0" }} display="flex" justifyContent="space-between" alignItems="center">
          <HStack>
            <Text fontWeight="800" fontSize="2xl">{discount.code}</Text>
            <Badge colorScheme={discount.isActive ? "green" : "red"} variant="subtle" borderRadius="full">
              {discount.isActive ? "Active" : "Inactive"}
            </Badge>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody p={6} bg="white" className="category-request-page2">
          <VStack spacing={6} p={6} align="stretch">
            {/* Summary Info */}
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <InfoRow label="Discount Type" value={discount.type.charAt(0).toUpperCase() + discount.type.slice(1)} />
              <InfoRow label="Value" value={discount.type === "percentage" ? `${discount.value}%` : `$${discount.value}`} />
              <InfoRow label="Min Order Amount" value={`$${discount.minOrderAmount}`} />
              <InfoRow label="Expiry Date" value={new Date(discount.expiryDate).toLocaleDateString()} />
              <InfoRow label="Usage Statistics" value={`${discount.usages?.length || 0} / ${discount.usageLimit || "∞"}`} />
              <InfoRow label="Limit Per User" value={discount.usageLimitPerUser || "∞"} />
            </SimpleGrid>

            {discount.description && (
              <Box bg="gray.50" p={4} borderRadius="md" border="1px dashed #ccc">
                <Text fontWeight="600" fontSize="sm" mb={1} color="gray.600">DESCRIPTION</Text>
                <Text fontSize="sm">{discount.description}</Text>
              </Box>
            )}

            <Divider my={0} />

            {/* Usage History Section */}
            <Box mb={6}>
              <Heading size="sm" mb={4} color="gray.700">USAGE HISTORY</Heading>
              {discount.usages && discount.usages.length > 0 ? (
                <Box overflowX="auto" border="1px solid #eee" borderRadius="lg">
                  <Table variant="simple" size="sm">
                    <Thead bg="gray.50">
                      <Tr>
                        <Th>Customer</Th>
                        <Th>Order Number</Th>
                        <Th>Order Total</Th>
                        <Th>Discounted</Th>
                        <Th>Date & Time</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {discount.usages.map((usage, idx) => (
                        <Tr key={idx}>
                          <Td fontSize="xs">
                            <Text fontWeight="600">{usage.user?.firstName} {usage.user?.lastName}</Text>
                            <Text color="gray.500">{usage.user?.email}</Text>
                          </Td>
                          <Td fontSize="xs" fontWeight="500">{usage.order?.orderNumber}</Td>
                          <Td fontSize="xs" fontWeight="700">${usage.order?.total}</Td>
                          <Td fontSize="xs" color="red.500">-${usage.order?.discountAmount}</Td>
                          <Td fontSize="xs" color="gray.500">
                            {new Date(usage.usedAt).toLocaleDateString()} at {new Date(usage.usedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              ) : (
                <Text fontSize="sm" color="gray.500" fontStyle="italic">No usage history found for this code.</Text>
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
