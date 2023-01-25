import { Card, CardBody, VStack, Image, Stack, Heading, Text, Button, HStack } from '@chakra-ui/react'
import { Link } from 'react-router-dom';
import { AllWorkGroupList } from '../types';

export default function Group({pk, group_name, group_code, description, member_cnt, is_member}:AllWorkGroupList) {
    return (
        <Link to={`group/${pk}`}>
        <Card
            direction={{ base: 'row', sm: 'row' }}
            overflow='hidden'
            variant='outline'
            key={pk}
            height={{base: "100", md: "200"}}
            w={{base: "18em", sm: 500, md: 700}}
            >
            <Image
            objectFit={"cover"}        
            maxW={{ base: '5em', sm: '200px' }}
            src='https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60'
            alt='Caffe Latte'
            />
            <Stack w="100%">
            <CardBody height="100%" py={2} px={5} w="100%" h="100%">
                <VStack alignItems={"flex-start"}>
                    <HStack justifyContent={"space-between"} w="100%" h="100%">
                        <Heading size={ 'md'} fontSize={{ base: "xs", md: "md" }} >{ group_name}</Heading>
                        <Text display={{base: "none", md: "inline-block"}} py='2' fontSize={"sm"}>함께하는 멤버 {member_cnt}</Text>
                    </HStack>
                    <Text flexBasis={{base: "4", md: "50"}} my='2' fontSize={{base: "2xs", md: "md"}} noOfLines={1}>
                        {description}
                    </Text>
                    {is_member ?
                    <Button size={"sm"} display={{base: "none", sm: "none", md: "inline-block"}} variant='solid' colorScheme='blue' disabled >Already Joined</Button> 
                    : <Button size={"sm"} display={{base: "none", sm: "none", md: "inline-block"}} variant='solid' colorScheme='blue'>JOIN</Button>}
                    {is_member ?
                    <Text fontSize={"xs"} display={{base: "inline-block", sm: "inline-block", md: "none"}} color="gray.500">Already Joined</Text> 
                    : <Text fontSize={"xs"} display={{base: "inline-block", sm: "inline-block", md: "none"}} color="blue.300">JOIN</Text>}
                </VStack>
            </CardBody>
            </Stack>
        </Card>
        </Link>
    )
}