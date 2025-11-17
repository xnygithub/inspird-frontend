import AccordionTerms from "@/app/(root)/(terms)/_components/navigation";

export default async function PrivacyPage() {
    return (
        <div className="padding-top font-sans">
            <div className="flex flex-row max-md:flex-col max-md:items-center gap-20 max-md:gap-0 py-20">
                <AccordionTerms />
                <div className="w-full">
                    <h1
                        id="terms-content-title"
                        className="font-bold text-5xl text-center">
                        Privacy Policy
                    </h1>
                    <div className="max-w-xs">
                        <p className="text-gray-500 text-sm text-center">Last updated: 06/11/2025</p>
                        <h2 id="introduction" className="font-bold text-3xl">Introduction</h2>
                        <p>
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                            Lorem Ipsum has been the industry&apos;s standard dummy text ever since the 1500s,
                            when an unknown printer took a galley of type and scrambled it to make a type
                            specimen book. It has survived not only five centuries, but also the leap into
                            electronic typesetting, remaining essentially unchanged. It was popularised in
                            the 1960s with the release of Letraset sheets containing Lorem Ipsum passages,
                            and more recently with desktop publishing software like Aldus PageMaker
                            including versions of Lorem Ipsum.
                        </p>
                        <h2 id="definitions" className="font-bold text-3xl">Definitions</h2>
                        <p>
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                            Lorem Ipsum has been the industry&apos;s standard dummy text ever since the 1500s,
                            when an unknown printer took a galley of type and scrambled it to
                            make a type specimen book. It has survived not only five centuries,
                            but also the leap into electronic typesetting, remaining essentially
                            unchanged. It was popularised in the 1960s with the release of Letraset
                            sheets containing Lorem Ipsum passages, and more recently with desktop
                            publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                        </p>
                        <h2 id="Usage" className="font-bold text-3xl">Usage</h2>
                        <p>
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                            Lorem Ipsum has been the industry&apos;s standard dummy text ever since the 1500s,
                            when an unknown printer took a galley of type and scrambled it to make a
                            type specimen book. It has survived not only five centuries, but also the leap
                            into electronic typesetting, remaining essentially unchanged. It was popularised
                            in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages,
                            and more recently with desktop publishing software like Aldus PageMaker
                            including versions of Lorem Ipsum.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
