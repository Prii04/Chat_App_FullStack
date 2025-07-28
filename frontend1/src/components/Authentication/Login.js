import React, { useState } from 'react';
import { 
  VStack,
  Button
} from "@chakra-ui/react";
import { InputGroup } from '@chakra-ui/input';
import { Input } from '@chakra-ui/input';
import {
  FormControl,
  FormLabel
} from "@chakra-ui/form-control";
import { InputRightElement } from "@chakra-ui/input";
import { toaster } from "../ui/toaster.jsx";
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    const handleClick = () => setShow(!show);
    
    const submitHandler = async() => {
        setLoading(true);
        if (!email || !password) {
            toaster.create({
                title: "Please fill all the fields!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };

            const { data } = await axios.post(
                "/api/user/login",
                { email, password },
                config
            );

            toaster.create({
                title: "Login Successful!",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });

            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
            history.push("/chats");
            
        } catch (error) {
            toaster.create({
                title: "Error Occurred!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
    };

    return (
        <VStack spacing='5px' color="black">
            <FormControl id='email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    placeholder='Enter your Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormControl>

            <FormControl id='password' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input 
                        type={show ? "text" : "password"}
                        placeholder='Enter your Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement width='4.5rem'>
                        <Button h='1.75rem' size='sm' onClick={handleClick}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

             <Button
                width='100%'
                colorScheme='teal'
                style={{ marginTop: 15 }}
                onClick={submitHandler}
                isLoading={loading}
            >
                Login
            </Button>
            
            <Button
                width='100%'
                variant='solid'
                colorScheme='red'
                onClick={() => {
                    setEmail("guest@example.com");
                    setPassword("123456");
                }}
            >
                Get Guest User Credentials
            </Button>
        </VStack>
    );
};

export default Login;