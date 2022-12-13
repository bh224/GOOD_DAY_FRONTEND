import { Badge, Box, Button, Checkbox, Circle, Flex, HStack, Input, InputGroup, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Select, Text, Textarea, useDisclosure, VStack } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { TaskVariables, uploadTask } from "../api";
import { useForm } from "react-hook-form";
import useWorkgroups from "../lib/useWorkgroups";

interface TodoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function TodoUpload({ isOpen, onClose }: TodoModalProps) {
    const { isGroupLoading, groupData } = useWorkgroups()
    // console.log(groupData)
    const { register, watch, reset, handleSubmit } = useForm<TaskVariables>()
    // console.log(watch())
    const queryClient = useQueryClient()
    const [type, setType] = useState("");
    // console.log("type", type)
    const mutation = useMutation(uploadTask, {
        onMutate: () => {
            console.log("start")
        },
        onSuccess: (data) => {
            reset()
            onClose()
            queryClient.refetchQueries(['tasks'])
        },
        onError: (error) => {
            console.log(error)
        }
    })
    const onSubmit = (data: TaskVariables) => {
        mutation.mutate(data)
    }
    return (
            <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay/>
                    <ModalContent>
                        <ModalCloseButton />
                        <ModalBody  fontSize={"xs"} as="form" onSubmit={handleSubmit(onSubmit)}>
                            <ModalHeader>일정등록</ModalHeader>
                            <Select placeholder="일정 타입을 선택해주세요" size="xs" {...register("type")} onChange={(e)=>setType(e.target.value)}>
                                <option value="task">TASK</option>
                                <option value="todo">TO-DO</option>
                                <option value="private">PRIVATE</option>
                            </Select>
                            {type === "task" ?
                                <VStack w="100%">
                                    <Text fontSize={"xs"}>담당자지정</Text>
                                    <HStack>
                                <Select placeholder="그룹선택" fontSize={"xs"} size="xs" {...register("group_pk")}>
                                            {groupData?.map((group) => (
                                                <option key={group.pk} value={group.pk}>{group.group_name}</option>
                                        ))}
                                    </Select>
                                    <Select placeholder="담당자선택"  fontSize={"xs"}  size="xs" {...register("tasker")}>
                                       {groupData?.map((group) => (
                                           <>{group.members.map((mem) => <option value={mem.pk}> {mem.username}</option>)}</>
                                        ))}
                                    </Select>
                                    </HStack>
                                </VStack>
                                : null}
                            <InputGroup>
                                <VStack w="100%">
                                <Text>내용</Text>
                                    <Textarea {...register("content")} />
                                <Text>마감일</Text>
                                <Input {...register("limit_date")}  fontSize={"xs"} type="date" />
                                </VStack>
                            </InputGroup>
                            <Button type="submit" w="100%">SAVE</Button>
                        </ModalBody>
                    </ModalContent>
                </Modal>
    )
}