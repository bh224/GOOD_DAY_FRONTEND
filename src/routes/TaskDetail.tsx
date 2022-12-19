
import { Heading, VStack, Text, HStack, Card, CardHeader, CardBody, Box, Stack, StackDivider, Button, Input, useDisclosure, InputGroup, InputRightElement, InputLeftAddon, Badge, useToast } from "@chakra-ui/react";
import { deleteTask, getComment, getTask, postComment } from "../api";
import { CommentDetails, TaskDetails } from "../types";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import TaskEditModal from "../components/TaskEditModal";
import { DateToString, taskType, typeColor } from "../lib/utils";
import useUser from "../lib/useUser";
import Comment from "../components/Comment";
import { BiChat } from "react-icons/bi";
import { FiSend } from "react-icons/fi";
import { useForm } from "react-hook-form";

export default function TaskDetail() {
  const { pk } = useParams();
  const { userLoading, user, isLoggedIn } = useUser();
  const navigate = useNavigate();
  const toast = useToast();
  const { isLoading:isTaskLoading, data: taskData } = useQuery<TaskDetails>(['task', pk], getTask);
  const { data: commentData } = useQuery<CommentDetails[]>(['comment', pk], getComment)
  const {register, watch, handleSubmit, reset} = useForm()
    // console.log(watch())
  const { isOpen, onOpen, onClose } = useDisclosure()
  const queryClient = useQueryClient();
  const deleteMutation = useMutation(deleteTask, {
    onSuccess: () => {
    toast({
        status: "success",
        title: "삭제되었습니다",
        isClosable: true
      })
      navigate('/')
    },
    onError: (error: any) => {
      toast({
        status: "error",
        title: error.response.data.detail,
        isClosable: true
      })
      console.log(error.response.data)
    }
  })
  const deleteSubmit = async () => {
    alert("이 일정을 삭제합니다")
    console.log("clicke delete")
    deleteMutation.mutate(pk)
  }

    const mutation = useMutation(postComment, {
    onSuccess: (data) => {
        console.log(">>success", data)
        reset()
      queryClient.refetchQueries(['comment'])
    },
    onError: () => {
      console.log("error")
    }
  })
  const onSubmit = (data:any) => {
    const content = data.content
    mutation.mutate({ pk, content })
  }

    return (<HStack justifyContent={"center"} alignItems={"flex-start"} spacing={10} py={150}>
        <Card width={"40%"}>
  <CardHeader>
    <Heading size='md'>MY TASK</Heading>
  </CardHeader>

  <CardBody>
    <Stack divider={<StackDivider />} spacing='4'>
      <Box>
        <Heading size='xs' textTransform='uppercase'>
        {taskData?.group != null ? taskData.group.group_name : <Text>개인 일정</Text>} 
        </Heading>
        <Text pt='2' fontSize='sm'>
                <HStack>
                  <Badge textAlign={"center"} rounded={"md"} colorScheme={typeColor(taskData?.type)} pl={1} pr={1} w={"70px"} h={"23px"}>{taskData?.type}</Badge>
                <Text>
                  To. {taskData?.tasker ? taskData?.tasker.nickname : taskData?.author.username} , From. {taskData?.author.username} 
                  </Text>
          </HStack>
        </Text>
      </Box>
      <Box>
        <Heading size='xs' textTransform='uppercase'>
          Content
        </Heading>
        <Text pt='2' fontSize='sm'>
          {taskData?.content}
        </Text>
      </Box>
      <Box>
        <Heading size='xs' textTransform='uppercase'>
          Process
        </Heading>
        <Text pt='2' fontSize='sm'>
          {taskType(taskData?.status)}
            </Text>
         {taskData?.status === "yet" ? <Text pt={2} fontSize='xs' color={"red.200"}>진행중으로 변경 해 주세요</Text>: null}
        {taskData?.status === "doing" ? <Text pt={2} fontSize='xs'  color={"red.200"}>이미 끝난 일정은 완료로 변경 해 주세요</Text>: null}
      </Box>
      <Box>
        <Heading size='xs' textTransform='uppercase'>
          limit date
        </Heading>
        <Text pt='2' fontSize='sm'>
          {taskData? DateToString(taskData?.limit_date) : null}
            </Text>

      </Box>
      {taskData?.author.pk != user?.pk ? null : 
        <HStack justifyContent={"flex-end"}>
          <Button onClick={onOpen} size="sm">Edit</Button>
          <Button onClick={deleteSubmit} colorScheme={"red"} size="sm">Delete</Button>
        </HStack>
      }
    </Stack>

            <TaskEditModal
              isOpen={isOpen}
            onClose={onClose}
            pk={pk}
              type={taskData?.type}
              status={taskData?.status}
              content={taskData?.content}
            limit_date={taskData?.limit_date}
            group_pk={taskData?.group.pk}
            group_name={taskData?.group?.group_name}
            tasker={taskData?.tasker}
            />

  </CardBody>
        </Card>

      <VStack>
        {commentData?.map((comment) => (
          <Comment
            key={comment.pk}
            pk={comment.pk}
            task={pk}
            author={comment.author}
            content={comment.content}
            created_at={comment.created_at}
          />
        ))}
        <InputGroup as="form" onSubmit={handleSubmit(onSubmit)}>
            <InputLeftAddon children={<BiChat />}/>
          <Input placeholder="comment here..." {...register("content")} />
                <InputRightElement width='4rem'>   
            <Button flex='1' variant='ghost' rightIcon={<FiSend />} type="submit"/>
            </InputRightElement> 
        </InputGroup>
      </VStack>
        </HStack>
    )
}