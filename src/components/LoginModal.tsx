import { Button, Input, InputGroup, InputLeftElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text, ToastId, useToast, VStack } from "@chakra-ui/react";
import { FcLock, FcPortraitMode } from "react-icons/fc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import SocialLogin from "./SocialLoin";
import { useForm } from "react-hook-form";
import { logIn, LoginError, LoginSuccess, LoginVariables } from "../api";
import { useRef } from "react";


interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface LoginForm {
  username: string;
  password: string;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const queryClient = useQueryClient()
  const toast = useToast()
  const toastId = useRef<ToastId>()
  const { register, handleSubmit, watch, reset, formState: {errors} } = useForm<LoginForm>();
  // console.log(watch())
  const mutation = useMutation(logIn, {
    onSuccess: (data) => {
      toast({
        status: "success",
        description: data.ok,
        isClosable: true,
        duration: 2000,
      })
      queryClient.refetchQueries(['user'])
      onClose()
      reset()
    },
    onError: (error) => {
      toast({
          status: "error",
          description: "ID/패스워드를 확인해 주세요",
          isClosable: true,
          duration: 2000,
      })
    }
  })
  const onSubmit = ({username, password}:LoginForm) => {
    // console.log(username, password)
    mutation.mutate({username, password})
  }
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay/>
          <ModalContent>
            <ModalHeader textAlign={"center"}>Log In</ModalHeader>
            <ModalCloseButton />
            <ModalBody as="form" onSubmit={handleSubmit(onSubmit)}>
              <VStack>
              <InputGroup>
                <InputLeftElement children={<FcPortraitMode/>} />
                <Input {...register("username", {required: "ID를 입력해 주세요"})} variant={"filled"} placeholder="ID"  />
              </InputGroup>
                <Text fontSize="xs" color="red">{errors.username?.message}</Text>
              <InputGroup>
                  <InputLeftElement children={<FcLock />} />
                <Input type="password" {...register("password", { required: "패스워드를 입력해 주세요" })} variant={"filled"} placeholder="PASSWORD"  />
              </InputGroup>
                <Text fontSize="xs" color="red">{errors.password?.message}</Text>
              </VStack>
            <Button type="submit" mt={5} w="100%" bg={"purple.100"} textAlign={"center"}>Log In</Button>
              <SocialLogin/>
            </ModalBody>
          </ModalContent>
      </Modal>
    )
}