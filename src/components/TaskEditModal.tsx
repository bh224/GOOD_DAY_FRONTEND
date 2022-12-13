import { Badge, Box, Button, Checkbox, Circle, Flex, HStack, Input, InputGroup, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Select, Text, Textarea, useDisclosure, VStack } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { editTask, TaskVariables } from "../api";
import { DateToString } from "../lib/utils";

interface TaskDetailProps {
    isOpen: boolean;
    onClose: () => void;
    type: string | undefined;
    status: string | undefined;
    content: string | undefined;
    limit_date: string | undefined;
    pk: string | undefined;
}

export default function TaskEditModal({ isOpen, onClose, type, status, content, limit_date, pk }:TaskDetailProps) {
    const { register, watch, reset, handleSubmit } = useForm<TaskVariables>()
    // console.log(watch())
    const queryClient = useQueryClient()
    const mutation = useMutation(editTask, {
        onMutate: () => {
            console.log("start")
        },
        onSuccess: (data) => {
            console.log(data)
            reset()
            onClose()
            queryClient.refetchQueries(['task'])
        },
        onError: (error) => {
            console.log(error)
        }
    })
    const onSubmit = (data: TaskVariables) => {
        console.log(">>>>", data)
        mutation.mutate(data)
    }
    return (
                        <Modal isOpen = { isOpen } onClose = { onClose }>
                    <ModalOverlay/>
                    <ModalContent>
                        <ModalCloseButton />
                        <ModalBody  fontSize={"xs"} as="form" onSubmit={handleSubmit(onSubmit)}>
                    <ModalHeader>일정변경</ModalHeader>
                    <Input fontSize={"xs"} {...register("pk")} value={pk} />
                  
                    <Select  size="xs" {...register("type")} defaultValue={type}>
                                <option value="task">TASK</option>
                                <option value="todo">TO-DO</option>
                                <option value="private">PRIVATE</option>
                        </Select>
                     
                                <VStack w="100%">
                                    <Text fontSize={"xs"}>담당자변경</Text>
                                    <HStack>
                                    <Box w={100}>그룹명</Box>
                      
                                    <Select  fontSize={"xs"}  size="xs" {...register("tasker")}>
                                                <option></option>
                                        </Select>
                           
                                    </HStack>
                                </VStack>
                       
                            <InputGroup>
                                <VStack w="100%">
                            <Text>내용</Text>
                            
                            <Textarea {...register("content")} defaultValue={content} />
                                <Text>진행상황</Text>
                                <Select fontSize={"xs"}  size="xs" {...register("status")} defaultValue={status}>
                                        <option value="yet">확인전</option>
                                        <option value="doing">진행중</option>
                                        <option value="done">완료</option>
                                    </Select>
                                <Text>마감일</Text>
                            <Input {...register("limit_date")} fontSize={"xs"} type="date" defaultValue={limit_date?DateToString(limit_date):"2022-12-01"}/>
                                </VStack>
                    </InputGroup>
                                        
                            <Button type="submit" w="100%">EDIT</Button>
                        </ModalBody>
                    </ModalContent>
                </Modal > 
    )
}