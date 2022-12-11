import { Box, Button, HStack, Input, InputGroup, InputLeftElement, InputRightElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, PinInput, PinInputField, Text, useDisclosure, useToast, VStack } from "@chakra-ui/react";
import { CheckIcon } from '@chakra-ui/icons';
import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BiEnvelopeOpen } from "react-icons/bi";
import { FcLock, FcPortraitMode, FcBusinesswoman } from "react-icons/fc";
import SocialLogin from "./SocialLoin";
import { checkUsername, signUp } from "../api";
import { useNavigate } from "react-router-dom";

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface SignupForm {
    email: string;
    code1: string;
    code2: string;
    code3: string;
    code4: string;
    nickname: string;
    password: string;
    repassword: string;
    username: string;
    group_code: string;
    code: string;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const { register, watch, handleSubmit, reset } = useForm<SignupForm>();
    const queryClient = useQueryClient();
    const checkToast = useToast();
    const signupToast = useToast();
    const navigate = useNavigate();
    const [groupCode, setGroupCode] = useState(["9", "9", "9", "9"]);
    const [checkId, setCheckID] = useState(false);
    const mergeCode = () => {
        setGroupCode([watch().code1, watch().code2, watch().code3, watch().code4])
    }
    // ID중복체크
    const checkIdMutation = useMutation(checkUsername, {
        onSuccess: (data) => {
            setCheckID(!checkId)
        },
        onError: (error) => {
            checkToast({
                status: "error",
                description: "이미 존재하는 ID입니다",
                duration: 2000,
            })
        }
    })
    const onSubmitId = () => {
        // console.log(watch().username)
        const username = watch().username
        checkIdMutation.mutate({username})
    }
    const changeInput = () => {
        setCheckID(false)
    }
    // 유저등록
    const mutation = useMutation(signUp, {
        onMutate: () => {
            // console.log("start")
        },
        onSuccess: (data) => {
            signupToast({
                status: "success",
                description: "유저등록이 완료되었습니다!",
                duration: 2000
            })
            onClose()
            queryClient.refetchQueries(['user'])
            reset()
            navigate('/')
        },
        onError: () => {
            signupToast({
                status: "error",
                description: "다시 시도해 주세요",
                duration: 2000
            })
            reset()
        }
    })
    const onSubmit = ({ username, password, email, nickname }: SignupForm) => {
        if (!checkId) {
            checkToast({
                status: "info",
                description: "ID 중복확인을 해주세요",
                duration: 2000,
                isClosable: true
            })
        } else {
            const group_code = groupCode.join('')
            mutation.mutate({username, password, email, nickname, group_code})
        }
    }
    
    // console.log(watch())
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader textAlign={"center"}>Sign Up</ModalHeader>
                <ModalCloseButton />
                <ModalBody as="form" onSubmit={handleSubmit(onSubmit)}>
                <VStack>
                <InputGroup >
                    <InputLeftElement children={<FcPortraitMode/>} />
                    <Input {...register("username")} placeholder="ID" onChange={changeInput}/>
                    {!checkId ? <InputRightElement width='5rem' children={<Button p={1} mr={2} h='1.75rem' size='sm' fontSize={"xs"} onClick={onSubmitId}>ID 중복확인</Button>} /> : <InputRightElement children={<CheckIcon color='green.500' />} />}
                </InputGroup>
                    {checkId ? <Text fontSize={"2xs"} color={"blue.200"}>사용할 수 있는 ID입니다</Text> : null}
                <InputGroup>
                    <InputLeftElement children={<FcBusinesswoman/>} />
                    <Input {...register("nickname")} placeholder="Name"/>
                </InputGroup>
                <InputGroup>
                    <InputLeftElement children={<BiEnvelopeOpen />} />
                    <Input {...register("email")}  placeholder="Email (option)"/>
                </InputGroup>
                <InputGroup>
                    <InputLeftElement children={<FcLock />} />
                    <Input type="password" {...register("password")}  placeholder="PASSWORD" />
                </InputGroup>
                <InputGroup>
                    <InputLeftElement children={<FcLock />} />
                    <Input type="password" {...register("repassword")}  placeholder="PASSWORD CONFIRM" />
                        </InputGroup>
                        {watch().password != watch().repassword ? <Text fontSize={"2xs"} color="red.300">패스워드가 일치하지 않습니다</Text> : null}
                <InputGroup>
                        <Box textAlign={"center"}>Group Code</Box>
                        <HStack>
                        <PinInput  type='alphanumeric' onChange={mergeCode}>
                            <PinInputField {...register("code1")} />
                            <PinInputField {...register("code2")} />
                            <PinInputField {...register("code3")}/>
                            <PinInputField {...register("code4")}/>
                        </PinInput>
                        </HStack>
                </InputGroup>
                </VStack>
                <Button type="submit" mt={5} w="100%" bg={"purple.100"}>Sign up</Button>
                <SocialLogin/>
                </ModalBody>
            </ModalContent>

        </Modal>
    )
}