import "../styles/globals.css"
import type { AppProps } from "next/app"
import { SessionProvider } from "next-auth/react"

import Head from "next/head"

function MyApp({ Component, pageProps: { session, ...pageProps }, }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps}>
        <Head>
          <title>Son Pardo Calendar</title>
          <meta name="description" content="Son Pardo Calendar" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
      </Component>
    </SessionProvider>
  )
}

export default MyApp
