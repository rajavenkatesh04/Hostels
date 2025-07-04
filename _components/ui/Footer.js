import {Github} from "lucide-react";

export default function Footer() {
    return(
        <div className="m-6 text-center text-xs text-gray-600 opacity-50">
            <div>
                Hostel _v1.0 • Built by <a href={"https://rajavenkatesh.me/"} target={`_blank`} className={`hover:underline hover:text-purple-800 hover:font-bold`}>Raja Venkatesh</a>
            </div>
        </div>
    )
}