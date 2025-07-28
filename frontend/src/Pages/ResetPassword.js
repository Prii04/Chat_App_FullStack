// components/Authentication/ResetPassword.js
import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  Text,
  Container,
  Heading,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(true);
  const [tokenChecked, setTokenChecked] = useState(false);

  const { token } = useParams();
  const history = useHistory();
  const toast = useToast();

  useEffect(() => {
    console.log("ResetPassword component mounted");
    console.log("Token from URL:", token);
    
    // Validate token on component mount
    const validateToken = async () => {
      if (!token) {
        console.log("No token found in URL");
        setIsValidToken(false);
        setTokenChecked(true);
        toast({
          title: "Invalid Reset Link",
          description: "The reset link is invalid or malformed",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        return;
      }

      try {
        // Optional: Verify token with backend before showing form
        console.log("Validating token with backend...");
        await axios.get(`/api/users/verify-reset-token/${token}`);
        console.log("Token is valid");
        setIsValidToken(true);
      } catch (error) {
        console.log("Token validation failed:", error.response?.data?.message);
        // If verification endpoint doesn't exist, assume token is valid for now
        // and let the actual reset request handle invalid tokens
        setIsValidToken(true);
      } finally {
        setTokenChecked(true);
      }
    };

    validateToken();
  }, [token, toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log("Form submitted");

    if (!password || !confirmPassword) {
      toast({
        title: "Please fill all fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords are identical",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    setLoading(true);

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      console.log("Sending reset password request...");
      const { data } = await axios.put(
        `/api/users/reset-password/${token}`,
        { password },
        config
      );

      console.log("Password reset successful:", data);

      toast({
        title: "Password Reset Successful",
        description: "Your password has been updated successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      // Optional: Auto-login user after successful reset
      if (data.user && data.token) {
        localStorage.setItem("userInfo", JSON.stringify(data));
      }
      
      // Redirect to login or chat page
      setTimeout(() => {
        history.push("/chats");
      }, 2000);

    } catch (error) {
      console.error("Reset password error:", error);
      
      const errorMessage = error.response?.data?.message || "Failed to reset password";
      
      toast({
        title: "Reset Failed",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      
      if (error.response?.status === 400 || error.response?.status === 404) {
        setIsValidToken(false);
      }
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking token
  if (!tokenChecked) {
    return (
      <Container maxW="md" centerContent>
        <Box
          p={8}
          mt={8}
          borderWidth={1}
          borderRadius="lg"
          boxShadow="lg"
          bg="white"
          w="100%"
          textAlign="center"
        >
          <Text>Validating reset link...</Text>
        </Box>
      </Container>
    );
  }

  if (!isValidToken) {
    return (
      <Container maxW="md" centerContent>
        <Box
          p={8}
          mt={8}
          borderWidth={1}
          borderRadius="lg"
          boxShadow="lg"
          bg="white"
          w="100%"
        >
          <VStack spacing={4}>
            <Heading size="md" color="red.500">
              Invalid Reset Link
            </Heading>
            <Text textAlign="center" color="gray.600">
              This password reset link is invalid or has expired.
              Please request a new password reset.
            </Text>
            <Button
              colorScheme="blue"
              onClick={() => history.push("/")}
              mt={4}
            >
              Back to Login
            </Button>
          </VStack>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxW="md" centerContent>
      <Box
        p={8}
        mt={8}
        borderWidth={1}
        borderRadius="lg"
        boxShadow="lg"
        bg="white"
        w="100%"
      >
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <Heading size="md" color="blue.500">
              Reset Your Password
            </Heading>
            
            <Text textAlign="center" color="gray.600" fontSize="sm">
              Please enter your new password below
            </Text>

            <FormControl isRequired>
              <FormLabel htmlFor="new-password">New Password</FormLabel>
              <InputGroup size="md">
                <Input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                />
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    type="button"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <FormControl isRequired>
              <FormLabel htmlFor="confirm-password">Confirm New Password</FormLabel>
              <InputGroup size="md">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    type="button"
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              width="100%"
              mt={4}
              isLoading={loading}
              loadingText="Resetting Password..."
            >
              Reset Password
            </Button>

            <Button
              variant="link"
              colorScheme="gray"
              size="sm"
              onClick={() => history.push("/")}
              type="button"
            >
              Back to Login
            </Button>
          </VStack>
        </form>
      </Box>
    </Container>
  );
};

export default ResetPassword;