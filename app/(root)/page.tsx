import { createClient } from "@/utils/supabase/server";
// import AuthComponent from "@/components/home/auth";
import LandingPage from "@/components/home/landing-page";

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  return (
    <div className="padding-top">
      {data.user ? <></> : <LandingPage />}
    </div>
  )
}
