
import { Heading, VStack, Text, HStack, Card, CardHeader, CardBody, CardFooter, Box, Stack, StackDivider, Button, Image, IconButton, Avatar, Flex, Input, useDisclosure, InputGroup, InputRightElement, InputLeftElement, InputLeftAddon } from "@chakra-ui/react";
import { CommentVariables, deleteTask, getComment, getTask, postComment } from "../api";
import { CommentDetails, TaskDetails } from "../types";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import TaskEditModal from "../components/TaskEditModal";
import { DateToString } from "../lib/utils";
import Comment from "../components/Comment";
import { BiChat } from "react-icons/bi";
import { FiSend } from "react-icons/fi";
import { useForm } from "react-hook-form";

export default function TaskDetail() {
    const {pk} = useParams()
  console.log(pk)
  const navigate = useNavigate();
  const { data: taskData } = useQuery<TaskDetails>(['task', pk], getTask);
  console.log(taskData)
    const { data: commentData } = useQuery<CommentDetails[]>(['comment', pk], getComment)
    const {register, watch, handleSubmit, reset} = useForm()
    // console.log(watch())
  const { isOpen, onOpen, onClose } = useDisclosure()
  const queryClient = useQueryClient();
  const deleteMutation = useMutation(deleteTask, {
    onSuccess: () => {
      console.log("delete")
    },
    onError: (error:any) => {
      console.log(error.response.data)
      navigate('/')
    }
  })
  const deleteSubmit = async() => {
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

    return (<HStack justifyContent={"center"} alignItems={"flex-start"} spacing={10}>
        <Card width={"40%"}>
  <CardHeader>
    <Heading size='md'>MY TASK</Heading>
  </CardHeader>

  <CardBody>
    <Stack divider={<StackDivider />} spacing='4'>
      <Box>
        <Heading size='xs' textTransform='uppercase'>
        {taskData?.group? taskData.group.group_name : null} 
        </Heading>
        <Text pt='2' fontSize='sm'>
          {taskData?.type} 등록: {taskData?.author.username} | 담당: {taskData?.tasker? taskData?.tasker.username : taskData?.author.username}
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
          {taskData?.status}
            </Text>
         {taskData?.status === "yet" ? <Text fontSize='xs' color={"red.200"}>진행중으로 변경 해 주세요</Text>: null}
        {taskData?.status === "doing" ? <Text fontSize='xs'  color={"red.200"}>이미 끝난 일정은 완료로 변경 해 주세요</Text>: null}
      </Box>
      <Box>
        <Heading size='xs' textTransform='uppercase'>
          limit date
        </Heading>
        <Text pt='2' fontSize='sm'>
          {taskData? DateToString(taskData?.limit_date) : null}
            </Text>

      </Box>
                </Stack>
          <Button onClick={onOpen}>Edit</Button>
          <Button onClick={deleteSubmit}>Delete</Button>
                
        <TaskEditModal
            isOpen={isOpen}
            onClose={onClose}
            pk={pk}
            type={taskData?.type}
            status={taskData?.status}
            content={taskData?.content}
            limit_date={taskData?.limit_date}
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