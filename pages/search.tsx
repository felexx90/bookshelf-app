import { getSession, useUser } from "@auth0/nextjs-auth0";
import { getBooks } from "./api/books";
import { getShortlist } from "./api/user/[userId]/list";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Heading,
  SimpleGrid,
  HStack,
  VStack,
  UnorderedList,
  ListItem,
  Center,
  Stack,
  Image,
  Input,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Container,
  Flex,
  Box,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import { recurisveObjectIdStringifyer } from "@/utils/mongooseHelper";
import useDebounce from "@/hooks/useDebounce";

const Book = ({ book, user, onAddBook, isOnList }) => {
  const addBook = async () => {
    const response = await fetch(`/api/user/${user.sub}/list`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...book }),
    });
    const data = await response.json();
    console.log(data);
    onAddBook(data);
  };

  const openBook = async () => {
    console.log(book);
    if (book.formats["text/html"]) {
      window.open(book.formats["text/html"]);
    } else if (book.formats["application/pdf"]) {
      window.open(book.formats["application/pdf"]);
    } else {
      window.open(book.formats["text/plain"]);
    }
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
            {user && !isOnList ? (
              <Button onClick={() => addBook()}>Add to list</Button>
            ) : null}
            <Button onClick={() => openBook()}>View here</Button>
          </HStack>
        </CardFooter>
      </Stack>
    </Card>
  );
};

const Search = ({ initialBooks, initialList }) => {
  const loadMore = async () => {
    const response = await fetch(`/api/books?page=${next}`);
    const data = await response.json();
    setBooks([...books, ...data.results]);
    setNext(data.next);
  };

  const sort = async (sort) => {
    const response = await fetch(`/api/books?sort=${sort}`);
    const data = await response.json();
    setBooks(data.results);
    setNext(data.next);
  };

  const [search, setSearch] = useState("");
  const [next, setNext] = useState(initialBooks.next);
  const [books, setBooks] = useState(initialBooks.results);
  const [list, setList] = useState(initialList);

  const debouncedSearch = useDebounce(search, 500);
  const { user, isLoading } = useUser();

  useEffect(() => {
    const fetchBooks = async () => {
      if (debouncedSearch) {
        const response = await fetch(`/api/books?search=${debouncedSearch}`);
        const data = await response.json();
        setBooks(data.results);
        setNext(data.next);
      }
    };
    fetchBooks();
  }, [debouncedSearch]);

  return (
    <Layout user={user} loading={isLoading}>
      <Heading>Search</Heading>
      <VStack>
        <HStack width="100%" maxW="container.lg" spacing={4}>
          <Box w="100%">
            <Input
              maxW="container.lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or author"
            />
          </Box>
          <Menu>
            <MenuButton
              as={Button}
              rounded={"full"}
              variant={"link"}
              cursor={"pointer"}
              minW={0}
            >
              <HamburgerIcon />
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => sort("popular")}>Popular</MenuItem>
              <MenuItem onClick={() => sort("ascending")}>Ascending</MenuItem>
              <MenuItem onClick={() => sort("descending")}>Descendent</MenuItem>
            </MenuList>
          </Menu>
        </HStack>
        <SimpleGrid spacing={4} columns={{ base: 1, md: 2, lg: 3 }}>
          {books.map((book) => (
            <Book
              key={book.id}
              book={book}
              user={user}
              onAddBook={setList}
              isOnList={list?.map ? !!list?.map[book.id]: false}
            />
          ))}
        </SimpleGrid>
        <Center margin={5}>
          <Button onClick={() => loadMore()}>Load More</Button>
        </Center>
      </VStack>
    </Layout>
  );
};

export async function getServerSideProps({ req, res }) {
  const auth0User = getSession(req, res);
  if (!auth0User) {
    const initialBooks = await getBooks();
    return {
      props: { initialBooks, initialList: { map: {} } }, // will be passed to the page component as props
    };
  } else {
    const [initialBooks, initialList] = await Promise.all([
      getBooks(),
      getShortlist({ userId: auth0User.user.sub }),
    ]);
    return {
      props: {
        initialBooks,
        initialList: initialList
          ? recurisveObjectIdStringifyer(initialList.toJSON())
          : { map: {} },
      }, // will be passed to the page component as props
    };
  }
}

export default Search;
