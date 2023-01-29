import {   Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
    AccordionIcon, Box, VStack, Text, Flex, Badge, HStack, Button
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getDateList, dailyTask } from "../api";
import useDatePageList from "../lib/useDatePageList";
import { DateToString } from "../lib/utils";
import { TaskDetails } from "../types";

interface allProps {
    data: string[];
}

export default function Alltasks({ data }: any) {
    const { pageLoading, pageList } = useDatePageList();
    const [taskList, setTaskList] = useState<TaskDetails[]>([]);
    const [page, setPage] = useState("1");
    const [totalPage, setTotalPage] = useState("1");
    const { isLoading: isAllLoading, data: dateList } = useQuery<allProps>(["date-list", page], getDateList, { retry: false });

    const getDailytask = async (date: string) => {
        const data = await dailyTask(date)
        setTaskList({ data }.data)
    }

    return (
        <VStack>
            <Box>
                My All Tasks
            </Box>
            <Text fontSize={"xs"}>지난 내 일정들을 볼 수 있습니다</Text>
            <Accordion allowToggle w={{base: "100%", md: "100%"}} >
                {dateList?.data?.map((date:string, idx:number) => (
                    <AccordionItem key={idx}>
                        <h2>
                        <AccordionButton>
                        <Box flex='1' textAlign='left' id={date} onClick={(e) => {
                            const target = e.target as HTMLDivElement
                            getDailytask(target.id)
                            }}>
                            {date}
                        </Box>
                        <AccordionIcon />
                        </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                            {taskList.map((task) => (
                                <Link to={`task/${task.pk}`}>
                                <Flex key={task.pk} justifyContent={"flex-start"} alignItems={"center"}  _hover={{bg:"yellow.100"}}>
                                    <Badge textAlign={"center"} rounded={"md"} ml={2} pl={1} pr={1} w={"70px"} h={"23px"} colorScheme={"purple"}>{task.type}</Badge>
                                        {task.status == "done" ?
                                            <Text textDecoration={"line-through"} ml={2} noOfLines={1}  flexBasis={250}>{task.content}</Text>
                                            : <Text ml={2} noOfLines={1} flexBasis={250}>{task.content}</Text>}
                                    <Text display={{base: "none", md: "inline-block"}} ml={"auto"} fontSize={"xs"}>limit: {DateToString(task.limit_date)}</Text>
                                </Flex>
                                </Link>
                                ))}
                    </AccordionPanel>
                    </AccordionItem>
                            ))}
            </Accordion>
            <HStack>
                {pageList?.data?.map((page: number, idx: number)=>(
                    <Button size={"xs"} key={idx} id={page.toString()} onClick={(e) => {
                        const target = e.target as HTMLDivElement
                        // requestPage(target.id)
                        setPage(target.id)
                    }}>{page}</Button>
                ))}
            </HStack>
        </VStack>
    )
}