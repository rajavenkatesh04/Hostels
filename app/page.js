import Banner from "@/_components/ui/Banner";
import GoogleMap from "@/_components/maps/GoogleMap";
import FAQ from "@/app/faq/page";


export default function Page() {
    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow p-4 ">
                <Banner />
                {/*<GoogleMap />*/}
                <FAQ />
            </main>
        </div>
    );
}
