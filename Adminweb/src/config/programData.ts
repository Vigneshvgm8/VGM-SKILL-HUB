export interface PlanInfo {
  id: 'explorer' | 'builder' | 'professional';
  name: string;
  duration: string;
  durationMonths: number;
  weeksTotal: number;
  fee: number;
  feeFormatted: string;
  recommended?: boolean;
  outcome: string;
  certificateType: string;
  liveProjectRole: string;
  features: string[];
}

export const PROGRAM_PLANS: Record<string, PlanInfo> = {
  explorer: {
    id: 'explorer',
    name: 'Explorer',
    duration: '1 Month',
    durationMonths: 1,
    weeksTotal: 4,
    fee: 5999,
    feeFormatted: '₹5,999',
    outcome: 'Understand the basics and build one working AI-powered mini app.',
    certificateType: 'Certificate of Participation',
    liveProjectRole: 'Shadow the team and complete small guided tasks such as UI fixes and screen changes.',
    features: [
      'App development fundamentals',
      'AI assistants for coding and learning',
      'Add an AI feature using an API',
      'Build one AI-powered mini app',
      'Shadow the team on a live project',
      'Certificate of participation',
      'Mentor guidance and doubt clearing',
      'Project templates and code access'
    ]
  },
  builder: {
    id: 'builder',
    name: 'Builder',
    duration: '2 Months',
    durationMonths: 2,
    weeksTotal: 8,
    fee: 9999,
    feeFormatted: '₹9,999',
    recommended: true,
    outcome: 'Build a complete app with a backend and smarter AI features.',
    certificateType: 'Certificate of Completion',
    liveProjectRole: 'Own assigned feature modules and work through Git branches with mentor code review.',
    features: [
      'Everything in Explorer',
      'Firebase backend and sign-in',
      'Speech and image AI features',
      'AI-assisted testing and debugging',
      'Own feature modules on a live project',
      'Certificate of completion',
      'Mid-term review & individual code review',
      'Working capstone project on GitHub'
    ]
  },
  professional: {
    id: 'professional',
    name: 'Professional',
    duration: '3 Months',
    durationMonths: 3,
    weeksTotal: 12,
    fee: 14999,
    feeFormatted: '₹14,999',
    outcome: 'Become job-ready with a published app and a strong portfolio.',
    certificateType: 'Certificate of Completion + Experience Letter',
    liveProjectRole: 'Take full ownership of a feature from planning to release, with regular reviews. An experience letter is issued on completion.',
    features: [
      'Everything in Builder',
      'App architecture and performance',
      'Secure, responsible use of AI & API costs',
      'Publish on Google Play Store',
      'Full ownership of a live feature',
      'Resume, portfolio & mock technical interviews',
      'Official Experience Letter on completion',
      'Priority recommendation for openings at VGM Soft Tech'
    ]
  }
};

export interface WeekCurriculum {
  week: number;
  title: string;
  description: string;
  planLevel: 'Explorer' | 'Builder' | 'Professional';
}

