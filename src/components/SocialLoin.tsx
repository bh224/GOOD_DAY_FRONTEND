import { Box, Button, Circle, Divider, HStack, Image, Img, VStack } from "@chakra-ui/react";
import { BsChatFill, BsEnvelope } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";

export default function SocialLogin() {
    const kakaoParams = {
        client_id: "90eb4807776054920da36cf74a9b006e",
        // redirect_uri: "https://good-day.today/simplelogin/kakao",
        redirect_uri: "http://127.0.0.1:3000/simplelogin/kakao",
        response_type: "code",
    }
    const kakao = new URLSearchParams(kakaoParams).toString();
    const googleParams = {
        client_id: "1051453023789-boperin529q0af3mf1idkqlplqmt60hs.apps.googleusercontent.com",
        // redirect_uri: "https://good-day.today/simplelogin/google",
        redirect_uri: "http://127.0.0.1:3000/simplelogin/google",
        response_type: "code",
        scope: "https://www.googleapis.com/auth/userinfo.email"
    }
    const google = new URLSearchParams(googleParams).toString();
    const naverParams = {
        response_type: "code",
        client_id: "qW_D7ntXsDAXdVlaJf2B",
        // redirect_uri: "https://good-day.today/simplelogin/naver",
        redirect_uri: "http://127.0.0.1:3000/simplelogin/naver",
        state: "H1GRM1ofvYKBwEtxe2bjHyulgdOlTd3u" // todo 나중에 랜덤값으로 변경
    }
    const naver = new URLSearchParams(naverParams).toString();
    // console.log(naver)
    return (
        <Box>
            <HStack h={10}>
                <Divider />
            </HStack>
            <VStack justifyContent={"space-evenly"} mb={5}>
                <Button as="a" href={`https://kauth.kakao.com/oauth/authorize?${kakao}`} mt={5} w="100%" bg={"#FEE500"} leftIcon={<BsChatFill/>}>Login with Kakao</Button>
                <Button as="a" href={`https://nid.naver.com/oauth2.0/authorize?${naver}`} mt={5} w="100%" bg={"#03C75A"} color={"white"} >Login with Naver</Button>
                <Button as="a" href={`https://accounts.google.com/o/oauth2/v2/auth?${google}`} mt={5} w="100%" bg={"blue.100"} leftIcon={<FcGoogle />}>Login with Google</Button>
            </VStack>
        </Box>
    )
}