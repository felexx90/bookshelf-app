import Hero from "@/components/Hero";
import { useUser } from "@auth0/nextjs-auth0";
import Layout from "../components/Layout";

const Home = () => {
  const { user, isLoading } = useUser();

  return (
    <Layout user={user} loading={isLoading}>
      <Hero
        title="Welcome to Boskboke"
        subtitle="This website is a book recommendation website. You can search for books and add them to your list."
        image="https://source.unsplash.com/collection/404339/800x600"
        ctaText={user ? "Start searching" : "Create your account now"}
        ctaLink={user ? "/search" : "/api/auth/login"}
      />
    </Layout>
  );
};

export default Home;
