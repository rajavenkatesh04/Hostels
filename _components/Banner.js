import Link from "next/link";
import {ArrowRight} from "lucide-react";

export default function Banner() {
    return(
        <div>
            <Link href="/choose">
                <div
                    className="m-6 rounded-2xl overflow-hidden shadow-lg"
                    style={{
                        backgroundImage: "url('bg2.jpg')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                    }}
                >

                    <div className="bg-black/20 p-6 backdrop-blur-xl flex justify-left items-end h-60" >
                        <h1 className="animate-pulse flex items-center text-white text-2xl hover:text-blue-700 duration-300">Help me choose my hostel <span className="flex items-center"><ArrowRight size={30}/></span></h1>
                    </div>
                </div>
            </Link>
        </div>
    )
}