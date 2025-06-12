import Link from "next/link";
import {ArrowRight} from "lucide-react";


export default function Banner() {
    return(
        <div>
            <Link href="/choose">
                <div
                    className="m-10 rounded-2xl overflow-hidden shadow-lg"
                    style={{
                        backgroundImage: "url('bg2.jpg')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                    }}
                >

                    <div className="bg-black/50 backdrop-blur-sm p-6 flex justify-left items-end h-60" >
                        <h1 className="flex items-center gap-2 text-white text-2xl hover:text-blue-500 duration-200">Help me choose my hostel <span className="flex items-center"><ArrowRight size={25}/></span></h1>
                    </div>
                </div>
            </Link>
        </div>
    )
}