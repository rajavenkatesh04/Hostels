import Disclaimer from "@/_components/Disclaimer";
import Banner from "@/_components/Banner";
import Maps from "@/app/maps/page";
import FAQ from "@/app/faq/page";
import HostelSearchBar from "@/_components/hostel/HostelSearchBar";

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col">
            <div className="md:hidden m-4">
                <HostelSearchBar />
            </div>
            <Banner />
            <div className="flex flex-col sm:flex-row flex-1">
                <div className="w-full sm:w-2/3 min-h-[50vh] sm:min-h-[calc(100vh-120px)]">
                    <Maps/>
                </div>
                <div className="w-full sm:w-1/3">
                    <FAQ/>
                </div>
            </div>
            <Disclaimer/>
        </div>
    );
}