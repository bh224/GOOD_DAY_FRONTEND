import { Box, Button, Divider, HStack, VStack } from "@chakra-ui/react";
import { BsChatFill } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";

export default function SocialLogin() {
    const kakaoParams = {
        client_id: "90eb4807776054920da36cf74a9b006e",
        response_type: "code",
    }
    const kakao = new URLSearchParams(kakaoParams).toString();
    const googleParams = {
        client_id: "1051453023789-boperin529q0af3mf1idkqlplqmt60hs.apps.googleusercontent.com",
        // redirect_uri: process.env.REACT_APP_REDIRECT_GOOGLE,
        response_type: "code",
        scope: "https://www.googleapis.com/auth/userinfo.email"
    }
    const google = new URLSearchParams(googleParams).toString();
    const naverParams = {
        response_type: "code",
        client_id: "qW_D7ntXsDAXdVlaJf2B",
        // redirect_uri: process.env.REACT_APP_REDIRECT_NAVER,
        state: "H1GRM1ofvYKBwEtxe2bjHyulgdOlTd3u" 
    }
    const naver = new URLSearchParams(naverParams).toString();
    return (
        <Box>
            <HStack h={10}>
                <Divider />
            </HStack>
            <VStack justifyContent={"space-evenly"} mb={5}>
                <Button as="a" href={`https://kauth.kakao.com/oauth/authorize?${kakao}&redirect_uri=${process.env.REACT_APP_REDIRECT_KAKAO}`} mt={5} w="100%" bg={"#FEE500"} leftIcon={<BsChatFill/>}>Login with Kakao</Button>
                <Button as="a" href={`https://nid.naver.com/oauth2.0/authorize?${naver}&redirect_uri=${process.env.REACT_APP_REDIRECT_NAVER}`} mt={5} w="100%" bg={"#03C75A"} color={"white"} >Login with Naver</Button>
                <Button as="a" href={`https://accounts.google.com/o/oauth2/v2/auth?${google}&redirect_uri=${process.env.REACT_APP_REDIRECT_GOOGLE}`} mt={5} w="100%" bg={"blue.100"} leftIcon={<FcGoogle />}>Login with Google</Button>
            </VStack>
        </Box>
    )
}