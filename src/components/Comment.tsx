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


export default function Comment({ pk, task, author, content, created_at }: CommentDetails) {
    // console.log('pk',pk, 'task', task)
  const toast = useToast();
  const queryClient = useQueryClient();
  const mutation = useMutation(deleteComment, {
      onSuccess: () => {
          console.log("deleted")
          queryClient.refetchQueries(['comment'])
      },
      onError: ({response}) => {
          console.log(response.data)
      }
  })
    const deleteSubmit = () => {
        console.log(pk, task)
        mutation.mutate({pk, task})
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
  <CardBody>
    <Text>
      {content}
    </Text>
  </CardBody>

        </Card>

    )
}