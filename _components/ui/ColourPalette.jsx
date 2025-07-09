export default function ColourPalette() {
    return (
    // Temporary color palette test component
        <div className="p-4 space-y-4">
            <div style={{ backgroundColor: 'var(--color-sage-primary)' }} className="p-4 rounded">
                Sage Primary Background
            </div>
            <div style={{ backgroundColor: 'var(--color-warm-white)' }} className="p-4 rounded shadow">
                Warm White Content Area
            </div>
            <div style={{ backgroundColor: 'var(--color-blue-gray-accent)' }} className="p-4 rounded">
                Blue Gray Accent
            </div>
            <div style={{ backgroundColor: 'var(--color-teal-action)', color: 'white' }} className="p-4 rounded">
                Teal Action Button
            </div>
        </div>
    )
}