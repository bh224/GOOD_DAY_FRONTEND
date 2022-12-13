import { Card, CardHeader, CardBody, CardFooter, VStack, Image, Stack, Heading, Text, PinInput, PinInputField, Button, HStack, useDisclosure, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, InputGroup, InputLeftElement, Input, InputLeftAddon, } from '@chakra-ui/react'
import { ChatIcon } from '@chakra-ui/icons'
import { useQuery, useMutation } from '@tanstack/react-query'
import { createGroup, CreateGroupVariables, getAllGroups } from '../api';
import { WorkGroup } from '../types';
import { useForm } from 'react-hook-form';

export default function AllGroup() {
    const { isLoading, data } = useQuery<WorkGroup[]>(['allgroups'], getAllGroups);
    // console.log(data)
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { register, watch, reset, handleSubmit } = useForm<CreateGroupVariables>();
    console.log(watch())
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
            <Button w="100%" size="sm" leftIcon={<ChatIcon/>} onClick={onOpen}>그룹 만들기</Button>
            {data?.map((group) => (
                <Card
            direction={{ base: 'column', sm: 'row' }}
            overflow='hidden'
                    variant='outline'
                    key={group.pk}
                    height={200}
            >
        <Image
            objectFit='cover'
            maxW={{ base: '100%', sm: '200px' }}
            src='https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60'
            alt='Caffe Latte'
        />

    <Stack>
                        <CardBody height="100%" py={2} px={5}>
                            <HStack>
        <Heading size='md' fontSize={"md"}>{ group.group_name}</Heading>
        <Text py='2' fontSize={"sm"}>
            함께하는 멤버 {group.members.length}
        </Text>
                            </HStack>

        <Text py='2'>
            Caffè latte is a coffee beverage of Italian origin made with espresso
            and steamed milk.
        </Text>
        {group.is_member ?
            <Button size={"sm"} variant='solid' colorScheme='blue' disabled >Already Joined</Button> 
            : <Button size={"sm"} variant='solid' colorScheme='blue'>JOIN</Button>}
                        </CardBody>
    </Stack>
    </Card>
            ))}
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader textAlign={"center"}>그룹 만들기</ModalHeader>
                <ModalCloseButton />
                <ModalBody as="form" fontSize={"sm"} onSubmit={handleSubmit(onSubmit)}>
                <VStack>
                            <InputGroup>
                                <InputLeftAddon fontSize={"sm"} children='그룹 이름' />
                    <Input {...register("group_name")} required/>
                </InputGroup>
                <InputGroup>
                                <InputLeftAddon fontSize={"sm"} children='그룹 설명' />
                    <Input {...register("description")} required/>
                </InputGroup>
                        <Text fontSize={"sm"} textAlign={"center"}>유저 추가는 그룹 상세페이지에서 해주세요</Text>
                        </VStack>
                    
                <Button type="submit" mt={5} w="100%" bg={"purple.100"}>Submit</Button>
   
                </ModalBody>
            </ModalContent>

        </Modal>
        </VStack>
    )
}