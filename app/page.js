import Banner from "@/_components/ui/Banner";
import GoogleMap from "@/_components/maps/GoogleMap";


export default function Page() {
    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow p-5">
                <Banner />
                <GoogleMap />
            </main>
        </div>
    );
}
