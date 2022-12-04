import { Badge, Box, Button, Circle, Flex, HStack, Tab, TabList, TabPanel, TabPanels, Tabs, Text, useDisclosure } from "@chakra-ui/react";
import { useQuery } from '@tanstack/react-query'
import { FcFinePrint, FcFullTrash, FcPlanner, FcTodoList } from "react-icons/fc";
import { getTasks } from "../api";
import TodoUpload from "../components/TodoUpload";
import { TasksList } from "../types";

export default function Main() {
    const { isLoading, data } = useQuery<TasksList[]>(['tasks'], getTasks)
    // const { isLoading: isGroupLoading, data: groupData } = useQuery<WorkGroup[]>(['workgroups'], getWorkgroups)
    // console.log(data)
    const { isOpen, onOpen, onClose } = useDisclosure()
    // console.log(data)
    const circleColor = {
        yet: "red.300",
        doing: "blue.200",
        done: "gray.500"
    }
    const badgeColor = {
        task: "red",
        todo: "blue",
        private: "yellow"
    }
    const statusColor = (status: string) => {
        if (status == "yet") {
            return circleColor.yet
        } else if (status == "doing") {
            return circleColor.doing
        } else { return circleColor.done }
    }
    const typeColor = (type:string) => {
        if (type == "task") {
            return badgeColor.task
        } else if (type == "todo") {
            return badgeColor.todo
        } else {
            return badgeColor.private
        }
    }
    return (
        <HStack px={10}>
            <Box w="30%">
                <Button w="100%" mb={3} mt={"35px"} onClick={onOpen} leftIcon={<FcTodoList />}>  일정등록 </Button>
                
                <TodoUpload isOpen={isOpen} onClose={onClose} />

                {data?.map((task) => ( 
                <Flex justifyContent={"flex-start"} alignItems={"center"} key={task.pk}>
                        <Circle size="15px" bg={statusColor(task.status)} />
                        <Badge rounded={"md"} colorScheme={typeColor(task.type)} ml={2} pl={1} pr={1} w={"50px"} h={"23px"}>{task.type}</Badge>
                        <Text ml={2} noOfLines={1}>{task.content}</Text>
                        <HStack ml={"auto"}>
                            <FcFullTrash />
                            <FcFinePrint />
                        </HStack>
                </Flex>
                ))}
                
            </Box>
            <Box w="70%" px={10}>
                <Tabs>
                    <TabList>
                        <Tab>Today</Tab>
                        <Tab>Group</Tab>
                        <Tab>Diary</Tab>
                        <Tab>Reading</Tab>
                        <Tab>Memo</Tab>
                    </TabList>

                    <TabPanels>
                        <TabPanel>
                        <Text>Today Todo List <FcPlanner/> todo detail, default: Today, 날짜선택하면 해당 날짜 todo </Text>
                        </TabPanel>
                        <TabPanel>
                        <p>나와 같은 그룹 사람들 일정 공유 (task / todo)</p>
                        </TabPanel>
                        <TabPanel>
                        <p>다이어리 (공개/비공개)</p>
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