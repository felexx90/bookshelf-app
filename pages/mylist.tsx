import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Heading,
  HStack,
  Image,
  ListItem,
  SimpleGrid,
  Stack,
  UnorderedList,
} from "@chakra-ui/react";
import { getShortlist } from "./api/user/[userId]/list";
import Layout from "@/components/Layout";
import { recurisveObjectIdStringifyer } from "@/utils/mongooseHelper";
import { useState } from "react";

const Book = ({ book, onAddBook, user }) => {
  const removeBook = async () => {
    const response = await fetch(`/api/user/${user.sub}/list`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: book.id }),
    });
    const data = await response.json();
    onAddBook(data);
    console.log(data);
  };

  return (
    <Card direction={{ base: "column", sm: "row" }} overflow="hidden">
      <Image
        objectFit="contain"
        maxW={{ base: "100%", sm: "150px" }}
        src={book.image}
      />
      <Stack>
        <CardBody>
          <Heading size="md">{book.title}</Heading>
          <UnorderedList>
            {book.subjects.map((subjects, index) => (
              <ListItem key={index}>{subjects}</ListItem>
            ))}
          </UnorderedList>
        </CardBody>
        <CardFooter>
          <HStack alignItems={"center"}>
            {user ? (
              <Button onClick={() => removeBook()}>Remove from list</Button>
            ) : null}
            <Button>View here</Button>
          </HStack>
        </CardFooter>
      </Stack>
    </Card>
  );
};

const MyList = ({ initialList, user, isLoading }) => {
  const [list, setList] = useState(initialList);
  return (
    <Layout user={user} loading={isLoading}>
      <h1>Shortlist</h1>
      <SimpleGrid spacing={4} columns={1}>
        {list.list.map((book) => (
          <Book key={book.id} onAddBook={setList} book={book} user={user} />
        ))}
      </SimpleGrid>
    </Layout>
  );
};

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async ({ req, res }) => {
    const auth0User = getSession(req, res);
    const initialList = await getShortlist({ userId: auth0User.user.sub });
    const json = await initialList.toJSON();
    return {
      props: { initialList: recurisveObjectIdStringifyer(json) }, // will be passed to the page component as props
    };
  },
});

export default withPageAuthRequired(MyList);
