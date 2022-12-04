import { Button, Image, Input, InputGroup, InputLeftElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, VStack } from "@chakra-ui/react";
import { FcLock, FcPortraitMode } from "react-icons/fc";
import SocialLogin from "./SocialLoin";


interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function LoginModal({isOpen, onClose}:LoginModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay/>
          <ModalContent>
            <ModalHeader textAlign={"center"}>Log In</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack>

              <InputGroup>
                <InputLeftElement children={<FcPortraitMode/>} />
                <Input placeholder="ID"/>
              </InputGroup>
              <InputGroup>
                  <InputLeftElement children={<FcLock />} />
                <Input placeholder="PASSWORD" />
              </InputGroup>
              </VStack>
            <Button mt={5} w="100%" bg={"purple.100"} textAlign={"center"}>Log In</Button>
              <SocialLogin/>
            </ModalBody>
          </ModalContent>
      </Modal>
    )
}