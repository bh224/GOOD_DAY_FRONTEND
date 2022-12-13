import { useState } from "react";
import { Badge, Box, Button, Circle, CircularProgress, CircularProgressLabel, Divider, Flex, Heading, HStack, Modal, Progress, Tab, TabList, TabPanel, TabPanels, Tabs, Text, useDisclosure } from "@chakra-ui/react";
import { useQuery } from '@tanstack/react-query'
import { FcFinePrint, FcFullTrash, FcPlanner, FcTodoList } from "react-icons/fc";
import { allTasks, getTasks, getTaskTome } from "../api";
import TodoUpload from "../components/TodoUpload";
import { TasksList } from "../types";
import Task from "../components/Task";
import Alltasks from "../components/AllTasks";
import TaskTome from "../components/TaskTome";
import useWorkgroups from "../lib/useWorkgroups";
import GroupTasks from "../components/GroupTasks";
import { formatDate } from "../lib/utils";
import AllGroup from "../components/AllGroup";

interface detailProps {
    detailPk: string;
}
interface allProps {
    data: []
}

export default function Main() {
    const today = new Date()
    const { isLoading, data } = useQuery<TasksList[]>(['tasks'], getTasks, {retry:false})
    const { data: Tome } = useQuery<TasksList[]>(['tome'], getTaskTome, { retry: false })
    const { isLoading: isAllLoading, data: allTaskData } = useQuery(['alltasks'], allTasks, { retry: false })
    const { isGroupLoading, groupData } = useWorkgroups()
    // 일정등록모달
    const { isOpen, onOpen, onClose } = useDisclosure()


    return (
        <HStack px={10} justifyContent={"center"} alignItems={"flex-start"}>
            <Box w="35%">
                <Button w="100%" mb={3} mt={"35px"} onClick={onOpen} leftIcon={<FcTodoList />}>  일정등록 </Button>
                <HStack justifyContent={"flex-start"} ml={2} mr={2} fontSize="xs">
                    <Text>{formatDate(today)}</Text>
                    <Progress colorScheme='green' size='sm' value={20} flex="1"/>
                    <Text>20%</Text>
                </HStack>
                <HStack fontSize={"xs"} justifyContent={"space-evenly"}  m={2}>
                    <HStack>
                    <Circle size="10px" bg={"red.300"} />
                    <Text>확인전</Text>
                    </HStack>
                    <HStack>
                    <Circle size="10px" bg={"blue.200"} />
                        <Text>진행중</Text>
                        </HStack>
                    <HStack>
                    <Circle size="10px" bg={"gray.500"} />
                        <Text>완료</Text>
                        </HStack>
                </HStack>
                <TodoUpload isOpen={isOpen} onClose={onClose} />
                <Box borderWidth='1px' borderRadius='lg' p={2} mb={2} boxShadow='md'>
                    <Heading textAlign={"center"} fontSize={"sm"} mb={2}>나에게 온 할 일</Heading>
                    <Divider mb={2}/>
                {Tome?.map((task) => ( 
                    <TaskTome
                    key={task.pk}
                    pk={task.pk}
                    author={task.author}
                    tasker={task.tasker}
                    type={task.type}
                    status={task.status}
                    content={task.content}
                        limit_date={task.limit_date}
                        group={task.group}
                        counts={task.counts}
                    />
                    ))}
                </Box>
                <Box borderWidth='1px' borderRadius='lg' p={2} boxShadow='md'>
                    <Heading textAlign={"center"} fontSize={"sm"} mb={2}>내가 등록한 할 일</Heading>
                    <Divider mb={2} />
                {data?.map((task) => ( 
                    <Task
                        key={task.pk}
                        pk={task.pk}
                        author={task.author}
                        tasker={task.tasker}
                        type={task.type}
                        status={task.status}
                        content={task.content}
                        limit_date={task.limit_date}
                        group={task.group}
                        counts={task.counts}
                    />
                ))}
                </Box>
            </Box>
            <Box w="65%" px={10} >
                <Tabs mt={4} isFitted >
                    <TabList>
                        <Tab>MyTasks</Tab>
                        <Tab>MyWorkgroup</Tab>
                        <Tab>Other Groups</Tab>
                        <Tab>Reading</Tab>
                    </TabList>

                    <TabPanels>
                        <TabPanel>
                            {!isAllLoading ?
                                <Alltasks
                                data={allTaskData}
                            /> : null}
                            
                        </TabPanel>
                        <TabPanel>
                        {!isGroupLoading ?
                                <GroupTasks
                                data={groupData}
                            /> : null}
                        </TabPanel>
                        <TabPanel>
                            <AllGroup />
                        </TabPanel>
                        <TabPanel>
                        <p>독서노트</p>
                        </TabPanel>
                        <TabPanel>
                        <p>keep memo</p>
                        </TabPanel>
                    </TabPanels>
                    </Tabs>
            </Box>
        </HStack>
        
    )
}