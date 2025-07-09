export default function Disclaimer() {
    return (
        <div className="m-6 rounded-2xl">
            <div role="alert" className="overflow-hidden rounded-2xl shadow-soft">
                <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--color-sage-dark)' }}>
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full pulse-gentle" style={{ backgroundColor: 'var(--color-teal-action)' }}></div>
                        <h3 className="font-medium tracking-wide" style={{ color: 'var(--color-warm-gray)' }}>
                            Disclaimer
                        </h3>
                    </div>
                </div>
                <div className="px-6 py-5 border-l-4" style={{ backgroundColor: 'var(--color-warm-white)', borderColor: 'var(--color-sage-dark)' }}>
                    <p className="leading-relaxed" style={{ color: 'var(--color-warm-gray)' }}>
                        This website is intended for informational purposes only.
                        While the information provided has been carefully verified, some inadvertent errors or omissions may still exist.
                        We apologize for any inconvenience this may cause.
                        For feedback or suggestions, please contact us{" "}
                        <a
                            href="/feedback"
                            target="_blank"
                            className="underline decoration-1 underline-offset-4 transition-colors duration-500 ease-out"
                            style={{ color: 'var(--color-teal-action)' }}
                            onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-teal-hover)'}
                            onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-teal-action)'}
                        >
                            here
                        </a>.
                    </p>
                </div>
            </div>
        </div>
    );
}
