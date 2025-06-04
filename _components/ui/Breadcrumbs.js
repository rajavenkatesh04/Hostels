'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Breadcrumbs() {
    const pathname = usePathname()

    // Don't show breadcrumbs on the home page
    if (pathname === '/') {
        return null
    }

    // Create breadcrumb items based on the current path
    const generateBreadcrumbs = () => {
        const pathSegments = pathname.split('/').filter(segment => segment !== '')

        // Create breadcrumb items with proper labels
        const breadcrumbs = [
            { name: 'Home', href: '/', icon: '🏠' }
        ]

        let currentPath = ''
        pathSegments.forEach((segment, index) => {
            currentPath += `/${segment}`

            // Create human-readable labels for different segments
            let name = segment.charAt(0).toUpperCase() + segment.slice(1)
            let icon = '📂'

            // Customize names and icons based on the route
            switch (segment) {
                case 'hostels':
                    name = 'Hostels'
                    icon = '🏨'
                    break
                case 'about':
                    name = 'About'
                    icon = 'ℹ️'
                    break
                case 'contact':
                    name = 'Contact'
                    icon = '📧'
                    break
                case 'api':
                    return // Don't show API routes in breadcrumbs
            }

            breadcrumbs.push({
                name,
                href: currentPath,
                icon,
                isLast: index === pathSegments.length - 1
            })
        })

        return breadcrumbs
    }

    const breadcrumbs = generateBreadcrumbs()

    return (
        <nav className="bg-gray-50 border-b border-gray-200 py-3">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center space-x-2 text-sm">
                    {breadcrumbs.map((breadcrumb, index) => (
                        <div key={breadcrumb.href} className="flex items-center">
                            {index > 0 && (
                                <svg className="w-4 h-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                            )}

                            {breadcrumb.isLast ? (
                                <span className="flex items-center space-x-1 text-gray-500 font-medium">
                  <span>{breadcrumb.icon}</span>
                  <span>{breadcrumb.name}</span>
                </span>
                            ) : (
                                <Link
                                    href={breadcrumb.href}
                                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                                >
                                    <span>{breadcrumb.icon}</span>
                                    <span>{breadcrumb.name}</span>
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </nav>
    )
}