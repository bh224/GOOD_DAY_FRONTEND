import {   Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
    AccordionIcon, Box, VStack, Text, Flex, Badge, HStack
} from "@chakra-ui/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { groupTasks } from "../api";
import { DateToString } from "../lib/utils";
import { TaskDetails } from "../types";

export default function GroupTasks({ data }: any) {
    const [groupList, setGroupList] = useState<TaskDetails[]>([]);
    const getGrouptask = async (pk: string) => {
        const data = await groupTasks(pk)
        setGroupList(data)
    }
    // console.log(getDailytask)
    return (
        <VStack>
            <Box>Group Members Tasks</Box>
            <Text fontSize={"xs"}>내가 속한 그룹 유저들의 오늘 할 일을 볼 수 있습니다</Text>
            <Accordion allowToggle w={{base: "100%", md: "100%"}}>
                {data.map((group:any) => (
                    <AccordionItem key={group.pk}>
                    <h2>        
                    <AccordionButton>
                    <Box flex='1' textAlign='left' id={group.pk} onClick={(e) => {
                        const target = e.target as HTMLDivElement
                        getGrouptask(target.id)
                    }}>
                    {group.group_name}
                    </Box>
                    <AccordionIcon />
                    </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                            {groupList.map((task) => (
                                <Link to={`task/${task.pk}`} key={task.pk}>
            <Flex justifyContent={"flex-start"} alignItems={"center"} _hover={{bg:"yellow.100"}}>
                                        <Badge textAlign={"center"} rounded={"md"} ml={2} pl={1} pr={1} w={"50px"} h={"23px"} colorScheme={"purple"}>{task.status}</Badge>
                                        {task.status == "done" ?
                                            <Text textDecoration={"line-through"} ml={2} noOfLines={1}  flexBasis={250}>{task.content}</Text>
                                            : <Text ml={2} noOfLines={1}  flexBasis={250}>{task.content}</Text>}
                <HStack ml={"auto"} display={{base: "none", md: "flex"}}>
                    <Text fontSize={"xs"}>by {task.author.nickname}</Text>
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