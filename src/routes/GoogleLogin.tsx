import { useEffect } from "react";
import { Heading, VStack, Text, Spinner, useToast } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { googleLogin } from "../api";

export default function GoogleLogin() {
    const toast = useToast()
    const queryClient = useQueryClient();
    const {search} = useLocation()
    const navigate = useNavigate()
    const params = new URLSearchParams(search)
    const code = params.get("code")
    // console.log(code)
    const confirmLogin = async () => {
        if (code) {
            const status = await googleLogin(code);
            if (status === 200) {
                // console.log("google login")
                toast({
                    status: "success",
                    description: "로그인 성공",
                    duration: 2000,
                    isClosable: true
                })
            }
            queryClient.refetchQueries(['user'])
            navigate("/")
        }
    }
    useEffect(() => {
        confirmLogin()
    }, [])

    return (
        <VStack alignItems={"center"} pt={200}>
            <Heading> Logging with Google </Heading>
            <Spinner size={"md"}></Spinner>
            <Text> Please wait ...</Text>
        </VStack>
    )
}