import {Github} from "lucide-react";

export default function Footer() {
    return(
        <footer className="w-full fixed bottom-0 bg-gray-500 flex items-center justify-center p-4">
            <p className="flex items-center gap-2">Built with love by Raja
                <a href="https://github.com/rajavenkatesh04" target="_blank" rel="noreferrer">
                    <Github />
                </a>
            </p>
        </footer>
    )
}