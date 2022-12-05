import { Avatar, Box, Button, CircularProgress, CircularProgressLabel, HStack, Text, useDisclosure, useToast } from "@chakra-ui/react";
import { useMutation, useQueryClient, QueryCache  } from "@tanstack/react-query";
import { FcCloseUpMode,} from "react-icons/fc";
import { logOut } from "../api";
import useUser from "../lib/useUser";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";


export default function Header() {
  const queryClient = useQueryClient();
  const { userLoading, user, isLoggedIn } = useUser();
  const toast = useToast()
  const mutation = useMutation(logOut, {
    onSuccess: (data) => {
      queryClient.refetchQueries(['tasks'])
      toast({
        status: "success",
        description: data.ok,
        isClosable: true,
        duration: 2000,
      })
      queryClient.refetchQueries(['user'])
   
    }
  })
  const onLogout = async () => {
    mutation.mutate()
  }
  const { isOpen:isLoginOpen, onOpen:onLoginOpen, onClose:onLoginClose } = useDisclosure();
  const { isOpen:isSignupOpen, onOpen:onSignupOpen, onClose:onSignupClose } = useDisclosure();
    return (
        <Box px={10} py={3}>
    <Box >
      <HStack justifyContent={"space-between"}>
        <Box as="b">g o o d d a y</Box>
            {!userLoading ? (
              !isLoggedIn ? 
        (<Box>

          <Button variant={"ghost"} onClick={onLoginOpen}>Log in</Button>
          <Button variant={"ghost"} onClick={onSignupOpen}>Sign up</Button>
                </Box>) :
                <HStack>
                <CircularProgress value={40} color='green.400'>
                <CircularProgressLabel>40%</CircularProgressLabel>
                </CircularProgress>
                  <Avatar name={user.username} />
                  <Text>{user.nickname}</Text>
                  <Button onClick={onLogout}>Logout</Button>
                </HStack>
             ): null}
      </HStack>
      </Box>
        <HStack fontSize={"x-small"}>
          <HStack>
            <FcCloseUpMode />
            <Text>출첵완료!</Text>
          </HStack>
          <HStack>
            <FcCloseUpMode />
            <Text>바깥 볼 일 중</Text>
          </HStack>
          <HStack>
            <FcCloseUpMode />
            <Text>쉬는 날</Text>
          </HStack>
        </HStack>
        <LoginModal isOpen={isLoginOpen} onClose={onLoginClose} />
        <SignupModal isOpen={isSignupOpen} onClose={onSignupClose} />

</Box>
    )
}