import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div>
      <h2>Not Found</h2>
      <p>The post does not exist or the owner has delete/made the post private.</p>
      <Link href="/">Return Home</Link>
    </div>
  )
}