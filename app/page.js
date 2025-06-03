import Image from "next/image";
import Banner from "@/_components/ui/Banner";
import Footer from "@/_components/ui/Footer";
import Navbar from "@/_components/ui/Navbar";

export default function Home() {
    return (
        <div className="font-[family-name:var(--font-geist-sans)]">
            <Navbar />
            <div className="mx-auto lg:px-10 sm:mx-auto px-6">
                <Banner />
                <Footer />
            </div>

        </div>
    );
}
