export interface PlacementStory {
  name: string;
  previousDegree: string;
  college: string;
  company: string;
  role: string;
  package: string;
  courseCompleted: string;
  year: string;
  testimonial: string;
  avatarInitials: string;
  badge?: string;
}

export interface HiringPartner {
  name: string;
  category: 'Product' | 'Services' | 'FinTech' | 'SaaS' | 'Enterprise';
  city: string;
  logo?: string;
}

export const PLACEMENT_STATS = {
  placementRate: '94.8%',
  highestPackage: '₹16.0 LPA',
  averagePackage: '₹5.2 LPA',
  totalAlumniPlaced: '1,450+',
  activeHiringPartners: '50+',
  projectHoursCompleted: '400+ Hrs'
};

export const HIRING_PARTNERS: HiringPartner[] = [
  { name: 'VGM Soft Tech', category: 'Enterprise', city: 'Coimbatore', logo: '/assets/partners/vgmsofttech.svg' },
  { name: 'Zoho Corporation', category: 'SaaS', city: 'Chennai / Coimbatore', logo: '/assets/partners/zoho.svg' },
  { name: 'Freshworks', category: 'SaaS', city: 'Chennai', logo: '/assets/partners/freshworks.svg' },
  { name: 'Tata Consultancy Services', category: 'Services', city: 'Coimbatore / Chennai', logo: '/assets/partners/tcs.svg' },
  { name: 'Infosys', category: 'Services', city: 'Bangalore / Coimbatore', logo: '/assets/partners/infosys.svg' },
  { name: 'Cognizant', category: 'Services', city: 'Coimbatore', logo: '/assets/partners/cognizant.svg' },
  { name: 'Wipro Technologies', category: 'Services', city: 'Coimbatore', logo: '/assets/partners/wipro.svg' },
  { name: 'Bosch Global Software', category: 'Enterprise', city: 'Coimbatore', logo: '/assets/partners/bosch.svg' },
  { name: 'Thoughtworks', category: 'Product', city: 'Coimbatore', logo: '/assets/partners/thoughtworks.svg' },
  { name: 'Kovai.co', category: 'Product', city: 'Coimbatore', logo: '/assets/partners/kovaico.svg' },
  { name: 'Swiggy', category: 'Product', city: 'Bangalore / Chennai', logo: '/assets/partners/swiggy.svg' },
  { name: 'Razorpay', category: 'FinTech', city: 'Bangalore', logo: '/assets/partners/razorpay.svg' },
  { name: 'Payoda Technologies', category: 'Services', city: 'Coimbatore', logo: '/assets/partners/payoda.svg' }
];

export const ALUMNI_STORIES: PlacementStory[] = [
  {
    name: 'Kavitha Ramasamy',
    previousDegree: 'B.E CSE (2025)',
    college: 'PSG College of Technology',
    company: 'VGM Soft Tech',
    role: 'Mobile AI Engineer',
    package: '₹7.5 LPA',
    courseCompleted: 'AI-Powered Mobile App Internship',
    year: '2026',
    testimonial: 'The live client projects at VGM Soft Tech in Saibaba Colony were a game-changer. Rather than toy projects, we built an AI voice assistant for an actual mobile app. When I sat for interviews, my GitHub code and Google Play link did all the talking.',
    avatarInitials: 'KR',
    badge: 'Campus to Corporate'
  },
  {
    name: 'Dinesh Karthik',
    previousDegree: 'B.Sc Computer Science',
    college: 'Government Arts College, Coimbatore',
    company: 'Kovai.co',
    role: 'Full-Stack Software Engineer',
    package: '₹8.2 LPA',
    courseCompleted: 'Full-Stack Web Development & AI',
    year: '2026',
    testimonial: 'Coming from a non-engineering college, most companies filtered me out. VGM Skill Hub’s intensive 4-month bootcamp and mentor reviews transformed my technical depth. I built full-stack Next.js apps with PostgreSQL and cracked 3 job offers.',
    avatarInitials: 'DK',
    badge: 'Non-Engineering Success'
  },
  {
    name: 'Ananya Sreedharan',
    previousDegree: 'B.Tech IT (2025)',
    college: 'CIT Coimbatore',
    company: 'Zoho Corporation',
    role: 'Cloud & DevOps Associate',
    package: '₹9.0 LPA',
    courseCompleted: 'Cloud Engineering & Kubernetes',
    year: '2026',
    testimonial: 'Learning Docker and Kubernetes through practical cluster deployment labs rather than just slides gave me real troubleshooting skills. The mock interview rounds by senior tech architects were exceptionally thorough.',
    avatarInitials: 'AS',
    badge: 'Top Tech Placement'
  },
  {
    name: 'Mohamed Rizwan',
    previousDegree: 'B.E Mechanical Engineering',
    college: 'Kumaraguru College of Technology',
    company: 'Payoda Technologies',
    role: 'Data Analyst & BI Specialist',
    package: '₹6.0 LPA',
    courseCompleted: 'Data Science & Machine Learning',
    year: '2026',
    testimonial: 'Transitioning from Mechanical to IT felt impossible until I joined VGM Skill Hub. The mentors were patient, guiding me from SQL queries up to complex PowerBI dashboards and predictive models.',
    avatarInitials: 'MR',
    badge: 'Stream Switcher'
  },
  {
    name: 'Priyanka Natarajan',
    previousDegree: 'B.Sc Visual Communication',
    college: 'PSGR Krishnammal College for Women',
    company: 'Skava Systems',
    role: 'UI/UX Product Designer',
    package: '₹6.8 LPA',
    courseCompleted: 'UI/UX Design & AI Prototyping',
    year: '2026',
    testimonial: 'I had visual skills but didn’t know how software companies build scalable design systems in Figma. In 8 weeks, I created 3 case studies, learned auto-layout and usability testing, and landed a product design role.',
    avatarInitials: 'PN',
    badge: 'Design Portfolio Hero'
  }
];

export const CAREER_SUPPORT_PILLARS = [
  {
    title: '400+ Hours Hands-On Learning',
    description: 'Practical daily lab exercises, live coding sessions, and continuous feedback directly inside an active software development environment.'
  },
  {
    title: 'Real Production Client Projects',
    description: 'Work directly on enterprise software modules under VGM Soft Tech, following industry Agile sprints, Git pull requests, and peer code reviews.'
  },
  {
    title: '1-on-1 Staff Engineer Mentorship',
    description: 'Direct guidance from practicing senior developers who resolve your code blockers, conduct individual audits, and mentor your technical choices.'
  },
  {
    title: '100% Placement Assistance Cell',
    description: 'Dedicated recruitment team organizing campus interview drives, resume redesigns, LinkedIn branding, and direct referrals across Coimbatore and Bangalore.'
  }
];

