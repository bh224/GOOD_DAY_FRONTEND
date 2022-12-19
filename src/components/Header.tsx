import { Avatar, Box, Button, HStack, Select, Text, useDisclosure, useToast } from "@chakra-ui/react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { FcAlarmClock,} from "react-icons/fc";
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
  const toast = useToast()
  // 로그아웃
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
    withCredentials: true, 
  })
  // 그룹멤버 투데이
  const groupStatus = (pk:string) => instance.get(`users/todays?group=${pk}`).then((response)=>response.data)
  const getGroupStatus = async (pk: string) => {
    const data = await groupStatus(pk)
    setMemberStatus(data)
  }
  // 투데이 start-end
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
    endMutation.mutate({state_code, end_time})
  }
    return (
      <Box px={10} py={3} pos={"fixed"} zIndex={100} bg={"white"} w="100%" borderBottomWidth={1}>
      <HStack justifyContent={"space-between"}>
        <Link to="/">G O O D D A Y</Link>
            {!userLoading ? (
              !isLoggedIn ? 
              (<HStack>
                  <Button variant={"link"} onClick={onLoginOpen} size="sm">Log in</Button>
                  <Button variant={"link"} onClick={onSignupOpen} size="sm">Sign up</Button>
                </HStack>)
              :
                <HStack>
                  <Text>hello</Text>
                  <Link to="mypage">
                    <HStack>
                      <Avatar name={user.username} size={"xs"} />
                      <Text>{user.nickname}</Text>
                    </HStack>
                  </Link>
                  <Button onClick={onLogout} variant={"link"} size="sm">Logout</Button>
                </HStack>
            ): null}
      </HStack>

      <HStack fontSize={"x-small"} justifyContent={"space-between"} mt={5}>
        <HStack>
          {groupData ? 
          <Select p={1} textAlign={"center"} variant='flushed' size={"xs"} width={40} placeholder="그룹 선택" onChange={(e) => {getGroupStatus(e.target.value) }}>
            {groupData?.map((group) => (
              <option key={group.pk} value={group.pk}>{group.group_name}</option>
            ))}
          </Select>  
          : <Select variant='flushed' size={"xs"} width={40} placeholder="그룹 선택" ></Select>}
          {memberStatus ? 
              <HStack>
                <FcAlarmClock />
                {memberStatus?.map((member) => 
                  <HStack><Text>{member.user.nickname}</Text>
                    {member.state_code === "on" ? <Text>🟢ON</Text> : <Text>⚪OFF</Text>}
                  </HStack> 
            )}
          </HStack>
          : <Text> 그룹 멤버의 상태를 확인해 보세요</Text>}
        </HStack>
        <HStack>
          {todayStatus ?
            <HStack ml={"auto"}> <Text>{StatusTime(todayStatus.start_time)} START</Text>
              {todayStatus?.state_code === "off" ? <Text>{StatusTime(todayStatus.end_time)} END</Text> : null}
            {todayStatus.state_code === "on" ? <Text>🟢ON</Text> : <Text>⚪OFF</Text>}
            </HStack>
            : null}
        {todayStatus?.state_code==="on" || todayStatus?.state_code==="off" ? <Button disabled size={"xs"} onClick={submitStart} variant={"ghost"}>출근🥰</Button>:<Button  size={"xs"} onClick={submitStart} variant={"ghost"}>출근🥰</Button> }
        {todayStatus?.state_code==="off" ? <Button disabled size={"xs"} onClick={submitEnd} variant={"ghost"}>퇴근😎</Button> : <Button  size={"xs"} onClick={submitEnd} variant={"ghost"}>퇴근😎</Button>}
        
        </HStack>
      <LoginModal isOpen={isLoginOpen} onClose={onLoginClose} />
      <SignupModal isOpen={isSignupOpen} onClose={onSignupClose} />
      </HStack>

      </Box>
    )
}