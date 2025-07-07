import Script from 'next/script'
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next"
import Navbar from "@/_components/ui/Navbar";
import {Providers} from "@/Providers";

export const metadata = {
    title: "Hostels",
    description: "Discover comfortable and affordable hostels for your next adventure",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <head>

            <Script
                id="microsoft-clarity-analytics"
                strategy="afterInteractive"
            >
                {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "sayk3j4wyp");
          `}
            </Script>

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
            <Analytics/>
            <SpeedInsights />
        </Providers>
        </body>
        </html>
    );
}