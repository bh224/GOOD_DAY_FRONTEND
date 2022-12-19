import { Badge, Box, Button, Checkbox, Circle, Flex, HStack, Input, InputGroup, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Select, Text, Textarea, useDisclosure, VStack } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { editTask, EditTaskVariables, TaskVariables } from "../api";
import { DateToString } from "../lib/utils";
import { GroupMembers, WorkGroup } from "../types";
import { useEffect, useState } from "react";
import useWorkgroups from "../lib/useWorkgroups";



interface TaskDetailProps {
    isOpen: boolean;
    onClose: () => void;
    pk: string | undefined;
    type: string | undefined;
    status: string | undefined;
    content: string | undefined;
    limit_date: string | undefined;
    group_name: string | undefined;
    tasker: GroupMembers | undefined;
    group_pk: number | undefined;
}

export default function TaskEditModal({ isOpen, onClose, pk, type, status, content, limit_date, group_name, tasker, group_pk }: TaskDetailProps) {
     const { isGroupLoading, groupData } = useWorkgroups()
    const { register, watch, reset, handleSubmit } = useForm<EditTaskVariables>()
    const [taskType, setTaskType] = useState("");
    const [groupIndex, setGroupIndex] = useState(0);
    const queryClient = useQueryClient()
    useEffect(() => {
        if (type === "task") {
            setTaskType(type)
    }}, [type])
    const mutation = useMutation(editTask, {
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
    const onSubmit = ({type, tasker, content, status, limit_date, groupPk}: EditTaskVariables) => {
        mutation.mutate({type, tasker, content, status, limit_date, pk, groupPk})
    }

console.log(watch())
    return (
                        <Modal isOpen = { isOpen } onClose = { onClose }>
                    <ModalOverlay/>
                    <ModalContent>
                        <ModalCloseButton />
                        <ModalBody  fontSize={"xs"} as="form" onSubmit={handleSubmit(onSubmit)}>
                    <ModalHeader>일정변경</ModalHeader>

                            <Select placeholder="일정 타입을 선택해주세요" size="xs" defaultValue={type} {...register("type")} onChange={(e)=>setTaskType(e.target.value)}>
                                <option value="task">TASK</option>
                                <option value="todo">TO-DO</option>
                                <option value="private">PRIVATE</option>
                            </Select>
                    {taskType === "task" ? 
                        <VStack pt={5}>
                            <HStack fontSize={"xs"}>
                                <Text  fontWeight={"bold"}>{group_name}</Text>
                                <Text>assigned to...</Text>
                                <Text  fontWeight={"bold"}>{tasker?.nickname}</Text>
                            </HStack>
                            <Text fontSize={"xs"}>담당자변경</Text>
                            <HStack w="80%" justifyContent={"space-evenly"}>
                                <Select placeholder="그룹선택" fontSize={"xs"} size="xs" {...register("groupPk")} onChange={(e) => {
                                    const optionIndex = e.target.selectedIndex -1
                                    setGroupIndex(optionIndex)
                                }}>
                            {groupData?.map((group, index) => (
                                <option key={index} value={group.pk}>{group.group_name}</option>
                            ))}
                            </Select>
                    <Select placeholder="담당자선택" fontSize={"xs"} size="xs" {...register("tasker")}>
                        {
                        groupData![groupIndex].members.map((member) =>
                            <option key={member.pk} value={member.pk}>{member.nickname}</option>
                        )}
                    </Select>
                    
                            </HStack>
                        </VStack>    
                       : null }
                       
                            <InputGroup>
                                <VStack w="100%" pt={5}>
                            <Text>내용</Text>
                            
                            <Textarea {...register("content")} defaultValue={content} />
                                <Text pt={5}>진행상황</Text>
                                <Select fontSize={"xs"}  size="xs" {...register("status")} defaultValue={status}>
                                        <option value="yet">확인전</option>
                                        <option value="doing">진행중</option>
                                        <option value="done">완료</option>
                                    </Select>
                            <Text pt={5}>마감일</Text>
                            <Input {...register("limit_date")} fontSize={"xs"} type="date" defaultValue={limit_date?DateToString(limit_date):"0000-00-00"}/>
                                </VStack>
                    </InputGroup>
                                        
                            <Button type="submit" my={5} w="100%" colorScheme='teal' variant='outline'>EDIT</Button>
                        </ModalBody>
                    </ModalContent>
                </Modal > 
    )
}