import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Chat - Kurodenijo',
  description: 'AI-Chat is a Next.js project that provides a chat interface with AI capabilities. It uses the Mintbase Wallet for user authentication and the OpenAI GPT-4 model for generating chat responses.',
  openGraph: {
    images: [ 'https://i.imgur.com/uIIL4tt.png']
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body >{children}
      </body>
    </html>
  )
}
