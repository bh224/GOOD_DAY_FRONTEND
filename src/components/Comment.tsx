import { Heading, Text, Card, CardHeader, CardBody, CardFooter, Box, Button, IconButton, Avatar, Flex, Input,   Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,} from "@chakra-ui/react";
import { DateToString } from "../lib/utils";
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { BsThreeDotsVertical } from "react-icons/bs";
import { CommentDetails } from "../types";
import { deleteComment } from "../api";


export default function Comment({ pk, author, content, created_at, task }: CommentDetails) {
  const toast = useToast();
  const queryClient = useQueryClient();
  // 코멘트삭제
  const mutation = useMutation(deleteComment, {
      onSuccess: () => {
      toast({
        status: "success",
        title: "삭제 되었습니다"
        })
      queryClient.refetchQueries(['comment'])
      },
    onError: ({ response }) => {
      toast({
        status: "error",
        title: "다시 시도해 주세요"
      })
      }
  })
    const deleteSubmit = () => {
        mutation.mutate({task, pk})
    }
    return (

  <Card maxW='md' w={400}>
  <CardHeader>
    <Flex >
      <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap'>
        <Avatar name={author.username} size={"sm"}/>
        <Box>
          <Heading size='sm'>{author.nickname}</Heading>
          <Text>{DateToString(created_at)}</Text>
        </Box>
        </Flex>
        <Menu>
          <MenuButton variant='ghost' as={Button} rightIcon={<BsThreeDotsVertical />}>
          </MenuButton>
          <MenuList>
            <MenuItem onClick={deleteSubmit}>Delete Comment</MenuItem>
          </MenuList>
        </Menu>
      
    </Flex>
  </CardHeader>
  <CardBody pt={0}>
    <Text>
      {content}
    </Text>
  </CardBody>

        </Card>

    )
}