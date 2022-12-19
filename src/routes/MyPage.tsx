import { Avatar, Box, Button, HStack, VStack,   Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Input,
    Text,
} from "@chakra-ui/react"
  import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { EditUserVariables, updateUser } from "../api";
import useUser from "../lib/useUser"

export default function MyPage() {
    const { userLoading, user, isLoggedIn } = useUser();
    const { register, watch, reset, handleSubmit } = useForm<EditUserVariables>();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const queryClient = useQueryClient();
    console.log(watch())
    const mutation = useMutation(updateUser, {
        onSuccess: (data) => {
            console.log(data)
            reset()
            onClose()
            queryClient.refetchQueries(['user'])
        },
        onError: (error) => {
            console.log(error)
        }
    })
    const onSubmit = ({ nickname, email}:EditUserVariables) => {
        console.log(nickname, email)
        mutation.mutate({nickname, email})
    }
    return (
        <HStack w="80%" justifyContent={"center"} alignItems={"flex-start"} m={"auto"} py={150}>
            <VStack>
                <Avatar name={user?.username} size="lg"/>
                <Button variant={"link"}>Edit Image</Button>
            </VStack>
            <VStack alignItems={"flex-start"}>
                <Box>ID : {user?.username}</Box>
                <Box>NAME : {user?.nickname} </Box>
                <Box>E-MAIL : {user?.email} </Box>
                <Box>MY GROUPS</Box>
                {user?.workgroups.map((group:any) => (
                    <Box key={group.pk}>{group.group_name}</Box>
                ))}
                <Button onClick={onOpen}>Edit</Button>
                
                <Modal isOpen={isOpen} onClose={onClose} >
                <ModalOverlay />
                <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
                <ModalHeader>Modal Title</ModalHeader>
                <ModalCloseButton />
                <ModalBody >
                <VStack>
                <Box>ID : {user?.username}</Box>
                <Text>Name</Text>
                <Input defaultValue={user?.nickname} {...register("nickname")} />
                <Text>Email</Text>
                <Input defaultValue={user?.email} {...register("email")} />
                
                        </VStack>
                </ModalBody>

                <ModalFooter>
                    <Button w="100%" colorScheme='blue' mr={3} type="submit">SAVE</Button>
                </ModalFooter>
                </ModalContent>
            </Modal>
            </VStack>
        </HStack>
    )
}