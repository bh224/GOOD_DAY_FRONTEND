import {   Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
    AccordionIcon, Box, VStack, Text, Flex, Badge, HStack
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import { DateToString } from "../lib/utils";
import { TaskDetails } from "../types";



export default function Alltasks({data}:any) {
    // console.log(data)
    const [taskList, setTaskList] = useState<TaskDetails[]>([]);
    const instance = axios.create({
    baseURL: "http://127.0.0.1:8000/api/v1/",
    withCredentials: true, //세션id 
    })
    const dailyTasks = (date:string) => instance.get(`tasks/all?created_at=${date}`).then((response)=>response.data)
    
    const getDailytask = async (date: string) => {
        const data = await dailyTasks(date)
        setTaskList({data}.data)
        console.log(taskList)
    }
    return (
        <VStack>

        <Box>
            My All Tasks
            </Box>
        <Text fontSize={"xs"}>지난 내 일정들을 볼 수 있습니다</Text>
            <Accordion allowToggle w="70%">
                {data?.map((date:string) => (
                    <AccordionItem key={date}>
        <h2>
        <AccordionButton>
                                <Box flex='1' textAlign='left' id={date} onClick={(e) => {
                                    const target = e.target as HTMLDivElement
                                    getDailytask(target.id)
                                }
                                }>
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
                                            : <Text ml={2} noOfLines={1}  flexBasis={250}>{task.content}</Text>}
               

                
                <HStack ml={"auto"}>
                    <Text fontSize={"xs"}>limit: {DateToString(task.limit_date)}</Text>
                </HStack>
            </Flex>
        </Link>
                            ))}
        </AccordionPanel>
    </AccordionItem>
                ))}
    

  
</Accordion>
        </VStack>
    )
}