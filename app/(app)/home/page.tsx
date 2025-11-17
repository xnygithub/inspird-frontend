import { createClient } from "@/utils/supabase/server";
import HomeContainer from "./components/container";

export default async function Home() {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();

    return (
        <div className="padding-top">
            {data.user ?
                <span className="block mt-20 font-sans text-center">Home page authenticated</span> :
                <span className="block mt-20 font-sans text-center">Home anonymous</span>
            }
        </div>
    )
}
