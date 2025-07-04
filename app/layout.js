import { GeistSans, GeistMono } from 'geist/font';
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import Navbar from "@/_components/ui/Navbar";
import Footer from "@/_components/ui/Footer";
import {Providers} from "@/Providers";

export const metadata = {
    title: "Hostels",
    description: "Discover comfortable and affordable hostels for your next adventure",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
            />
        </head>
        <body className="antialiased">
        <Providers>
            <div className="flex flex-col min-h-screen">
                <Navbar/>
                <main className="flex-grow pt-16">{children}</main>
                {/*<Footer />*/}
            </div>
            <Analytics/></Providers>
        </body>
        </html>
    );
}