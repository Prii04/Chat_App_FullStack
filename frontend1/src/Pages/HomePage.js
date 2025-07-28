import { Container, Text, Box, Tabs } from "@chakra-ui/react";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";

const HomePage = () => {

  const history = useHistory();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    
    if (user) history.push("/chats");
  },[history]);


  return (
    <Container maxW="xl" centerContent>
      <Box
        display="flex"
        justifyContent="center"
        p={4}
        bg="white"
        w="100%"
        mt={10}
        mb={4}
        borderRadius="lg"
        borderWidth="1px"
        boxShadow="md"
      >
        <Text fontSize="4xl" fontFamily="Work Sans" color={"teal.600"}>
          ChatSphere
        </Text>
      </Box>

      <Box
        bg="white"
        w="100%"
        p={6}
        borderRadius="lg"
        borderWidth="1px"
        boxShadow="md"
      >
        <Tabs.Root defaultValue="login" variant={"soft-rounded"} colorScheme={"teal"} isFitted>
          <Tabs.List mb={4}>
            <Tabs.Trigger
              value="login"
              sx={{
                _selected: {
                  color: "white",
                  bg: "teal.500",
                },
                mx: 2,
              }}
            >
              Login
            </Tabs.Trigger>
            <Tabs.Trigger
              value="signup"
              sx={{
                _selected: {
                  color: "white",
                  bg: "teal.500",
                },
                mx: 2,
              }}
            >
              Signup
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="login">
            <Login />
          </Tabs.Content>
          <Tabs.Content value="signup">
            <Signup />
          </Tabs.Content>
        </Tabs.Root>
      </Box>
    </Container>
  );
};

export default HomePage;
