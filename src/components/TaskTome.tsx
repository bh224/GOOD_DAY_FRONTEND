import { Badge, Box, Button, Circle, Flex, HStack, Modal, Text, useDisclosure } from "@chakra-ui/react";
import { FcCollaboration, FcSms } from "react-icons/fc";
import { Link } from "react-router-dom";
import { TasksList } from "../types";


export default function TaskTome({ pk, tasker, status, type, content, limit_date, counts }: TasksList) {
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
        <Link to={`task/${pk}`}>
            <Flex justifyContent={"flex-start"} alignItems={"center"}  _hover={{bg:"yellow.100"}}>
                <Circle size="15px" bg={statusColor(status)} />
                <Badge rounded={"md"} colorScheme={typeColor(type)} textAlign={"center"} ml={2} pl={1} pr={1} w={"50px"} h={"23px"}>{type}</Badge>
                <Text ml={2} noOfLines={1} >{content}</Text>
                <HStack ml={"auto"}>
                    <FcCollaboration children={<Text>group</Text>} size={25} />
                    <Text fontSize={"xs"}>group</Text>
                    <FcSms size={25} />
                    <Text fontSize={"xs"}>{counts}</Text>
            </HStack>
            </Flex>
        </Link>
    )
}