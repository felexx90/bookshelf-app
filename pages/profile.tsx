import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import {
  Center,
  Container,
  Heading,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import Layout from "../components/Layout";
import { User } from "../interfaces";

type ProfileCardProps = {
  user: User;
};

const ProfileCard = ({ user }: ProfileCardProps) => {
  return (
    <>
      <h1>Profile</h1>
      <Container mt={4}>
        <Image
          src={user.picture}
          alt={user.name}
          boxSize="200px"
          borderRadius="full"
          mx="auto"
        />
        <Center>
          <VStack>
            <Heading>{user.name}</Heading>
            <Text>{user.nickname}</Text>
          </VStack>
        </Center>
      </Container>
    </>
  );
};

const Profile = ({ user, isLoading }) => {
  return (
    <Layout user={user} loading={isLoading}>
      {isLoading ? <>Loading...</> : <ProfileCard user={user} />}
    </Layout>
  );
};

// Protected route, checking user authentication client-side.(CSR)
export default withPageAuthRequired(Profile);
