import { Button, Input, InputGroup, InputLeftElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, VStack } from "@chakra-ui/react";
import { BiEnvelopeOpen } from "react-icons/bi";
import { FcLock, FcPortraitMode, FcBusinesswoman, FcFlowChart } from "react-icons/fc";
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
                <ModalHeader textAlign={"center"}>Sign Up</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                <VStack>

                <InputGroup>
                    <InputLeftElement children={<FcPortraitMode/>} />
                    <Input placeholder="ID"/>
                </InputGroup>
                <InputGroup>
                    <InputLeftElement children={<FcBusinesswoman/>} />
                    <Input placeholder="Name"/>
                </InputGroup>
                <InputGroup>
                    <InputLeftElement children={<BiEnvelopeOpen />} />
                    <Input placeholder="Email"/>
                </InputGroup>
                <InputGroup>
                    <InputLeftElement children={<FcLock />} />
                    <Input placeholder="PASSWORD" />
                </InputGroup>
                <InputGroup>
                    <InputLeftElement children={<FcLock />} />
                    <Input placeholder="PASSWORD CONFIRM" />
                </InputGroup>
                <InputGroup>
                    <InputLeftElement children={<FcFlowChart />} />
                    <Input placeholder="(option) GROUP CODE" />
                </InputGroup>
                </VStack>
                <Button mt={5} w="100%" bg={"purple.100"}>Sign up</Button>
                <SocialLogin/>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}