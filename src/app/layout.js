import { Inter } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "TaleTraverse: Netlify Hackathon",
  description: "Project for Netlify Hackathon: TaleTraverse",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.svg" sizes="any" />
      </head>
      <body className={inter?.className}>
        {children} <ToastContainer />
      </body>
    </html>
  );
}
