import { Box, Button, Circle, Divider, HStack, Image, VStack } from "@chakra-ui/react";
import { BsEnvelope } from "react-icons/bs";
import { FaComment } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export default function SocialLogin() {
    return (
        <Box>
            <HStack h={10}>
                <Divider />
            </HStack>
            <VStack justifyContent={"space-evenly"} mb={5}>
                <Button mt={5} w="100%" bg={"blue.100"} leftIcon={<FcGoogle/>}>Login with Google</Button>
            <Image h={50} w="100%" src="img/kakao_login_large_wide.png"/>
        
            </VStack>
        </Box>
    )
}