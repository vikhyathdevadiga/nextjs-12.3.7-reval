"use client"

import { useState } from "react"
import Head from "next/head"
import styles from "../styles/Home.module.css"

export default function Home({ data, time }) {
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleRevalidate = async () => {
    setIsLoading(true)
    setMessage("Revalidating...")

    try {
      const response = await fetch("/api/revalidate?secret=MY_SECRET_TOKEN")
      const data = await response.json()

      if (data.revalidated) {
        setMessage("Revalidated successfully! Refresh the page to see the new data.")
      } else {
        setMessage("Revalidation failed: " + (data.message || "Unknown error"))
      }
    } catch (error) {
      setMessage("Error revalidating: " + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Next.js ISR Example</title>
        <meta name="description" content="Next.js ISR with on-demand revalidation example" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Next.js ISR Example</h1>

        <div className={styles.card}>
          <h2>Static Data:</h2>
          <p className={styles.data}>{data}</p>
          <p className={styles.time}>Generated at: {time}</p>
        </div>

        <button onClick={handleRevalidate} className={styles.button} disabled={isLoading}>
          {isLoading ? "Revalidating..." : "Trigger Revalidation"}
        </button>

        {message && (
          <div className={styles.message}>
            <p>{message}</p>
          </div>
        )}

        <div className={styles.description}>
          <p>
            This page uses Incremental Static Regeneration (ISR) with on-demand revalidation. The API route uses{" "}
            <code>res.revalidate()</code> to trigger a regeneration.
          </p>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>Next.js 12.3.0 ISR Example</p>
      </footer>
    </div>
  )
}

export async function getStaticProps() {
  // This would typically be data from an external API
  const data = `Random value: ${Math.random().toString().substring(0, 10)}`
  const time = new Date().toLocaleString()

  return {
    props: {
      data,
      time,
    },
    // This sets up ISR with a revalidation period of 60 seconds
    // But we'll also use on-demand revalidation via the API route
    revalidate: 60,
  }
}
