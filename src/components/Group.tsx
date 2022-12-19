import { Card, CardBody, VStack, Image, Stack, Heading, Text, Button, HStack } from '@chakra-ui/react'
import { Link } from 'react-router-dom';
import { WorkGroup } from '../types';

export default function Group({pk, group_name, group_code, description, members, is_member}:WorkGroup) {
    return (
        <Link to={`group/${pk}`}>
        <Card
            direction={{ base: 'column', sm: 'row' }}
            overflow='hidden'
            variant='outline'
            key={pk}
            height={200}
            width={700}
            >
        <Image
            objectFit='cover'
            maxW={{ base: '100%', sm: '200px' }}
            src='https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60'
            alt='Caffe Latte'
        />

    <Stack>
                    <CardBody height="100%" py={2} px={5} w={500}>
            <HStack justifyContent={"space-between"}>
        <Heading size='md' fontSize={"md"}>{ group_name}</Heading>
        <Text py='2' fontSize={"sm"}>
            함께하는 멤버 {members.length}
        </Text>
            </HStack>

        <Text py='2'>
            {description}
        </Text>
        {is_member ?
            <Button size={"sm"} variant='solid' colorScheme='blue' disabled >Already Joined</Button> 
            : <Button size={"sm"} variant='solid' colorScheme='blue'>JOIN</Button>}
                        </CardBody>
    </Stack>
            </Card>
            </Link>
    )
}