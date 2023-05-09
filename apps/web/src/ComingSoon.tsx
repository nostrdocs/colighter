import React from "react";
import { Box, Center, Image, Text } from "@chakra-ui/react";
import BrandImage from "./assets/colighter.avif";

export const ComingSoon: React.FC = () => {
  return (
    <Box bg="gray.100" minHeight="100vh" p={8}>
      <Center>
        <Box textAlign="center">
          <Image src={BrandImage} alt="Colighter" maxW="100%" />
          <Text fontSize="3xl" color="gray.600" mb={4}>
            Coming Soon!
          </Text>
        </Box>
      </Center>
    </Box>
  );
};
