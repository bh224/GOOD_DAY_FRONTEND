import { useEffect } from "react";
import { Heading, VStack, Text, Spinner, useToast } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { kakaoLogin } from "../api";

export default function KakaoLogin() {
    const toast = useToast()
    const queryClient = useQueryClient();
    const { search } = useLocation()
    const navigate = useNavigate()
    const params = new URLSearchParams(search)
    const code = params.get("code")
    const confirmLogin = async () => {
        if (code) {
            const status = await kakaoLogin(code);
            if (status === 200) {
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
        <VStack alignItems={"center"} mt={100}>
            <Heading> Logging with Kakao </Heading>
            <Text> Please wait ...</Text>
            <Spinner size={"md"}></Spinner>
        </VStack>
    )
}