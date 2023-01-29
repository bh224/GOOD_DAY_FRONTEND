import { VStack, Text, Button, useDisclosure, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, InputGroup, Input, InputLeftAddon, useToast, HStack, } from '@chakra-ui/react'
import { ChatIcon } from '@chakra-ui/icons'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createGroup, CreateGroupVariables, getAllGroups } from '../api';
import { AllWorkGroupList } from '../types';
import { useForm } from 'react-hook-form';
import Group from './Group';
import { useState } from 'react';
import useUser from "../lib/useUser";


export default function AllGroup({ totalpage }: any) {
    const { userLoading, user, isLoggedIn } = useUser();
    const [page, setPage] = useState("1");
    const { isLoading, data } = useQuery<AllWorkGroupList[]>(['allGroups', page], getAllGroups, {retry:false, enabled:!isLoggedIn});

    const queryClient = useQueryClient();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { register, watch, reset, handleSubmit } = useForm<CreateGroupVariables>();
    const toast = useToast();
    // 그룹생성
    const mutation = useMutation(createGroup, {
        onSuccess: (data) => {
            toast({
                status: "success",
                title: "그룹이 생성 되었습니다"
            })
            reset()
            onClose()
            queryClient.refetchQueries(['allGroups', '1'])
        },
        onError: (error) => {
            toast({
                status: "error",
                title: "다시 시도해 주세요"
            })
        }
    })
    const onSubmit = ({ group_name, description }:CreateGroupVariables) => {
        mutation.mutate({ group_name, description })
    }
    return (
        <VStack w={"100%"}>
            <Button w={"60%"} mb={5} size="sm" leftIcon={<ChatIcon />} onClick={onOpen}>그룹 만들기</Button>
            <VStack w={"100%"}>
                {data?.map((group) => (
                    <Group
                        key={group.pk}
                        pk={group.pk}
                        group_code={group.group_code}
                        group_name={group.group_name}
                        is_member={group.is_member}
                        description={group.description}
                        member_cnt={group.member_cnt}
                    />
                ))}
            </VStack>
            <HStack>
                {totalpage.map((page: number, idx: number)=>(
                    <Button size={"xs"} key={idx} id={page.toString()} onClick={(e) => {
                        const target = e.target as HTMLDivElement
                        // requestPage(target.id)
                        setPage(target.id)
                    }}>{page}</Button>
                ))}
            </HStack>
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader textAlign={"center"}>그룹 만들기</ModalHeader>
                <ModalCloseButton />
                <ModalBody as="form" fontSize={"sm"} onSubmit={handleSubmit(onSubmit)}>
                <VStack>
                    <InputGroup>
                        <InputLeftAddon textAlign={"center"} w="30%" fontSize={"sm"} children='Group Name' />
                        <Input {...register("group_name")} required/>
                    </InputGroup>
                    <InputGroup>
                        <InputLeftAddon w="30%" fontSize={"sm"} children='Description' />
                        <Input {...register("description")} required/>
                    </InputGroup>
                    <Text fontSize={"xs"} textAlign={"center"} py={2}>유저 추가는 그룹 상세페이지에서 해주세요</Text>
                </VStack>
                <Button type="submit" my={5} w="100%" colorScheme='teal' variant='outline'>Submit</Button>
                </ModalBody>
            </ModalContent>
        </Modal>
        </VStack>
    )
}