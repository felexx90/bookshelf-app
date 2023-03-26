import { useUser } from '@auth0/nextjs-auth0'
import { Center, Container, Heading, Image, Text, VStack } from '@chakra-ui/react'
import Layout from '../components/Layout'

const About = () => {
  const { user, isLoading } = useUser()

  return (
    <Layout user={user} loading={isLoading}>
      <Heading>About Me</Heading>
      <Container mt={4}>
        <Center>
          <VStack>
            <Heading>Andres Felipe Rodriguez</Heading>
            <Text>Software Engineer</Text>
          </VStack>
        </Center>
        <Text>
          More than 6 years of experience in software development is one of my
          biggest assets in the IT industry. I'm a proactive person, who work
          well with teams, understand software engineering Best Practices. Also,
          I have experience with multiple coding languages and previous
          experience working within an Agile Scrum Team. I have worked in
          multiple projects as Technical Leader. I am versatile in multiple
          programming languages such as Java, Javascript, C #, among others. I
          have knowledge in the use of error tools and monitoring of projects
          such as Jira and Mantis, communication tools for team projects such as
          Slack and Evernote. I have a strong sense of organization and
          commitment to projects that help me deliver them to clients on time
          and with the required specifications.
        </Text>
      </Container>
    </Layout>
  );
}

export default About
