import Banner from "@/_components/Banner";
import FAQ from "@/app/faq/page";
import Maps from "@/app/maps/page";
import Disclaimer from "@/_components/Disclaimer";

export default function Home() {
    return (
        <div>
            <Banner />
            <div className={`flex flex-wrap`}>
                <div className={`w-full sm:w-2/3`}><Maps/></div>
                <div className={`w-full sm:w-1/3`}><FAQ/></div>
            </div>
            <Disclaimer/>
        </div>
    );
}
