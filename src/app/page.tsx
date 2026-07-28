import { redirect } from 'next/navigation'

// The middleware handles the redirect logic.
// This page is a fallback for any direct / hits not caught by middleware.
export default function Home() {
  redirect('/login')
}
