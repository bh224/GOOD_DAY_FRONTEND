import { VStack, Text, Button, useDisclosure, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, InputGroup, Input, InputLeftAddon, useToast, } from '@chakra-ui/react'
import { ChatIcon } from '@chakra-ui/icons'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createGroup, CreateGroupVariables, getAllGroups } from '../api';
import { WorkGroup } from '../types';
import { useForm } from 'react-hook-form';
import Group from './Group';


export default function AllGroup() {
    const { isLoading, data } = useQuery<WorkGroup[]>(['allgroups'], getAllGroups);
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
            queryClient.refetchQueries(['allgroups'])
        },
        onError: (error) => {
            toast({
                status: "error",
                title: "다시 시도해 주세요"
            })
        }
    })
    const onSubmit = ({ group_name, description }:CreateGroupVariables) => {
        // console.log(group_name, description)
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
                        member={group.member}
                        group_code={group.group_code}
                        group_name={group.group_name}
                        members={group.members}
                        is_member={group.is_member}
                        description={group.description}
                    />
                ))}
            </VStack>
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