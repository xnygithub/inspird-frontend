import "./globals.css";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { ThemeProvider } from "@/components/theme-provider";
import { Geist, Geist_Mono } from "next/font/google";
import { Navbar } from "@/components/navbar/navbar";
import { MobileNavbar } from "@/components/navbar/mobile";
import { SettingsModalProvider, SettingsTab } from "./context/settings-modal";
import SettingsBootstrap from "@/app/modal-controller";
import { Settings } from "@/components/settings/settings";
import SWRProvider from '@/app/providers';

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
  const cookieStore = await cookies();
  const openCookie = cookieStore.get("openSettings");
  const tabCookie = cookieStore.get("openSettingsTab");
  const shouldOpen = Boolean(openCookie);
  const initialTab = tabCookie?.value as SettingsTab;
  try {
    if (openCookie) cookieStore.set("openSettings", "", { path: "/", maxAge: 0 });
    if (tabCookie) cookieStore.set("openSettingsTab", "", { path: "/", maxAge: 0 });
  } catch { }
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SWRProvider>
            <SettingsModalProvider>
              <Navbar />
              <SettingsBootstrap shouldOpen={shouldOpen} initialTab={initialTab} />
              <Settings />
              {children}
              <MobileNavbar />
            </SettingsModalProvider>
          </SWRProvider>
        </ThemeProvider>
      </body>
    </html >
  );
}
