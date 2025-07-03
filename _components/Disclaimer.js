import Link from "next/link";
import {ArrowRight} from "lucide-react";

export default function Disclaimer() {
    return(
        <div className={`m-6 rounded-2xl`}>
            <div role="alert">
                <div className="bg-amber-500 text-white font-bold rounded-t px-4 py-2">
                    <div className={`animate-pulse`}>Disclaimer</div>
                </div>
                <div className="border border-t-0 border-amber-400 rounded-b bg-yellow-50 px-4 py-3 text-amber-700">
                    <p>
                        This website is for informational purposes only.
                        The information here-in has been verified and found to be true.
                        However, despite immense efforts some discrepancies could've crept in.
                        we apologise for any inconveniences caused.
                        We will do our best to keep the information up-to-date.
                        If you find any discrepancies, please report them to us.
                        We will do our best to resolve them as soon as possible.
                    </p>
                </div>
            </div>
        </div>
    )
}