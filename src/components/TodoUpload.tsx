import { Badge, Box, Button, Checkbox, Circle, Flex, HStack, Input, InputGroup, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Select, Text, Textarea, useDisclosure, useToast, VStack } from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getWorkgroups, TaskVariables, uploadTask } from "../api";
import { useForm } from "react-hook-form";
import useWorkgroups from "../lib/useWorkgroups";

interface TodoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface Members {
    pk: number;
    username: string;
    nickname: string;
}

interface GetMyGroups {
    pk: number;
    group_name: string;
    members: Members[];
}

export default function TodoUpload({ isOpen, onClose }: TodoModalProps) {
    const { data:groupData } = useQuery<GetMyGroups[]>(['myWorkgriyos', 'all'], getWorkgroups)
    // console.log(groupData)
    const { register, watch, reset, handleSubmit } = useForm<TaskVariables>()
    const queryClient = useQueryClient()
    const [type, setType] = useState("");
    const [groupIndex, setGroupIndex] = useState(0);
    const toast = useToast();
    const mutation = useMutation(uploadTask, {
        onSuccess: (data) => {
            queryClient.refetchQueries(['myTodos'])
            queryClient.refetchQueries(['myGroupTask'])
            toast({
                status: "success",
                title: "일정이 등록되었습니다",
            })
            reset()
            onClose()
        },
        onError: (error) => {
            toast({
                status: "error",
                title: "다시 시도해 주세요"
            })
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
                                <VStack w="100%"  py={2}>
                                    <Text fontSize={"xs"}>담당자지정</Text>
                                    <HStack>
                                <Select placeholder="그룹선택" fontSize={"xs"} size="xs" {...register("group_pk")} onChange={(e) => {
                                    const optionIndex = e.target.selectedIndex -1
                                    setGroupIndex(optionIndex)
                                }}>
                                            {groupData?.map((group) => (
                                                <option key={group.pk} value={group.pk}>{group.group_name}</option>
                                        ))}
                                    </Select>
                                    <Select placeholder="담당자선택"  fontSize={"xs"}  size="xs" {...register("tasker")}>
                                        {
                                        groupData![groupIndex].members.map((member) =>
                                            <option key={member.pk} value={member.pk}>{member.nickname}</option>
                                        )}
                                    </Select>
                                    </HStack>
                                </VStack>
                                : null}
                            <InputGroup>
                                <VStack w="100%" >
                                <Text>내용</Text>
                                    <Textarea {...register("content")} />
                                <Text>마감일</Text>
                                <Input {...register("limit_date")}  fontSize={"xs"} type="date" />
                                </VStack>
                            </InputGroup>
                            <Button my={5} type="submit" w="100%" colorScheme='teal' variant='outline'>SAVE</Button>
                        </ModalBody>
                    </ModalContent>
                </Modal>
    )
}