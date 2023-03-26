import Head from 'next/head'
import Header from './Header'

type LayoutProps = {
  user?: any
  loading?: boolean
  children: React.ReactNode
}

const Layout = ({ user, loading = false, children }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>Bookshelf App</title>
      </Head>

      <Header user={user} loading={loading} />

      <main>
        <div className="container">{children}</div>
      </main>

      <style jsx>{`
        .container {
          max-width: 90%;
          margin: 0.8rem auto;
        }
      `}</style>
      <style jsx global>{`
        body {
          margin: 0;
          color: #333;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
            Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }
      `}</style>
    </>
  )
}

export default Layout
