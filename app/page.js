import Image from "next/image";
import Banner from "@/_components/ui/Banner";
import Footer from "@/_components/ui/Footer";
import Navbar from "@/_components/ui/Navbar";


export default function Page() {
    return (
        <div className="flex flex-col min-h-screen">
            {/*<Navbar />*/}
            <main className="flex-grow p-4">
                <Banner />

            </main>
            {/*<Footer />*/}
        </div>
    );
}
