import Footer from "@/components/footer";
import AccordionTerms from "@/app/(root)/(terms)/_components/navigation";

export default async function TermsPage() {

    return (
        <div className="padding-top font-sans">
            <div className="flex flex-row max-md:flex-col max-md:items-center max-md:gap-12 py-20">
                <AccordionTerms />
                <div className="mx-auto max-md:px-6 w-1/2 max-md:w-full text-primary">
                    <h1 id="terms-content-title" className="font-bold text-4xl text-center">Terms of Service</h1>
                    <p className="text-gray-500 text-sm text-end">Last updated: 06/11/2025</p>
                    <div className="flex flex-col gap-4 mt-4">
                        <p className="text-muted-foreground">
                            These Terms of Service (&quot;Terms&quot;) govern your use of and access to any website, application,
                            service, technology, API, widget, platform, channel or other products or features owned, operated, branded or
                            offered by Inspird (&quot;Inspird&quot; or the &quot;Service&quot;), unless we explicitly state that
                            different terms apply. When referring to &quot;we&quot; or &quot;us&quot; in these Terms, we mean the contracting
                            party specified in Section 13(e) (Parties). Please review these Terms thoroughly, and reach out to us with any
                            questions.
                        </p>

                        <p className="text-muted-foreground">
                            Using the Service means you agree to follow these Terms. For reference, these Terms incorporate:
                        </p>
                        <ul className="text-muted-foreground list-disc list-inside">
                            <li>Our Community Guidelines, which outline acceptable and unacceptable behavior on Inspird</li>
                            <li>
                                Our Enforcement practices, which detail how we implement our policies,
                                including potential restrictions
                                on content or Service usage
                            </li>
                        </ul>
                        <p className="text-muted-foreground">
                            By using Inspird, you acknowledge and accept these Terms. If you disagree with these Terms, you must
                            not use Inspird.
                        </p>
                    </div>

                    <div className="flex flex-col gap-2 mt-4">
                        <h2 id="service-content" className="font-bold text-xl">1. The Service</h2>
                        <p className="text-muted-foreground">
                            Inspird aims to connect people with inspiration that enriches their lives.
                            We personalize your experience by showing content we believe you&apos;ll find meaningful and engaging based on how you
                            interact with Inspird and related services. To deliver this personalized experience, we process your personal
                            information as detailed in our Privacy Policy. Some content you see may be sponsored by advertisers, but we strive
                            to ensure even promotional content remains relevant to your interests. All sponsored content is clearly marked as such.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4 mt-4">
                        <h2 id="using-inspird" className="font-bold text-xl">2. Using Inspird</h2>
                        <h3 id="eligibility-and-access" className="font-semibold">A. Eligibility and Access</h3>
                        <p className="text-muted-foreground">
                            You can use Inspird if you comply with these Terms and applicable laws.
                            Using our Service may require downloading software to your devices.
                            You agree that we can automatically update this software, and these Terms apply to all updates.
                            When registering for Inspird, you must provide accurate and complete information.
                        </p>

                        <h3 id="license-terms" className="font-semibold">B. License Terms</h3>
                        <p className="text-muted-foreground">
                            We grant you a limited, non-exclusive, non-transferable, revocable license to use
                            Inspird according to these Terms and our policies. This license cannot be transferred
                            or used by unauthorized third parties. We reserve all rights not explicitly granted, and you may not:
                        </p>
                        <ul className="text-muted-foreground list-disc list-inside">
                            <li >Modify or create derivative works from the Service</li>
                            <li>Reverse engineer the Service</li>
                            <li>Copy Service features or functions</li>
                        </ul>
                    </div>

                    <div className="flex flex-col gap-4 mt-4">
                        <h2 id="your-user-content" className="font-bold text-xl">3. Your User Content</h2>
                        <h3 id="content-sharing" className="font-semibold">A. Content Sharing</h3>
                        <p className="text-muted-foreground">
                            <span className="block">
                                Inspird enables you to share various content, including images, videos, and comments
                                (collectively, &quot;User Content&quot;). You maintain all rights to your User Content and are solely responsible
                                for what you post on Inspird. All shared content must comply with these Terms and our policies,
                                including Community Guidelines.
                            </span>
                            <span className="block mt-2">
                                You warrant that you have the necessary rights to post your User Content
                                and agree not to share content that infringes others&apos; intellectual
                                property rights (including copyright and trademark) or violates applicable
                                laws, unless legal exceptions apply. We may take action against content
                                that violates these Terms, our policies, or legal requirements by removing,
                                limiting access to, or restricting distribution of such content. As a
                                neutral intermediary platform, we don&apos;t pre-screen User Content,
                                and therefore aren&apos;t liable to third parties for content accuracy
                                or User Content posted by you or other users. For details on our enforcement
                                practices, visit our Enforcement page. You may appeal decisions you
                                believe were made in error. Local laws may grant you the right to pursue
                                claims if you believe we&apos;ve breached these Terms by taking action
                                on your content or account. We cannot provide legal advice.
                            </span>
                        </p>

                        <h3 id="content-license" className="font-semibold text-base">B. Content License</h3>
                        <p className="text-muted-foreground">
                            <span className="block">
                                By sharing User Content, you grant Inspird, our affiliates, service providers,
                                and users a worldwide, non-exclusive, royalty-free, transferable, sublicensable
                                license to use, store, display, perform, reproduce, modify, create derivatives,
                                monetize, download, translate, and distribute your content, including for
                                promotion and redistribution of Inspird. This license doesn&apos;t: (i) entitle you
                                to compensation or revenue sharing, or (ii) limit our other legal rights to
                                User Content. We reserve the right to remove, limit distribution, or modify content,
                                whether it violates our Terms, Community Guidelines, Copyright Policy,
                                Trademark Policy, other policies, or for other reasonable platform interests.
                            </span>
                        </p>

                        <h3 id="content-retention" className="font-semibold">C. Content Retention</h3>
                        <p className="text-muted-foreground">
                            <span className="block">
                                After account termination, deactivation, or content removal, we may retain User Content
                                for a reasonable period for backup, archival, or audit purposes. Users may continue
                                to use, store, display, reproduce, share, modify, create derivatives from, perform,
                                and distribute any content previously shared on Inspird.
                            </span>
                        </p>

                        <h3 id="user-feedback" className="font-semibold">D. User Feedback</h3>
                        <p className="text-muted-foreground">
                            <span className="block">
                                We welcome your suggestions for improving Inspird. By submitting feedback,
                                you acknowledge we have no obligation to keep it confidential or provide
                                compensation. Please don&apos;t submit confidential information or third-party
                                owned feedback. Our acceptance of feedback doesn&apos;t waive our rights to
                                similar ideas we already knew about, developed internally, or received
                                from other sources.
                            </span>
                        </p>

                        <h3 id="reporting-system" className="font-semibold">E. Reporting System</h3>
                        <p className="text-muted-foreground">
                            <span className="block">
                                Our reporting tools let you flag content that may violate our Terms,
                                policies, or local laws. We review reports promptly and take appropriate
                                action. By using these tools, you agree to submit reports in good faith
                                and not misuse reporting or appeals channels.
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div >
    )
}
