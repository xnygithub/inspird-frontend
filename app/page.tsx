import { Session } from "@/components/session";
export default async function Home() {

  return (
    <div className="padding-top">
      <p>Welcome to Inspird</p>
      <Session />
    </div>
  )
}
