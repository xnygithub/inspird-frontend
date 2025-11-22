'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const HomeContainer = () => {
    return (
        <span className="block mt-20 font-sans text-center">Home page authenticated</span>
        // <Tabs
        //     className="mt-12 px-4 font-sans"
        //     defaultValue="for-you">
        //     <TabsList variant='profile' className="text-4xl">
        //         <TabsTrigger value="for-you" >For you</TabsTrigger>
        //         <TabsTrigger value="discover" >Discover</TabsTrigger>
        //     </TabsList>
        //     <TabsContent value="for-you">
        //         <div className="text-center">For you</div>
        //     </TabsContent>
        //     <TabsContent value="discover">
        //         <div className="text-center">Discover</div>
        //     </TabsContent>
        // </Tabs>
    )
}

export default HomeContainer