import React from "react";
import NextLink from "next/link";
import NextImage from "next/image";
import logo from "../public/logo.png";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Link,
  Img,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  useColorModeValue,
  Stack,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";

type HeaderProps = {
  user?: any;
  loading: boolean;
};

const Links = [
  { name: "Home", route: "/", secure: false },
  { name: "Search", route: "/search", secure: false },
  { name: "Shortlist", route: "/mylist", secure: true },
  { name: "About", route: "/about", secure: false },
];

const NavLink = ({
  children,
  href = "#",
}: {
  children: ReactNode;
  href?: string;
}) => (
  <Link
    as={NextLink}
    px={2}
    py={1}
    rounded={"md"}
    _hover={{
      textDecoration: "none",
      bg: useColorModeValue("gray.200", "gray.700"),
    }}
    href={href}
  >
    {children}
  </Link>
);

const Header = ({ user, loading }: HeaderProps) => {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={"center"}>
            <Img src={logo.src} width={50} alt="Logo" />
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              {Links.map(({ name, route, secure }) => {
                if (secure && !user) return null;
                return (
                  <NavLink key={name} href={route}>
                    {name}
                  </NavLink>
                );
              })}
            </HStack>
          </HStack>
          <Flex alignItems={"center"}>
            {!loading && (
              <Menu>
                <MenuButton
                  as={Button}
                  rounded={"full"}
                  variant={"link"}
                  cursor={"pointer"}
                  minW={0}
                >
                  <Avatar
                    size={"sm"}
                    color={"white"}
                    src={user ? user.picture : null}
                    name={user ? user.nickname : null}
                  />
                </MenuButton>
                <MenuList>
                  {user ? (
                    <>
                      <MenuItem onClick={() => router.push("/profile")}>
                        Profile
                      </MenuItem>
                      <MenuItem onClick={() => router.push("/api/auth/logout")}>
                        Logout
                      </MenuItem>
                    </>
                  ) : (
                    <MenuItem onClick={() => router.push("/api/auth/login")}>
                      Login
                    </MenuItem>
                  )}
                </MenuList>
              </Menu>
            )}
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              {Links.map(({ name, route }) => (
                <NavLink key={name} href={route}>
                  {name}
                </NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
};

export default Header;
