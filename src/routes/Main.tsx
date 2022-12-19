import {
  Badge,
  Box,
  Button,
  Circle,
  Divider,
  Heading,
  HStack,
  Progress,
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
import { allTasks, getTasks, getTaskTome, tasksCounts } from "../api";
import TodoUpload from "../components/TodoUpload";
import { TasksList } from "../types";
import Task from "../components/Task";
import Alltasks from "../components/AllTasks";
import TaskTome from "../components/TaskTome";
import useWorkgroups from "../lib/useWorkgroups";
import GroupTasks from "../components/GroupTasks";
import { formatDate } from "../lib/utils";
import AllGroup from "../components/AllGroup";

interface allProps {
  data: string[];
}

export default function Main() {
  const today = new Date();
  const { data } = useQuery<TasksList[]>(["tasks"], getTasks, { retry: false });
  const { data: Tome } = useQuery<TasksList[]>(["tome"], getTaskTome, {retry: false});
  const { data: taskCounts } = useQuery(['counts'], tasksCounts)
  const allCount = taskCounts?.data.all
  const doneCount = taskCounts?.data.done
  const progress = (doneCount / allCount) * 100
  // console.log(progress)
  const { isLoading: isAllLoading, data: allTaskData } = useQuery<allProps>(["alltasks"], allTasks, { retry: false });
  // console.log(allTaskData?.data)
  const { isGroupLoading, groupData } = useWorkgroups();
  // 일정등록모달
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <HStack px={10} py={150} justifyContent={"center"} alignItems={"flex-start"}>
      <Helmet>
        <title>goodday</title>
      </Helmet>
      <Box w="35%">
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
            나에게 온 할 일
          </Heading>
          <Divider mb={2} />
          {Tome ?
            <>
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
            </>
          : null }
        </Box>
        <Box borderWidth="1px" borderRadius="lg" p={2} boxShadow="md">
          <Heading textAlign={"center"} fontSize={"sm"} mb={2}>
            내가 등록한 할 일
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
      <Box w="65%" px={10}>
        <Tabs mt={4} isFitted>
          <TabList>
            <Tab>MyTasks</Tab>
            <Tab>MyWorkgroup</Tab>
            <Tab>Other Groups</Tab>
            <Tab>Recommend</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              {allTaskData ? <Alltasks data={allTaskData?.data} /> : null}
            </TabPanel>
            <TabPanel>
              {groupData ? <GroupTasks data={groupData} /> : null}
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
  );
}
