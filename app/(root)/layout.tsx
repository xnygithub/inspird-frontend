import { AnonNavbar } from "@/components/navbar/anon-nav";
import Footer from "@/components/footer";
import { Toaster } from "@/components/ui/sonner"

export default async function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <>
      <AnonNavbar />
      {children}
      <Footer />
      <Toaster position="bottom-center" />
    </>
  );
}
