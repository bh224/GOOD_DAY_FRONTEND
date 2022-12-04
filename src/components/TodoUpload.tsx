import { Badge, Box, Button, Checkbox, Circle, Flex, HStack, Input, InputGroup, Kbd, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Select, Tab, TabList, TabPanel, TabPanels, Tabs, Text, Textarea, useDisclosure, VStack } from "@chakra-ui/react";
import { useQuery } from '@tanstack/react-query'
import { useState } from "react";
import { WorkGroup } from "../types";
import { getWorkgroups } from "../api";

interface TodoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function TodoUpload({ isOpen, onClose }: TodoModalProps) {
    const { isLoading: isGroupLoading, data: groupData } = useQuery<WorkGroup[]>(['workgroups'], getWorkgroups)
    const [ type, setType ] = useState("");
    return (
            <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay/>
                    <ModalContent>
                        <ModalCloseButton />
                        <ModalBody  fontSize={"xs"}>
                            <ModalHeader>일정등록</ModalHeader>
                            <Select placeholder="일정 타입을 선택해주세요" size="xs" onChange={(e)=>setType(e.target.value)}>
                                <option value="task">TASK</option>
                                <option value="todo">TO-DO</option>
                                <option value="private">PRIVATE</option>
                            </Select>
                            {type === "task" ?
                                <VStack w="100%">
                                    <Text fontSize={"xs"}>담당자지정</Text>
                                    <HStack>
                                    <Select placeholder="그룹선택"  fontSize={"xs"}  size="xs">
                                            {groupData?.map((group) => (
                                                <option value={group.code}>{group.name}</option>
                                        ))}
                                    </Select>
                                    <Select placeholder="담당자선택"  fontSize={"xs"}  size="xs">
                                       {groupData?.map((group) => (
                                           <>{group.member.map((mem) => <option value={mem.pk}> {mem.nickname}</option>)}</>
                                        ))}
                                    </Select>
                                    </HStack>
                                </VStack>
                                : null}
                            <InputGroup>
                                <VStack w="100%">
                                <Text>내용</Text>
                                    <Textarea />
                                <Text>마감일</Text>
                                <Input  fontSize={"xs"} type="date" />
                                </VStack>
                            </InputGroup>
                            <Button w="100%">SAVE</Button>
                        </ModalBody>
                    </ModalContent>
                </Modal>
    )
}