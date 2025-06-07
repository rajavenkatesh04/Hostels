import { Copyright, Github } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="relative flex flex-col items-center justify-center py-4 text-center mt-20 bg-gray-500">
            <p className="flex items-center gap-2 hover:underline">
                Built by Raja Venkatesh
                <a href="https://github.com/rajavenkatesh04" target="_blank" rel="noopener noreferrer">
                    <Github className="w-5 h-5 hover:text-black transition-colors underline " />
                </a>
            </p>
        </footer>
    );
}
