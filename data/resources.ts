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
  {
    id: 'hostel-rules-2025',
    title: 'SRM Hostel Rules 2025',
    description:
      'Official SRMIST hostel rules and regulations covering conduct, discipline, timings, and resident responsibilities.',
    url: 'https://webstor.srmist.edu.in/web_assets/downloads/2025/srm-hostel-rules-2025.pdf',
    isExternal: true,
  },
  {
    id: 'dining-eateries',
    title: 'Dining & Eateries',
    description:
      'Overview of SRM hostel mess facilities and on-campus eateries, including cuisines, food courts, and dining options available to residents.',
    url: 'https://www.srmist.edu.in/srm-hostels/dining-eateries/',
    isExternal: true,
  },
  {
    id: 'hostel-policy-refund',
    title: 'Hostel Policy & Refund Details',
    description:
      'Official SRMIST hostel policy covering admission terms, withdrawal procedures, and the refund schedule for hostel and mess fees.',
    url: 'https://www.srmist.edu.in/policies/hostel-policy/#hostel-refund',
    isExternal: true,
  },
]
