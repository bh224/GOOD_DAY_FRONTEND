import { Heading, VStack, Text, HStack, Card, CardHeader, CardBody, Box, Stack, StackDivider, Button, Image, IconButton, Avatar, Flex, Input, useDisclosure, InputGroup, InputRightElement, InputLeftElement, InputLeftAddon,Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useToast, Checkbox } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { getGroup, joinWorkgroup, leaveWorkgroup, checkUsername, CheckUsername, deleteWorkgroup, EditGroupVariables, editWorkgroup } from "../api";
import { WorkGroup } from "../types";
import { useForm } from "react-hook-form";
import { FcPortraitMode } from "react-icons/fc";
import React, { useState } from "react";
import useUser from "../lib/useUser";

interface EditModalValues {
  group_name: string;
  description: string;
}

export default function GroupDetail() {
  const navigate = useNavigate();
  const { pk } = useParams();
  const { userLoading, user, isLoggedIn } = useUser();
  const { data: groupData } = useQuery<WorkGroup>(['group', pk], getGroup);
  const queryClient = useQueryClient();
  const toast = useToast();
  const [appendChk, setAppendChk] = useState(false);
  const [chkBox, setChkBox] = useState([<Checkbox></Checkbox>]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen:isEditOpen, onOpen:onEditOpen, onClose:onEditClose } = useDisclosure();
  const { register, watch:idSearchWatch, reset, handleSubmit } = useForm();
  const { register:addUserRegister, watch:addUserWatch, reset:addUserReset } = useForm();
  const { register:editRegister, watch:editWatch, reset:editReset, handleSubmit:editHandleSubmit } = useForm<EditGroupVariables>();

    // 유저추가
    const joinGroupSubmit = async() => {
      let member_pk = ""
      if (addUserWatch().member_pk) {
          // console.log("멤버추가")
          member_pk = addUserWatch().member_pk
      }
      const response = await joinWorkgroup({ pk, member_pk })
      toast({
      status: "success",
      title: `Welcome...${groupData?.group_name}!`
      })
      addUserReset()
      onClose()
      reset()
      queryClient.refetchQueries(['group'])
    }
  // 그룹 탈퇴하기
    const leaveGroupSubmit = async() => {
        const response = await leaveWorkgroup(pk)
        toast({
        status: "success",
        title: response.msg
        })
      navigate("/")
    }
    // 추가할 유저 검색
    const searchUsername = async ({ username }: CheckUsername) => {
        const response = await checkUsername({ username })
        setAppendChk(!appendChk)
        setChkBox([<Checkbox value={response.pk} {...addUserRegister("member_pk")}>{response.nickname}</Checkbox>])
        // console.log(chkBox)
    }
    const onSubmitId = () => {
        const username = idSearchWatch().username
        searchUsername({username})
  }
    // 그룹 삭제하기
  const deleteGroupSubmit = async() => {
    const response = await deleteWorkgroup(pk)
    toast({
      status: "success",
      title: response.msg,
      duration: 2000
    })
    navigate("/")
  }
  // 그룹 수정하기
  const editGroupSubmit = async ({ group_name, description }: EditModalValues) => {
    const response = await editWorkgroup({ pk, group_name, description })
    toast({
      status: "success",
      title: "수정되었습니다"
    })
    editReset()
    onEditClose()
  }
    return (
      <Stack direction={{ base: "column", sm: "column", md: "row" }}
        justifyContent={"center"}
        alignItems={{ base: "center", md: "flex-start" }}
        spacing={10} py={{base: "50", md: "150"}}>
        <Card width={{base: "80%", md: "40%"}}>
          <CardHeader>
              <HStack justifyContent={"space-between"}>
              <Heading size='md'>{groupData?.group_code}</Heading>
              {groupData?.is_member ?
              <>
                { user?.pk == groupData?.member.pk ?
                  <Button disabled size={"xs"} onClick={leaveGroupSubmit}>Leave This Group</Button>
                :<Button size={"xs"} onClick={leaveGroupSubmit}>Leave This Group</Button> }
              </>
              : null}
                </HStack>
          </CardHeader>
          <CardBody>
            <Stack divider={<StackDivider />} spacing='4'>
              <Box>
                <Heading size='xs' textTransform='uppercase'>
                {groupData?.group_name} | {groupData?.members.length}명 참여 중
                </Heading>
                <Text pt='2' fontSize='sm'>
                  By. {groupData?.member.nickname}
                </Text>
              </Box>
              <Box>
                <Heading size='xs' textTransform='uppercase'>
                  Content
                </Heading>
                <Text pt='2' fontSize='sm'>
                  {groupData?.description}
                </Text>
              </Box>
              <Box>
                <Heading size='xs' textTransform='uppercase'>
                PROGRESS
                </Heading>
                <Text pt='2' fontSize='sm'>
                  매일 Task 단위로 일정등록하고 완료까지 해주세요~~ 필요에따라 task 할당도 드립니당
                    </Text>
              </Box>
                <HStack justifyContent={"flex-end"}>  
                <Button size="sm" onClick={onEditOpen}>Edit</Button>
                <Button  colorScheme={"red"} size="sm" onClick={deleteGroupSubmit}>Delete</Button>
              </HStack>
                        </Stack>
                        
          </CardBody>
        </Card>
        <VStack w={{base: "80%", md: "30%"}}>
            <Button w="100%" type="submit" onClick={onOpen}>이 그룹에 멤버 추가하기</Button>
            {groupData?.is_member ?
            <Button disabled w="100%" onClick={joinGroupSubmit}>이미 참여중 입니다</Button>
            :  <Button w="100%" onClick={joinGroupSubmit}>이 그룹에 참여하기</Button>}
          <VStack alignItems={"flex-start"} justifyContent={"flex-start"} w="100%">
                    <Text fontSize={"sm"} my={3}>🤹‍♀️참여 중인 멤버들🤹</Text>
                    {groupData?.members.map((member) => (
                    <HStack key={member.pk}>
                            <Avatar name={member.username} size="xs"/>
                            <Text>{member.username}</Text>
                    </HStack>
                    ))}
          </VStack>
        </VStack>
        
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader textAlign={"center"}>그룹에 멤버 추가하기</ModalHeader>
                <ModalCloseButton />
                <ModalBody as="form" fontSize={"sm"} >
                <VStack >
                    <InputGroup >
                    <InputLeftElement children={<FcPortraitMode/>} />
                    <Input {...register("username")} placeholder="ID를 입력해 주세요" />
                    <InputRightElement width='5rem' children={
                        <Button p={2} mr={2} h='1.75rem' size='sm' fontSize={"xs"} onClick={onSubmitId}>유저 검색</Button>} />  
                            </InputGroup>
                            <Box >
                                {appendChk ? chkBox.map((chk) => chk)
                                : null}
                        </Box>
                    </VStack>
                    
                <Button mt={10} mb={5} w="100%" colorScheme='teal' variant='outline' onClick={joinGroupSubmit}>Add</Button>
   
                </ModalBody>
            </ModalContent>
        </Modal>

        <Modal isOpen={isEditOpen} onClose={onEditClose}>
          <ModalOverlay/>
            <ModalContent>
                <ModalHeader textAlign={"center"}>그룹 수정</ModalHeader>
                <ModalCloseButton />
                <ModalBody as="form" fontSize={"sm"} onSubmit={editHandleSubmit(editGroupSubmit)}>
                <VStack>
                            <InputGroup>
                                <InputLeftAddon textAlign={"center"} w="30%" fontSize={"sm"} children='Group Name' />
                  <Input {...editRegister("group_name")} defaultValue={groupData?.group_name} />
                </InputGroup>
                <InputGroup>
                                <InputLeftAddon w="30%" fontSize={"sm"} children='Description' />
                  <Input {...editRegister("description")} value={groupData?.description} />
                </InputGroup>
                        </VStack>
                    
                <Button type="submit" my={5} w="100%" colorScheme='teal' variant='outline'>Submit</Button>
   
                </ModalBody>
            </ModalContent>
        </Modal>
      </Stack>
    )
}