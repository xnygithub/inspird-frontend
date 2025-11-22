import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { Geist, Geist_Mono } from "next/font/google";
import SWRProvider from '@/app/providers';
import { Toaster } from "@/components/ui/sonner"

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Inspird",
    description: "Inspird is a platform for sharing your thoughts and ideas with the world",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <ThemeProvider
                    enableSystem
                    attribute="class"
                    defaultTheme="system"
                    disableTransitionOnChange>
                    <SWRProvider>
                        {children}
                        <Toaster position="bottom-center" />
                    </SWRProvider>
                </ThemeProvider>
            </body>
        </html >
    );
}
