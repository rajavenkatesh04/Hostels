export type Resource = {
  id: string
  title: string
  description?: string
  url: string
  isExternal: boolean
}

export const resources: Resource[] = [
  {
    id: 'circular-2026-27',
    title: 'Hostel Fees Circular 2026–27',
    description:
      'Official SRMIST circular with the complete hostel fee structure for all first-year B.Tech and M.Tech (Integrated) students at Kattankulathur.',
    url: '/resources/circular-2026-27.pdf',
    isExternal: false,
  },
]
