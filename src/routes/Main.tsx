import {
  Box,
  Button,
  Circle,
  Divider,
  Heading,
  HStack,
  Progress,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from 'react-helmet';
import {FcTodoList} from "react-icons/fc";
import { getTasks, getMyGroupTask, tasksCounts } from "../api";
import TodoUpload from "../components/TodoUpload";
import { TasksList } from "../types";
import Task from "../components/Task";
import Alltasks from "../components/AllTasks";
import MyGroupTask from "../components/MyGroupTask";
import useWorkgroups from "../lib/useWorkgroups";
import GroupTasks from "../components/GroupTasks";
import { formatDate } from "../lib/utils";
import AllGroup from "../components/AllGroup";
import useGroupPageList from "../lib/useGroupPageList";


export default function Main() {
  const today = new Date();
  const { data } = useQuery<TasksList[]>(["myTodos"], getTasks, { retry: false });
  const { data: myGroupTask } = useQuery<TasksList[]>(["myGroupTask"], getMyGroupTask, {retry: false});
  const { data: taskCounts } = useQuery(['progress'], tasksCounts)
  const { groupPageList } = useGroupPageList();
  const allCount = taskCounts?.data.all
  const doneCount = taskCounts?.data.done
  const progress = (doneCount / allCount) * 100
  // 일정등록모달
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Stack
      direction={{
        base: "column",
        sm: "column",
        md: "row"
      }}
      px={{ base: "5", md: "10"}} py={{base: "0", md: "150"}} justifyContent={"center"} alignItems={"flex-start"}>
      <Helmet>
        <title>goodday</title>
      </Helmet>
      <Box
        w={{ base: "100%", sm: "100%", md: "35%" }}
        h={{base: "450", md: "700px"}}
      >
        <Button
          w="100%"
          mb={3}
          mt={"35px"}
          onClick={onOpen}
          leftIcon={<FcTodoList />}
        >
          {" "}일정등록{" "}
        </Button>
        <HStack justifyContent={"flex-start"} ml={2} mr={2} fontSize="xs">
          <Text>{formatDate(today)}</Text>
          {isNaN(progress) ?
            <Progress colorScheme="gray.100" size="sm" value={0} flex="1" />
            : <Progress colorScheme="green" size="sm" value={progress} flex="1" />}
          {progress? <Text>{isNaN(progress) ? "-" : progress} %</Text>: <Text>0</Text>}
          {allCount? <Text>{doneCount}/{allCount}</Text> : <Text>0/0</Text>}
        </HStack>
        <HStack fontSize={"xs"} justifyContent={"space-evenly"} mt={2} mb={5}>
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
        <Box borderWidth="1px" borderRadius="lg" p={2} mb={5} boxShadow="md">
          <Heading textAlign={"center"} fontSize={"sm"} mb={2}>
            그룹 일정
          </Heading>
          <Divider mb={2} />
          {myGroupTask ?
            <>
            {myGroupTask?.map((task) => (
            <MyGroupTask
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
            </>
          : null }
        </Box>
        <Box borderWidth="1px" borderRadius="lg" p={2} boxShadow="md">
          <Heading textAlign={"center"} fontSize={"sm"} mb={2}>
            개인 일정
          </Heading>
          <Divider mb={2} />
          {data ?
            <>
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
            ))} </>
           : null }
        </Box>
      </Box>
      <Box w={{base: "100%", md: "65%"}} pl={{base: "0",md: "10"}}>
        <Tabs mt={4} h={{base: "450", md: "500px"}} isFitted>
          <TabList>
            <Tab>MyTasks</Tab>
            <Tab>MyGroup</Tab>
            <Tab>JoinUs</Tab>
          </TabList>
          <TabPanels  overflowY={"scroll"}>
            <TabPanel>
              <Alltasks />
            </TabPanel>
            <TabPanel>
              {groupPageList ? <GroupTasks totalpage={groupPageList.mygroup} />  : null}
            </TabPanel>
            <TabPanel>
              {groupPageList ? <AllGroup totalpage={groupPageList.allgroup} /> : null}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Stack>
  );
}