export const WEEKS_CURRICULUM: WeekCurriculum[] = [
  {
    week: 1,
    title: 'Foundations and AI Tool Setup',
    description: 'Mobile app basics, Git and GitHub, Flutter or React Native setup, Dart/JS essentials, writing effective prompts, and using AI assistants to learn and fix errors.',
    planLevel: 'Explorer'
  },
  {
    week: 2,
    title: 'Building the Interface',
    description: 'Screens, layouts, navigation, state management basics, and Figma-to-code with AI help.',
    planLevel: 'Explorer'
  },
  {
    week: 3,
    title: 'Adding AI Features',
    description: 'Calling an AI model API, building a chat or summary feature, API key safety and REST integration.',
    planLevel: 'Explorer'
  },
  {
    week: 4,
    title: 'Mini Project and Demo',
    description: 'Build and present a complete AI-powered mini app, such as a study helper.',
    planLevel: 'Explorer'
  },
  {
    week: 5,
    title: 'Backend Basics',
    description: 'Firebase or a simple API, user sign-in, cloud database, and storing and reading app data.',
    planLevel: 'Builder'
  },
  {
    week: 6,
    title: 'Smarter AI Features',
    description: 'Speech-to-text, image recognition, AI-generated content and reliable prompt design.',
    planLevel: 'Builder'
  },
  {
    week: 7,
    title: 'AI for Quality',
    description: 'Using AI to review code, generate tests, write documentation and debug faster, plus team Git workflow.',
    planLevel: 'Builder'
  },
  {
    week: 8,
    title: 'Capstone and Demo',
    description: 'Combine sign-in, database and AI features into one app, then test, fix and present in front of mentors.',
    planLevel: 'Builder'
  },
  {
    week: 9,
    title: 'App Architecture and Performance',
    description: 'Structuring larger apps, improving speed, working in bigger codebases, and using AI tools to refactor existing code.',
    planLevel: 'Professional'
  },
  {
    week: 10,
    title: 'Offline Support and Notifications',
    description: 'Local storage, working without internet, push notifications and background tasks.',
    planLevel: 'Professional'
  },
  {
    week: 11,
    title: 'Safe and Responsible AI',
    description: 'Protecting user data and API keys, controlling API costs, handling wrong or unsafe AI answers, and privacy basics.',
    planLevel: 'Professional'
  },
  {
    week: 12,
    title: 'Publish and Present',
    description: 'Release builds, Google Play Console basics, CI/CD introduction, final presentation, resume, portfolio and mock interview.',
    planLevel: 'Professional'
  }
];

export const TOOLKIT_CATEGORIES = [
  {
    title: 'AI Assistants',
    tools: ['ChatGPT', 'Claude', 'Gemini', 'GitHub Copilot', 'Cursor'],
    description: 'AI pair programming, code refactoring, context prompting and debugging.'
  },
  {
    title: 'App Development',
    tools: ['Flutter (Dart)', 'React Native', 'VS Code', 'Android Studio'],
    description: 'Cross-platform mobile engineering with native performance.'
  },
  {
    title: 'Design & Prototyping',
    tools: ['Figma', 'AI-assisted UI generation tools', 'Tailwind CSS'],
    description: 'Design systems, interactive prototypes, and layout tokens.'
  },
  {
    title: 'Backend & Data',
    tools: ['Firebase', 'REST APIs', 'AI Model APIs', 'Postman'],
    description: 'Cloud Firestore, Auth, serverless functions and API testing.'
  },
  {
    title: 'Collaboration & Git',
    tools: ['Git', 'GitHub', 'Pull Requests', 'Issue Tracking', 'Code Review'],
    description: 'Team development branching, mentor approvals and CI workflows.'
  },
  {
    title: 'Publishing & Release',
    tools: ['Google Play Console', 'App Bundles', 'Build & Release Basics'],
    description: 'Store policies, signing keys, release pipelines and deployment.'
  }
];

export const BATCH_OPTIONS = [
  { id: 'nov-morning', label: 'November 2026 Batch — Morning (9:00 AM – 12:30 PM IST)' },
  { id: 'nov-evening', label: 'November 2026 Batch — Evening (5:00 PM – 8:30 PM IST)' },
  { id: 'nov-weekend', label: 'November 2026 Batch — Weekend Intensive (Sat & Sun Full Day)' },
  { id: 'dec-morning', label: 'December 2026 Batch — Morning (9:00 AM – 12:30 PM IST)' }
];

export const CONTACT_INFO = {
  name: 'VGM Skill Hub',
  parentCompany: 'VGM Soft Tech',
  location: 'Saibaba Colony, Coimbatore, Tamil Nadu, India',
  phone: '+91 9345615913',
  email: 'intern@vgmsofttech.com',
  whatsappUrl: 'https://wa.me/919345615913',
  workingHours: 'Monday – Saturday: 9:00 AM – 6:30 PM IST'
};
