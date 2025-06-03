import Link from "next/link";


export default function Banner() {
    return (
        <div
            className="mt-20 mb-20 relative rounded-2xl overflow-hidden shadow-lg"
            style={{
                backgroundImage: "url('/download.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            <div className="bg-black/50 backdrop-blur-sm p-6 flex justify-left items-end h-60">
                <Link href="/choose"><h1 className="text-3xl font-bold text-white drop-shadow-lg hover:text-blue-500">
                    Help me choose my hostel<span className="material-symbols-outlined">arrow_forward</span>
                </h1></Link>
            </div>
        </div>
    );
}
