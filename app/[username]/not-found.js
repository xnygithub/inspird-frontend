import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div>
      <h2>Not Found</h2>
      <p>The user you are looking for does not exist or is private.</p>
      <Link href="/">Return Home</Link>
    </div>
  )
}