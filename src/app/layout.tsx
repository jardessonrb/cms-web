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
                height: "80px",
                width: "50%",
                minWidth: "350px",
                fontWeight: "500",
              },

              success: {
                style: {
                  background: "var(--color-success)", // verde
                  color: "var(--color-bg-light)",
                  fontWeight: "bold",
                  minWidth: "60%"
                },
                iconTheme: {
                  primary: "var(--color-bg-light)",
                  secondary: "var(--color-success)",
                },
              },

              error: {
                style: {
                  background: "var(--color-error)", // vermelho
                  color: "var(--color-bg-light)",
                  fontWeight: "bold",
                  minWidth: "60%",
                },
                iconTheme: {
                  primary: "var(--color-bg-light)",
                  secondary: "var(--color-error)",
                },
              }
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