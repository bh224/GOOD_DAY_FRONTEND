import { Avatar, Box, Button, CircularProgress, CircularProgressLabel, HStack, Select, Text, useDisclosure, useToast } from "@chakra-ui/react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { AddIcon } from '@chakra-ui/icons'
import { FcCloseUpMode,} from "react-icons/fc";
import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { endToday, getToday, logOut, startToday } from "../api";
import useUser from "../lib/useUser";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";
import useWorkgroups from "../lib/useWorkgroups";
import { GroupMembersStatus } from "../types";
import { formatDate, StatusTime, TimeNow } from "../lib/utils";



export default function Header() {
  const now = TimeNow(new Date())
  const { isGroupLoading, groupData } = useWorkgroups()
  const queryClient = useQueryClient();
  const [memberStatus, setMemberStatus] = useState<GroupMembersStatus[]>();
  const { userLoading, user, isLoggedIn } = useUser();
  const { isLoading:isTodayLoading, data: todayStatus } = useQuery(["today"], getToday, {retry:false}); 
  // console.log(todayStatus)
  const toast = useToast()
  const mutation = useMutation(logOut, {
    onSuccess: (data) => {
      queryClient.refetchQueries(['tasks'])
      toast({
        status: "success",
        description: data.ok,
        isClosable: true,
        duration: 2000,
      })
      queryClient.refetchQueries(['user'])
    }
  })
  const onLogout = async () => {
    mutation.mutate()
  }
  const { isOpen:isLoginOpen, onOpen:onLoginOpen, onClose:onLoginClose } = useDisclosure();
  const { isOpen: isSignupOpen, onOpen: onSignupOpen, onClose: onSignupClose } = useDisclosure();
      const instance = axios.create({
    baseURL: "http://127.0.0.1:8000/api/v1/",
    withCredentials: true, //세션id 
      })
    const groupStatus = (pk:string) => instance.get(`users/todays?group=${pk}`).then((response)=>response.data)
    
  const getGroupStatus = async (pk: string) => {
        const data = await groupStatus(pk)
        setMemberStatus(data)
        console.log(memberStatus)
  }
  const startMutation = useMutation(startToday, {
    onSuccess: (data) => {
      console.log(data)
      queryClient.refetchQueries(["today"])
    },
    onError: (error) => {
      console.log(error)
    }
  })
  const submitStart = () => {
    const state_code = "on"
    const start_time = now
    console.log(state_code, start_time)
    startMutation.mutate({state_code, start_time})
  }

  const endMutation = useMutation(endToday, {
    onSuccess: (data) => {
      console.log(data)
      queryClient.refetchQueries(["today"])
    },
    onError: (error) => {
      console.log(error)
    }
  })
  const submitEnd = () => {
    const state_code = "off"
    const end_time = now
    console.log(state_code, end_time)
    endMutation.mutate({state_code, end_time})
  }


    return (
        <Box px={10} py={3}>

      <HStack justifyContent={"space-between"}>
        <Link to="/">g o o d d a y</Link>
            {!userLoading ? (
              !isLoggedIn ? 
        (<Box>

          <Button variant={"ghost"} onClick={onLoginOpen}>Log in</Button>
          <Button variant={"ghost"} onClick={onSignupOpen}>Sign up</Button>
                </Box>) :
                <HStack>

                <Text>hello...!</Text>
                <Link to="mypage">
                  <HStack>
                  <Avatar name={user.username} size={"xs"} />
                  <Text>{user.nickname}</Text>
                  </HStack>
                  </Link>
                  <Button onClick={onLogout} variant={"link"}>Logout</Button>
                </HStack>
             ): null}
      </HStack>

        <HStack fontSize={"x-small"} justifyContent={"space-between"}>
          <HStack>
          <Select size={"xs"} width={40} placeholder="그룹 선택" onChange={(e) => {getGroupStatus(e.target.value) }}>
            {groupData?.map((group) => (
              <option key={group.pk} value={group.pk}>{group.group_name}</option>
            ))}
          </Select>
            <AddIcon boxSize={3} />
            

          
          {memberStatus ? 
          <>
          <HStack>
            <FcCloseUpMode />
                <Text>출첵완료!</Text>
                {memberStatus?.map((member) => <Text key={member.pk}>{member.user.username}:{member.state_code}</Text>)}
          </HStack>
              </> : <Text> 아직 아무도 일정 등록을 안했네요...</Text>}
            </HStack>
          <HStack>
            {todayStatus ?
              <HStack ml={"auto"}> <Text>Today! {StatusTime(todayStatus.start_time)} start</Text>
                {todayStatus?.state_code === "off" ? <Text>{StatusTime(todayStatus.end_time)} end</Text> : null}
                <Text>/ now... {todayStatus.state_code}</Text>
              </HStack>
              : null}
          {todayStatus?.state_code==="on" || todayStatus?.state_code==="off" ? <Button disabled size={"xs"} onClick={submitStart}>Start</Button>:<Button  size={"xs"} onClick={submitStart}>Start</Button> }
          {todayStatus?.state_code==="off" ? <Button disabled size={"xs"} onClick={submitEnd}>end</Button> : <Button  size={"xs"} onClick={submitEnd}>end</Button>}
          
          </HStack>
        <LoginModal isOpen={isLoginOpen} onClose={onLoginClose} />
        <SignupModal isOpen={isSignupOpen} onClose={onSignupClose} />
        </HStack>

</Box>
    )
}