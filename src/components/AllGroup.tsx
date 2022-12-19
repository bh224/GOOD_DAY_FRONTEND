import { Card, CardHeader, CardBody, CardFooter, VStack, Image, Stack, Heading, Text, PinInput, PinInputField, Button, HStack, useDisclosure, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, InputGroup, InputLeftElement, Input, InputLeftAddon, } from '@chakra-ui/react'
import { ChatIcon } from '@chakra-ui/icons'
import { useQuery, useMutation } from '@tanstack/react-query'
import { createGroup, CreateGroupVariables, getAllGroups } from '../api';
import { WorkGroup } from '../types';
import { useForm } from 'react-hook-form';
import Group from './Group';


export default function AllGroup() {
    const { isLoading, data } = useQuery<WorkGroup[]>(['allgroups'], getAllGroups);
    // console.log(data)
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { register, watch, reset, handleSubmit } = useForm<CreateGroupVariables>();
    // console.log(watch())
    const mutation = useMutation(createGroup, {
        onSuccess: (data) => {
            console.log(data)
            reset()
            onClose()
        },
        onError: (error) => {
            console.log(error)
        }
    })
    const onSubmit = ({ group_name, description }:CreateGroupVariables) => {
        console.log(group_name, description)
        mutation.mutate({ group_name, description })
    }
    return (
        <VStack>
            <Button w="60%" mb={5} size="sm" leftIcon={<ChatIcon/>} onClick={onOpen}>그룹 만들기</Button>
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