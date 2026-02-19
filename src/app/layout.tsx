import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto } from "next/font/google";
import "./globals.css";
import Header from "../components/header";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: {
    default: "CMS",
    template: "CMS | %s",
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${roboto.variable}`} style={styles.bodyStyle}>
        <AuthProvider>
          <Header />
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: "var(--color-bg-light)",
                color: "var(--color-text)",
                border: "1px solid #e5e7eb",
                height: "100px",
                width: '30%'
              },
            }}
            />
        </AuthProvider>
      </body>
    </html>
  );
}


const styles: Record<string, React.CSSProperties> = {
  bodyStyle: {
    backgroundColor: "var(--color-bg)", 
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  }
}