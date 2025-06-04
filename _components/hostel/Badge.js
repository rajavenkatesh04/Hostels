export default function Badge({ text, variant = 'gray', size = 'md' }) {
    const variants = {
        gray: 'bg-gray-100 text-gray-800',
        blue: 'bg-blue-100 text-blue-800',
        green: 'bg-green-100 text-green-800',
        yellow: 'bg-yellow-100 text-yellow-800',
        pink: 'bg-pink-100 text-pink-800',
        red: 'bg-red-100 text-red-800'
    }

    const sizes = {
        sm: 'px-2 py-1 text-xs',
        md: 'px-3 py-1 text-sm'
    }

    return (
        <span className={`inline-flex items-center rounded-full font-medium ${variants[variant]} ${sizes[size]}`}>
      {text}
    </span>
    )
}