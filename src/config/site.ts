/**
 * Site-level configuration for metadata and structured data
 * Used by SEO components, JSON-LD schemas, and social meta tags
 */

export const site = {
  name: 'Aaron Qian',
  url: 'https://aaronqian.com',
  description:
    'Software Engineer, Freelancer, Father. Building projects and sharing tech insights.',
  locale: 'en-US',
} as const

export const author = {
  name: 'Aaron Qian',
  url: 'https://aaronqian.com',
  description: 'Engineer & Consultant · Hardware Hobbyist · Father',
  email: 'aaron@aaronqian.com',
  twitter: {
    username: 'aq1018',
    url: 'https://twitter.com/aq1018',
  },
  github: {
    username: 'aq1018',
    url: 'https://github.com/aq1018',
  },
} as const

export const organization = {
  name: 'Aaron Qian',
  url: 'https://aaronqian.com',
  logo: 'https://aaronqian.com/favicon.svg',
} as const
