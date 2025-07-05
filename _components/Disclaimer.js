export default function Disclaimer() {
    return (
        <div className="m-6 rounded-2xl">
            <div role="alert">
                <div className="bg-blue-400 text-white font-bold rounded-t px-4 py-2">
                    <div className="animate-pulse">Disclaimer</div>
                </div>
                <div className="border border-t-0 border-blue-200 rounded-b bg-blue-50 px-4 py-3 text-blue-700">
                    <p>
                        This website is intended for informational purposes only.
                        While the information provided has been carefully verified, some inadvertent errors or omissions may still exist.
                        We apologize for any inconvenience this may cause.
                        For feedback or feature requests, please contact us{" "}
                        <a
                            href="/feedback"
                            target="_blank"
                            className="font-mono font-bold hover:underline transition-transform duration-300"
                        >
                            here
                        </a>.
                    </p>
                </div>
            </div>
        </div>
    );
}
