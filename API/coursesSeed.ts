export interface CourseCurriculumModule {
  moduleNumber: number;
  title: string;
  duration: string;
  description: string;
  topics: string[];
  handsOnProject: string;
}

export interface CoursePlanTier {
  id: string;
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

export interface CourseItem {
  id: string;
  slug: string;
  title: string;
  headline: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  badge: string;
  level: string;
  duration: string;
  durationWeeks: number;
  mode: string;
  rating: number;
  reviewsCount: number;
  learnersEnrolled: number;
  liveProjectsCount: number;
  nextBatch: string;
  startingFee: number;
  startingFeeFormatted: string;
  status: 'enrolling' | 'upcoming' | 'waitlist';
  featured?: boolean;
  thumbnail?: string;
  tools: string[];
  careerRoles: string[];
  averagePackage: string;
  highestPackage: string;
  highlights: string[];
  prerequisites: string;
  targetAudience: string[];
  curriculum: CourseCurriculumModule[];
  plans: Record<string, CoursePlanTier>;
  faqs: { question: string; answer: string }[];
}

export const INITIAL_COURSES: CourseItem[] = [
  {
    id: 'ai-mobile-app',
    slug: 'ai-mobile-app',
    thumbnail: '/assets/courses/ai-mobile-app.svg',
    title: 'AI-Powered Mobile App Development Internship',
    headline: 'Build Production iOS & Android Apps Powered by Generative AI & Cloud APIs',
    shortDescription: 'Master Flutter, React Native, Firebase, and Gemini LLM APIs. Work directly on live client projects at VGM Soft Tech in Coimbatore.',
    fullDescription: 'The flagship practical internship at VGM Skill Hub designed to take college students and fresh graduates from coding fundamentals to building, testing, and publishing real AI-augmented cross-platform mobile apps. You will collaborate in Git teams, shadow senior developers on live client projects, integrate streaming LLMs, computer vision, and speech recognition, and publish a capstone app to the Google Play Store.',
    category: 'Mobile Development',
    badge: 'Flagship Internship 2026',
    level: 'Beginner to Advanced',
    duration: '12 Weeks (1 – 3 Months Tracks)',
    durationWeeks: 12,
    mode: 'Hybrid (Coimbatore Campus + Live Online)',
    rating: 4.9,
    reviewsCount: 382,
    learnersEnrolled: 840,
    liveProjectsCount: 3,
    nextBatch: '10th November 2026',
    startingFee: 5999,
    startingFeeFormatted: '₹5,999',
    status: 'enrolling',
    featured: true,
    tools: ['Flutter', 'Dart', 'React Native', 'Firebase', 'Gemini AI API', 'Google Play Console', 'GitHub', 'Figma'],
    careerRoles: ['Mobile Application Developer', 'Flutter Developer', 'React Native Engineer', 'AI Solutions Associate'],
    averagePackage: '₹4.8 LPA',
    highestPackage: '₹11.5 LPA',
    highlights: [
      'Real client project work on VGM Soft Tech enterprise codebases',
      'Choose between 1-Month Explorer, 2-Month Builder, or 3-Month Professional plans',
      'Official Experience Letter & Certificate with online credential verification',
      '1-on-1 code reviews and technical mock interviews with Senior Staff Engineers'
    ],
    prerequisites: 'Basic knowledge of any programming language (C, Java, Python, or JavaScript). No prior mobile app experience required.',
    targetAudience: [
      'Engineering & BCA/B.Sc/MCA students seeking mandatory or career internships',
      'Fresh graduates looking for verifiable production experience',
      'Web developers transitioning to cross-platform mobile & AI engineering'
    ],
    curriculum: [
      {
        moduleNumber: 1,
        title: 'Foundations & Modern AI Developer Toolchain',
        duration: 'Week 1 - 2',
        description: 'Set up Flutter, React Native, Git/GitHub, and configure developer copilots (Cursor, Gemini CLI, Claude) for rapid scaffold development.',
        topics: ['Mobile architecture', 'Dart/JS modern syntax', 'Widget/Component hierarchy', 'AI-assisted debugging', 'State management'],
        handsOnProject: 'Responsive Portfolio & Utility Mini App with local state persistence'
      },
      {
        moduleNumber: 2,
        title: 'Generative AI APIs, Speech & Vision Integration',
        duration: 'Week 3 - 5',
        description: 'Connect REST and WebSocket endpoints, implement Gemini 1.5 Flash streaming, speech-to-text, and image classification directly in the mobile UI.',
        topics: ['API security & secret management', 'Streaming responses', 'Voice recognition', 'Camera & photo picker', 'Offline caching'],
        handsOnProject: 'AI Smart Study & Voice Notes Assistant with offline sync'
      },
      {
        moduleNumber: 3,
        title: 'Cloud Backend, Auth & Real-Time Sync',
        duration: 'Week 6 - 8',
        description: 'Architect a serverless backend using Firebase Auth, Cloud Firestore, Cloud Functions, and push notifications.',
        topics: ['Firebase Authentication', 'Security rules & RBAC', 'Push notifications (FCM)', 'NoSQL schema design', 'Background tasks'],
        handsOnProject: 'Full-stack Collaborative Task & AI Team Workspace App'
      },
      {
        moduleNumber: 4,
        title: 'Live Client Project, Optimization & Play Store Release',
        duration: 'Week 9 - 12',
        description: 'Join a live VGM Soft Tech sprint, adhere to Git PR workflows, optimize app bundle size, run automated UI tests, and release to Google Play.',
        topics: ['Git branching & code review', 'App profiling & memory leaks', 'App bundle signing & keystores', 'Google Play Console compliance', 'Mock interviews & resume polishing'],
        handsOnProject: 'Production-ready Capstone App deployed to Google Play with full documentation'
      }
    ],
    plans: {
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
    },
    faqs: [
      {
        question: 'Can college students attend while attending regular college classes?',
        answer: 'Yes! We offer morning (9:00 AM – 12:30 PM), evening (5:00 PM – 8:30 PM), and intensive weekend batches. Sessions are also recorded in our student portal.'
      },
      {
        question: 'Will I receive an official Experience Letter for college submission?',
        answer: 'Yes. Students enrolled in the Builder (2-Month) and Professional (3-Month) tracks receive an official VGM Soft Tech Experience Letter, stamped project completion certificate, and a verifiable digital credential.'
      }
    ]
  },
  {
    id: 'fullstack-ai-web',
    slug: 'fullstack-ai-web',
    thumbnail: '/assets/courses/fullstack-ai-web.svg',
    title: 'Full-Stack Web Development & AI Engineering',
    headline: 'Become a 360° Software Engineer with React 19, Next.js, Node.js, PostgreSQL & LLM Workflows',
    shortDescription: 'Build modern responsive web applications, secure REST & GraphQL APIs, microservices, and autonomous AI agents. 100% placement track.',
    fullDescription: 'An industry-grade full-stack engineering track designed following contemporary software standards. You will master both frontend architecture (React 19, TypeScript, Tailwind CSS, Next.js App Router) and backend scalable systems (Node.js, Express, PostgreSQL, Prisma, Redis, Docker) along with integrating generative AI agents and LangChain pipelines.',
    category: 'Full-Stack Web',
    badge: '100% Placement Track',
    level: 'Beginner to Advanced',
    duration: '16 Weeks (4 Months)',
    durationWeeks: 16,
    mode: 'Hybrid (Coimbatore Campus + Live Online)',
    rating: 4.95,
    reviewsCount: 420,
    learnersEnrolled: 1120,
    liveProjectsCount: 4,
    nextBatch: '15th November 2026',
    startingFee: 7999,
    startingFeeFormatted: '₹7,999',
    status: 'enrolling',
    featured: true,
    tools: ['React 19', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Prisma ORM', 'Docker', 'LangChain', 'Tailwind CSS'],
    careerRoles: ['Full-Stack Developer', 'Frontend Engineer', 'Backend Node.js Developer', 'Software Engineer'],
    averagePackage: '₹5.5 LPA',
    highestPackage: '₹14.0 LPA',
    highlights: [
      'Comprehensive 400+ hours of coding, architecture design, and system debugging',
      'Build 4 enterprise-grade applications including an AI SaaS product with payments',
      'Direct interview drives with 45+ IT product companies & service firms',
      'Dedicated soft skills, English communication, and DSA interview coaching'
    ],
    prerequisites: 'Basic computer literacy and enthusiasm to write code. We start from ground zero HTML/CSS/JS and build up to distributed systems.',
    targetAudience: [
      'Non-IT graduates and degree holders looking for a guaranteed transition into software jobs',
      'Fresh engineering graduates wanting deep technical stack depth beyond college syllabus',
      'Junior frontend coders aiming to level up to high-paying full-stack engineers'
    ],
    curriculum: [
      {
        moduleNumber: 1,
        title: 'Modern Frontend Architecture & TypeScript',
        duration: 'Weeks 1 - 4',
        description: 'Deep dive into HTML5 semantic standards, modern Tailwind CSS, JavaScript ES2024, TypeScript strict typing, and React 19 hooks.',
        topics: ['TypeScript interfaces & generics', 'React state & effects', 'Custom hooks', 'Tailwind responsive layouts', 'Performance profiling'],
        handsOnProject: 'Interactive Enterprise Analytics Dashboard with real-time charts'
      },
      {
        moduleNumber: 2,
        title: 'Server-Side Next.js & Full-Stack Systems',
        duration: 'Weeks 5 - 8',
        description: 'Server Actions, React Server Components (RSC), App Router, dynamic routing, middleware, and NextAuth authentication.',
        topics: ['Next.js 15 App Router', 'Server-side rendering vs static gen', 'Authentication & OAuth2', 'SEO optimization', 'Zod validation'],
        handsOnProject: 'Multi-vendor E-Commerce Platform with Cart & Razorpay Checkout'
      },
      {
        moduleNumber: 3,
        title: 'Backend Scalability, Databases & Docker',
        duration: 'Weeks 9 - 12',
        description: 'Relational databases with PostgreSQL, Prisma ORM migrations, Redis caching, JWT security, Docker containers, and RESTful API standards.',
        topics: ['PostgreSQL queries & indexes', 'Prisma schema design', 'Redis cache layer', 'Dockerization & Docker Compose', 'API rate limiting'],
        handsOnProject: 'High-throughput Social Community API with search and notifications'
      },
      {
        moduleNumber: 4,
        title: 'AI Integrations, Production CI/CD & Placement Camp',
        duration: 'Weeks 13 - 16',
        description: 'Build autonomous AI agents with LangChain & OpenAI/Gemini, set up GitHub Actions CI/CD to AWS/Vercel, and undergo 20+ mock interview rounds.',
        topics: ['LangChain agentic workflows', 'Vector search with pgvector', 'GitHub Actions deployment', 'Data structures & algorithms (DSA) prep', 'Live placement drives'],
        handsOnProject: 'AI Document Intelligence & Copilot SaaS with subscription billing'
      }
    ],
    plans: {
      standard: {
        id: 'explorer',
        name: 'Standard Foundation',
        duration: '2 Months',
        durationMonths: 2,
        weeksTotal: 8,
        fee: 7999,
        feeFormatted: '₹7,999',
        outcome: 'Master frontend, backend fundamentals, and complete 2 verified web projects.',
        certificateType: 'Certificate of Full-Stack Competency',
        liveProjectRole: 'Contribute to frontend UI and REST API modules under mentor supervision.',
        features: [
          'Frontend React 19 & Tailwind CSS',
          'Node.js & Express REST APIs',
          'Database design with PostgreSQL',
          '2 Guided web projects',
          'Weekly mentor Q&A sessions',
          'Digital certificate & GitHub portfolio review'
        ]
      },
      pro: {
        id: 'builder',
        name: 'Professional Full-Stack',
        duration: '3 Months',
        durationMonths: 3,
        weeksTotal: 12,
        fee: 12999,
        feeFormatted: '₹12,999',
        recommended: true,
        outcome: 'Build complete production apps with Next.js, Docker, and cloud databases.',
        certificateType: 'Advanced Full-Stack Engineering Diploma',
        liveProjectRole: 'Develop full feature vertical from schema to deployment with code reviews.',
        features: [
          'Everything in Standard',
          'Next.js 15 App Router & Server Actions',
          'Prisma ORM & Redis caching',
          'Docker containerization',
          '3 Full-stack projects on GitHub',
          'Resume building & LinkedIn optimization'
        ]
      },
      career: {
        id: 'professional',
        name: 'Career & Placement Track',
        duration: '4 Months',
        durationMonths: 4,
        weeksTotal: 16,
        fee: 18999,
        feeFormatted: '₹18,999',
        outcome: 'Job-ready engineer with AI integration expertise, DSA preparation, and direct placement drives.',
        certificateType: 'Industry Experience Letter + Placement Guarantee Support',
        liveProjectRole: 'Lead architecture of an enterprise module, participate in sprint demos, and receive interview referrals.',
        features: [
          'Everything in Professional',
          'Autonomous AI agents & LangChain integration',
          'AWS cloud deployment & CI/CD pipeline',
          '100% Placement assistance & company interview pipeline',
          '1-on-1 technical mock interviews with tech leads',
          'Official VGM Soft Tech Experience Letter'
        ]
      }
    },
    faqs: [
      {
        question: 'I come from a Mechanical/Civil/Commerce background. Can I succeed in this course?',
        answer: 'Over 45% of our successful alumni come from non-computer science streams. Our curriculum begins from fundamental logic building and step-by-step programming. With our daily lab practice and mentor guidance, non-IT graduates transition smoothly into IT careers.'
      }
    ]
  },
  {
    id: 'data-science-ai',
    slug: 'data-science-ai',
    thumbnail: '/assets/courses/data-science-ai.svg',
    title: 'Data Science, Machine Learning & Agentic AI',
    headline: 'Turn Complex Data into Intelligent Predictive Models & Autonomous AI Agents',
    shortDescription: 'Master Python, SQL, PowerBI, Pandas, Scikit-Learn, PyTorch, and RAG architectures for high-demand Data Scientist and AI Engineer roles.',
    fullDescription: 'A complete immersion into data engineering, statistical modeling, machine learning algorithms, and bleeding-edge Generative AI systems. You will build end-to-end data pipelines, predictive models, interactive PowerBI executive dashboards, and production RAG (Retrieval-Augmented Generation) agentic systems.',
    category: 'AI & Data Science',
    badge: 'High Industry Demand',
    level: 'Beginner to Advanced',
    duration: '14 Weeks (3.5 Months)',
    durationWeeks: 14,
    mode: 'Hybrid (Coimbatore Campus + Live Online)',
    rating: 4.88,
    reviewsCount: 295,
    learnersEnrolled: 670,
    liveProjectsCount: 4,
    nextBatch: '18th November 2026',
    startingFee: 7999,
    startingFeeFormatted: '₹7,999',
    status: 'enrolling',
    featured: true,
    tools: ['Python', 'SQL', 'PowerBI', 'Pandas', 'NumPy', 'Scikit-Learn', 'PyTorch', 'Hugging Face', 'ChromaDB', 'FastAPI'],
    careerRoles: ['Data Analyst', 'Data Scientist', 'Machine Learning Engineer', 'Business Intelligence Analyst'],
    averagePackage: '₹5.2 LPA',
    highestPackage: '₹15.5 LPA',
    highlights: [
      'Master data wrangling, statistical exploratory data analysis, and predictive modeling',
      'Design modern RAG architectures and autonomous LLM agents with vector databases',
      'Create executive-ready business intelligence dashboards in PowerBI and Tableau',
      'Deploy ML models as scalable REST APIs using FastAPI and Docker'
    ],
    prerequisites: 'Basic high school mathematics (algebra, basic statistics). No advanced programming experience required.',
    targetAudience: [
      'Graduates wanting to enter high-paying Data Analyst or AI Engineer roles',
      'Finance, marketing, and operations professionals seeking data-driven decision capabilities',
      'Software engineers transitioning into applied machine learning'
    ],
    curriculum: [
      {
        moduleNumber: 1,
        title: 'Python for Data Analysis & Advanced SQL',
        duration: 'Weeks 1 - 3',
        description: 'Python fundamentals, data structures, NumPy matrix computations, Pandas dataframe wrangling, and complex SQL joins, CTEs, and window functions.',
        topics: ['NumPy vector operations', 'Pandas data cleaning & transformation', 'Advanced SQL joins & indexing', 'Data visualization with Seaborn', 'Exploratory data analysis (EDA)'],
        handsOnProject: 'Financial Fraud & Customer Churn Analysis on 500,000+ transaction dataset'
      },
      {
        moduleNumber: 2,
        title: 'Business Intelligence & PowerBI Dashboards',
        duration: 'Weeks 4 - 6',
        description: 'Data modeling, DAX formulas, interactive drill-through dashboards, KPI tracking, and storytelling for business leaders.',
        topics: ['Star schema design', 'DAX measures & calculated columns', 'PowerBI report publishing', 'Executive presentation skills'],
        handsOnProject: 'Live E-Commerce Sales & Supply Chain Executive BI Suite'
      },
      {
        moduleNumber: 3,
        title: 'Applied Machine Learning & Predictive Modeling',
        duration: 'Weeks 7 - 10',
        description: 'Supervised and unsupervised algorithms: Regression, Classification, Random Forests, XGBoost, Clustering, and model evaluation metrics.',
        topics: ['Feature engineering & scaling', 'Cross-validation & hyperparameter tuning', 'Ensemble methods (XGBoost, LightGBM)', 'Confusion matrix & ROC-AUC curves'],
        handsOnProject: 'Automated Loan Default Risk Prediction Engine with explainable AI (SHAP)'
      },
      {
        moduleNumber: 4,
        title: 'Deep Learning, LLMs & Agentic RAG Systems',
        duration: 'Weeks 11 - 14',
        description: 'Neural networks, PyTorch fundamentals, Hugging Face transformers, vector embeddings, semantic search, and building production AI agents.',
        topics: ['PyTorch tensors & neural nets', 'Fine-tuning & LoRA overview', 'Vector databases (ChromaDB / Pinecone)', 'FastAPI deployment for ML', 'Resume & portfolio defense'],
        handsOnProject: 'Enterprise Multi-Modal RAG Knowledge Assistant with citation verification'
      }
    ],
    plans: {
      explorer: {
        id: 'explorer',
        name: 'Data Analyst Track',
        duration: '6 Weeks',
        durationMonths: 1.5,
        weeksTotal: 6,
        fee: 7999,
        feeFormatted: '₹7,999',
        outcome: 'Become a job-ready Data Analyst proficient in Python, SQL, and PowerBI dashboards.',
        certificateType: 'Certificate in Data Analytics & BI',
        liveProjectRole: 'Extract, clean, and visualize company dataset for analytical reporting.',
        features: [
          'Python for Data Science (NumPy, Pandas)',
          'Advanced SQL for analytics & queries',
          'PowerBI interactive dashboards & DAX',
          '2 Real-world analytics projects',
          'Certificate of completion'
        ]
      },
      builder: {
        id: 'builder',
        name: 'Machine Learning Specialist',
        duration: '10 Weeks',
        durationMonths: 2.5,
        weeksTotal: 10,
        fee: 12999,
        feeFormatted: '₹12,999',
        recommended: true,
        outcome: 'Build predictive machine learning pipelines, feature engineering, and model deployment.',
        certificateType: 'Applied Machine Learning Certification',
        liveProjectRole: 'Develop predictive models and integrate inference APIs into applications.',
        features: [
          'Everything in Data Analyst Track',
          'Supervised & Unsupervised ML algorithms',
          'XGBoost, Random Forests & Hyperparameter tuning',
          'FastAPI model serving',
          '3 Machine learning capstones on GitHub',
          'Mock technical interview sessions'
        ]
      },
      professional: {
        id: 'professional',
        name: 'Full AI & Agentic Systems Track',
        duration: '14 Weeks',
        durationMonths: 3.5,
        weeksTotal: 14,
        fee: 17999,
        feeFormatted: '₹17,999',
        outcome: 'Master Deep Learning, LLM embeddings, RAG pipelines, and secure placements in cutting-edge AI roles.',
        certificateType: 'Experience Letter in AI & Data Science + Placement Support',
        liveProjectRole: 'Architect and deploy an enterprise RAG agentic system on live cloud infrastructure.',
        features: [
          'Everything in ML Specialist',
          'Deep Learning with PyTorch',
          'RAG architectures & vector databases',
          'Autonomous LLM agents & prompt engineering',
          '100% Placement assistance & referral network',
          'Official VGM Soft Tech Experience Letter'
        ]
      }
    },
    faqs: [
      {
        question: 'Do I need heavy mathematical or statistical background?',
        answer: 'We explain all concepts with intuitive visual demonstrations and practical Python libraries. If you understand basic percentages and averages, our mentors will guide you through the rest step-by-step.'
      }
    ]
  },
  {
    id: 'cloud-devops',
    slug: 'cloud-devops',
    thumbnail: '/assets/courses/cloud-devops.svg',
    title: 'Cloud Engineering, DevOps & Kubernetes Mastery',
    headline: 'Architect Resilient Cloud Infrastructure, CI/CD Pipelines & Microservices on AWS',
    shortDescription: 'Master Linux, Docker, Kubernetes, Terraform, GitHub Actions, AWS Cloud Services, and Prometheus monitoring for in-demand DevOps roles.',
    fullDescription: 'Designed for engineers who want to manage enterprise infrastructure, automate deployment lifecycles, and scale distributed cloud applications. You will operate Linux enterprise servers, write Infrastructure as Code with Terraform, containerize microservices with Docker, orchestrate production Kubernetes clusters, and build zero-downtime CI/CD pipelines.',
    category: 'Cloud & DevOps',
    badge: 'Trending Cloud Career',
    level: 'Intermediate',
    duration: '12 Weeks (3 Months)',
    durationWeeks: 12,
    mode: 'Hybrid (Coimbatore Campus + Live Online)',
    rating: 4.92,
    reviewsCount: 198,
    learnersEnrolled: 430,
    liveProjectsCount: 3,
    nextBatch: '22nd November 2026',
    startingFee: 7999,
    startingFeeFormatted: '₹7,999',
    status: 'enrolling',
    featured: false,
    tools: ['AWS (EC2, S3, EKS)', 'Docker', 'Kubernetes (K8s)', 'Terraform', 'Linux', 'GitHub Actions', 'Prometheus', 'Grafana', 'Nginx'],
    careerRoles: ['DevOps Engineer', 'Cloud Infrastructure Engineer', 'Site Reliability Engineer (SRE)', 'Kubernetes Administrator'],
    averagePackage: '₹6.0 LPA',
    highestPackage: '₹16.0 LPA',
    highlights: [
      'Hands-on experience deploying to real AWS cloud accounts with proper security boundaries',
      'Automate complete multi-stage CI/CD pipelines with GitHub Actions and Docker',
      'Deploy production Kubernetes clusters with auto-scaling, ingress, and monitoring',
      'Gain real troubleshooting skills on enterprise incident simulations'
    ],
    prerequisites: 'Basic knowledge of command-line concepts or computer operating systems. Scripting knowledge (Bash or Python) is helpful but covered from basics.',
    targetAudience: [
      'System administrators and IT support engineers upgrading to cloud automation',
      'Software developers wanting to master deployment, containers, and cloud architecture',
      'Freshers aiming for high-demand DevOps and Cloud Consultant job profiles'
    ],
    curriculum: [
      {
        moduleNumber: 1,
        title: 'Linux Administration, Networking & Shell Scripting',
        duration: 'Weeks 1 - 3',
        description: 'Master enterprise Linux file systems, user permissions, networking, systemd services, and Bash automation scripts.',
        topics: ['Linux command-line mastery', 'Shell scripting & cron automations', 'Networking protocols & Nginx reverse proxy', 'SSH keys & server hardening'],
        handsOnProject: 'High-Availability Nginx Web Cluster with automated SSL certificates'
      },
      {
        moduleNumber: 2,
        title: 'Docker Containers & Modern Microservices',
        duration: 'Weeks 4 - 6',
        description: 'Container architecture, Dockerfile multi-stage builds, container security, Docker Compose networking, and volume persistence.',
        topics: ['Multi-stage Docker builds', 'Layer caching & minimal images (Alpine)', 'Docker Compose multi-service stacks', 'Container health checks & logging'],
        handsOnProject: 'Containerized Microservices Suite with database, Redis cache, and frontend'
      },
      {
        moduleNumber: 3,
        title: 'Kubernetes Orchestration & Production Clusters',
        duration: 'Weeks 7 - 9',
        description: 'Deploying Pods, Deployments, Services, ConfigMaps, Secrets, Ingress Controllers, Horizontal Pod Autoscaling (HPA), and Helm charts.',
        topics: ['K8s architecture & control plane', 'Declarative YAML manifests', 'Ingress routing & SSL termination', 'Helm package management', 'Cluster backup & updates'],
        handsOnProject: 'Zero-Downtime Blue/Green Deployment Cluster on AWS EKS with autoscaling'
      },
      {
        moduleNumber: 4,
        title: 'Terraform IaC, CI/CD Automation & Observability',
        duration: 'Weeks 10 - 12',
        description: 'Provisioning AWS infrastructure with Terraform, building GitHub Actions CI/CD pipelines, and setting up Prometheus & Grafana monitoring dashboards.',
        topics: ['Terraform state & modules', 'GitHub Actions automated testing & staging', 'Prometheus metrics & Grafana alerts', 'Mock interviews & cloud portfolio defense'],
        handsOnProject: 'Fully-Automated GitOps Infrastructure Pipeline from commit to production'
      }
    ],
    plans: {
      explorer: {
        id: 'explorer',
        name: 'Cloud & Docker Foundations',
        duration: '1 Month',
        durationMonths: 1,
        weeksTotal: 4,
        fee: 6999,
        feeFormatted: '₹6,999',
        outcome: 'Master Linux administration, AWS essentials, and Docker containerization.',
        certificateType: 'Certificate in Cloud Foundations',
        liveProjectRole: 'Configure Linux servers and containerize internal microservice apps.',
        features: [
          'Linux sysadmin & shell scripting',
          'AWS core services (EC2, S3, VPC)',
          'Docker container creation & Compose',
          '1 Guided cloud deployment project',
          'Certificate of completion'
        ]
      },
      builder: {
        id: 'builder',
        name: 'DevOps & CI/CD Specialist',
        duration: '2 Months',
        durationMonths: 2,
        weeksTotal: 8,
        fee: 11999,
        feeFormatted: '₹11,999',
        recommended: true,
        outcome: 'Automate build pipelines with GitHub Actions, Terraform IaC, and Kubernetes basics.',
        certificateType: 'DevOps & Automation Certification',
        liveProjectRole: 'Build CI/CD pipelines and manage infrastructure code templates.',
        features: [
          'Everything in Cloud Foundations',
          'Terraform Infrastructure as Code (IaC)',
          'GitHub Actions CI/CD workflows',
          'Kubernetes fundamentals & manifests',
          '2 Full cloud automation projects',
          'Resume building & interview guidance'
        ]
      },
      professional: {
        id: 'professional',
        name: 'Enterprise Cloud & K8s Architect',
        duration: '3 Months',
        durationMonths: 3,
        weeksTotal: 12,
        fee: 16999,
        feeFormatted: '₹16,999',
        outcome: 'Production Kubernetes management, Grafana observability, and direct job placement support.',
        certificateType: 'Experience Letter in Cloud DevOps + Placement Support',
        liveProjectRole: 'Lead cloud deployment pipeline for live VGM Soft Tech enterprise applications.',
        features: [
          'Everything in DevOps Specialist',
          'Production AWS EKS cluster deployment',
          'Prometheus & Grafana observability stack',
          'GitOps & disaster recovery drills',
          '100% Placement assistance & interview drives',
          'Official VGM Soft Tech Experience Letter'
        ]
      }
    },
    faqs: [
      {
        question: 'Will I need to pay for AWS cloud resources during the training?',
        answer: 'We provide structured sandbox accounts and teach you how to stay safely within AWS Free Tier limits and destroy resources cleanly with Terraform so you incur zero unwanted cloud bills.'
      }
    ]
  },
  {
    id: 'cybersecurity-defensive',
    slug: 'cybersecurity-defensive',
    thumbnail: '/assets/courses/cybersecurity-defensive.svg',
    title: 'Cybersecurity, Ethical Hacking & SOC Analyst Track',
    headline: 'Protect Digital Assets, Detect Threat Actors & Master Practical Security Operations',
    shortDescription: 'Hands-on network security, penetration testing fundamentals, SIEM log analysis, web application security (OWASP Top 10), and vulnerability assessment.',
    fullDescription: 'Prepare for high-demand cybersecurity roles such as SOC Analyst (L1/L2), Vulnerability Assessor, and Junior Penetration Tester. You will analyze real network attack traffic using Wireshark, detect intrusions with Splunk/Wazuh, secure Linux and Windows environments, and perform authorized web application audits following OWASP methodologies.',
    category: 'Cybersecurity',
    badge: 'Critical Defense Skill',
    level: 'Beginner to Intermediate',
    duration: '12 Weeks (3 Months)',
    durationWeeks: 12,
    mode: 'Hybrid (Coimbatore Campus + Live Online)',
    rating: 4.89,
    reviewsCount: 164,
    learnersEnrolled: 390,
    liveProjectsCount: 3,
    nextBatch: '25th November 2026',
    startingFee: 7999,
    startingFeeFormatted: '₹7,999',
    status: 'enrolling',
    featured: false,
    tools: ['Kali Linux', 'Wireshark', 'Burp Suite', 'Wazuh SIEM', 'Nmap', 'Metasploit', 'OWASP ZAP', 'Splunk'],
    careerRoles: ['SOC Analyst L1/L2', 'Cybersecurity Specialist', 'Junior Penetration Tester', 'Information Security Officer'],
    averagePackage: '₹5.0 LPA',
    highestPackage: '₹13.5 LPA',
    highlights: [
      'Hands-on cyber range labs with safe simulated target virtual machines',
      'Master the OWASP Top 10 web vulnerabilities (SQLi, XSS, CSRF, IDOR)',
      'Analyze live intrusion scenarios with industry SIEM tools (Wazuh & Splunk)',
      'Prepare for globally recognized certifications (CompTIA Security+, CEH)'
    ],
    prerequisites: 'Basic familiarity with computer hardware, Windows or Linux operating systems, and basic networking concepts.',
    targetAudience: [
      'Students and engineers eager to enter the booming cybersecurity industry',
      'System administrators wanting to transition into dedicated defensive or offensive security',
      'Graduates wanting recognized certifications and practical hands-on lab experience'
    ],
    curriculum: [
      {
        moduleNumber: 1,
        title: 'Networking Protocols, Linux Hardening & Reconnaissance',
        duration: 'Weeks 1 - 3',
        description: 'Deep dive into OSI layers, TCP handshake, DNS, Wireshark packet capture, Linux file system security, and passive/active reconnaissance with Nmap.',
        topics: ['Packet sniffing with Wireshark', 'Port scanning & banner grabbing with Nmap', 'Linux access controls & hardening', 'Network defenses & firewalls'],
        handsOnProject: 'Complete Network Vulnerability Audit & Threat Mapping of an Enterprise Subnet'
      },
      {
        moduleNumber: 2,
        title: 'Web Application Security & OWASP Top 10',
        duration: 'Weeks 4 - 6',
        description: 'Analyzing and mitigating common web flaws using Burp Suite proxy: SQL Injection, Cross-Site Scripting (XSS), Broken Object Level Authorization, and CSRF.',
        topics: ['Burp Suite Community edition setup', 'SQL injection detection & parameterized mitigation', 'XSS reflected vs stored', 'Authentication bypasses'],
        handsOnProject: 'Authorized Penetration Test Report on Vulnerable Web Application'
      },
      {
        moduleNumber: 3,
        title: 'SOC Operations, Log Analysis & SIEM (Wazuh)',
        duration: 'Weeks 7 - 9',
        description: 'Setting up Wazuh/Splunk SIEM, ingesting syslog and Windows event logs, writing custom detection rules, and handling incident response playbooks.',
        topics: ['SIEM architecture & log agents', 'MITRE ATT&CK framework mapping', 'Detecting brute force & privilege escalation', 'Incident triage & ticketing'],
        handsOnProject: 'SOC Investigation and Root Cause Analysis of a Simulated Ransomware Outbreak'
      },
      {
        moduleNumber: 4,
        title: 'Cloud Security, Compliance & Career Placement',
        duration: 'Weeks 10 - 12',
        description: 'AWS security best practices, IAM policy reviews, ISO 27001 / GDPR compliance essentials, and intensive mock interviews for SOC Analyst roles.',
        topics: ['Cloud security baseline audits', 'Compliance standards & data privacy', 'Technical interview questions & triage challenges', 'Placement interview coordination'],
        handsOnProject: 'Comprehensive Enterprise Security Architecture & Governance Blueprint'
      }
    ],
    plans: {
      explorer: {
        id: 'explorer',
        name: 'Security Fundamentals',
        duration: '1 Month',
        durationMonths: 1,
        weeksTotal: 4,
        fee: 6999,
        feeFormatted: '₹6,999',
        outcome: 'Understand networking security, vulnerability scans, and Linux defense basics.',
        certificateType: 'Certificate in Information Security',
        liveProjectRole: 'Conduct baseline vulnerability scans and assist in firewall policy checks.',
        features: [
          'Networking protocols & packet analysis',
          'Nmap & vulnerability scanners',
          'Linux security hardening',
          '1 Comprehensive security audit project',
          'Certificate of completion'
        ]
      },
      builder: {
        id: 'builder',
        name: 'Web App Pentester & SOC Specialist',
        duration: '2 Months',
        durationMonths: 2,
        weeksTotal: 8,
        fee: 11999,
        feeFormatted: '₹11,999',
        recommended: true,
        outcome: 'Audit web applications with Burp Suite and investigate security alerts on Wazuh SIEM.',
        certificateType: 'SOC Analyst & Ethical Hacking Diploma',
        liveProjectRole: 'Review security logs and perform scheduled penetration assessments.',
        features: [
          'Everything in Security Fundamentals',
          'OWASP Top 10 penetration testing',
          'Burp Suite deep dive',
          'SIEM log analysis & MITRE ATT&CK',
          '2 In-depth lab reports on GitHub',
          'Resume & LinkedIn profile makeover'
        ]
      },
      professional: {
        id: 'professional',
        name: 'Enterprise Cyber Defense & Placement Track',
        duration: '3 Months',
        durationMonths: 3,
        weeksTotal: 12,
        fee: 16999,
        feeFormatted: '₹16,999',
        outcome: 'Full SOC Analyst job readiness, cloud security governance, and direct placement drives.',
        certificateType: 'Experience Letter in Cybersecurity + Placement Support',
        liveProjectRole: 'Act as Junior Security Operations Analyst assisting live client compliance audits.',
        features: [
          'Everything in SOC Specialist',
          'Cloud security audits on AWS',
          'Incident response playbooks & forensic triage',
          '100% Placement assistance & partner drives',
          '1-on-1 interview drills with certified CISSPs',
          'Official VGM Soft Tech Experience Letter'
        ]
      }
    },
    faqs: [
      {
        question: 'Do you teach strictly legal, authorized ethical hacking?',
        answer: 'Yes, 100%. All hacking demonstrations and exercises take place on sandboxed local lab environments and authorized test beds under formal code of ethics.'
      }
    ]
  },
  {
    id: 'uiux-product-design',
    slug: 'uiux-product-design',
    thumbnail: '/assets/courses/uiux-product-design.svg',
    title: 'UI/UX Design, Design Systems & AI Product Prototyping',
    headline: 'Design Delightful, Accessible User Experiences with Figma, Design Systems & AI Tools',
    shortDescription: 'Master user research, wireframing, Figma component libraries, responsive design systems, usability testing, and interactive mobile/web prototypes.',
    fullDescription: 'Transform from a visual novice into an industry-ready UI/UX Product Designer. Learn modern design thinking methodologies, user empathy interviews, information architecture, Figma auto-layouts and variable design tokens, along with leveraging generative AI tools (Midjourney, Relume, Galileo) for accelerated ideation and prototyping.',
    category: 'UI/UX Design',
    badge: 'Creative Tech Track',
    level: 'Beginner',
    duration: '8 Weeks (2 Months)',
    durationWeeks: 8,
    mode: 'Hybrid (Coimbatore Campus + Live Online)',
    rating: 4.94,
    reviewsCount: 152,
    learnersEnrolled: 310,
    liveProjectsCount: 3,
    nextBatch: '28th November 2026',
    startingFee: 5999,
    startingFeeFormatted: '₹5,999',
    status: 'enrolling',
    featured: false,
    tools: ['Figma', 'FigJam', 'Auto-Layout', 'Design Tokens', 'Miro', 'Relume AI', 'Notion', 'Adobe Creative Cloud'],
    careerRoles: ['UI/UX Designer', 'Product Designer', 'Interaction Designer', 'Visual Designer'],
    averagePackage: '₹4.5 LPA',
    highestPackage: '₹10.5 LPA',
    highlights: [
      'Master Figma from basics to advanced nested auto-layouts and interactive component variants',
      'Build 3 complete portfolio case studies published on Behance & Notion',
      'Learn how to collaborate smoothly with frontend React and Flutter engineers',
      'AI-assisted wireframing and user research synthesis'
    ],
    prerequisites: 'Zero coding required! A creative eye and interest in how digital apps and websites work is all you need.',
    targetAudience: [
      'Students and creative individuals seeking a high-paying tech career without writing code',
      'Graphic designers transitioning to digital product and mobile app design',
      'Developers wishing to dramatically improve their user interface aesthetics and UX decisions'
    ],
    curriculum: [
      {
        moduleNumber: 1,
        title: 'Design Thinking, User Research & Information Architecture',
        duration: 'Weeks 1 - 2',
        description: 'Understand user problem framing, user personas, journey mapping, empathy interviews, card sorting, and wireframing in FigJam.',
        topics: ['User interview methodologies', 'Creating actionable user personas', 'Information architecture & sitemaps', 'Low-fidelity wireframing'],
        handsOnProject: 'Discovery & Wireframe Blueprint for a FinTech Micro-Savings Mobile App'
      },
      {
        moduleNumber: 2,
        title: 'Figma Mastery, Auto-Layout & Design Systems',
        duration: 'Weeks 3 - 5',
        description: 'Deep dive into Figma tools: frames, constraints, advanced auto-layout, typography hierarchies, accessible color contrast (WCAG), and component variants with properties.',
        topics: ['Figma auto-layout & responsive grids', 'Color theory & 8pt spatial grid', 'Reusable component libraries & variants', 'Interactive variables & prototyping'],
        handsOnProject: 'Complete Scalable Design System for a Healthcare Patient Booking Platform'
      },
      {
        moduleNumber: 3,
        title: 'Micro-Interactions, Usability Testing & AI Tools',
        duration: 'Weeks 6 - 8',
        description: 'Smart animate transitions, interactive mobile gesture prototypes, conducting remote usability tests, and leveraging AI tools for UI generation and copywriting.',
        topics: ['Smart animate & micro-interactions', 'Conducting usability tests & synthesizing feedback', 'Developer handoff tokens (Figma to CSS)', 'Portfolio presentation & Behance case study'],
        handsOnProject: 'End-to-End Published Behance Case Study with Interactive Prototype'
      }
    ],
    plans: {
      explorer: {
        id: 'explorer',
        name: 'Design Essentials',
        duration: '1 Month',
        durationMonths: 1,
        weeksTotal: 4,
        fee: 5999,
        feeFormatted: '₹5,999',
        outcome: 'Master Figma wireframing, typography, color, and design 1 complete mobile app UI.',
        certificateType: 'Certificate in UI Design',
        liveProjectRole: 'Create UI mockups and icon assets for internal VGM Soft Tech web pages.',
        features: [
          'Figma interface & auto-layout basics',
          'UI typography & color token systems',
          '1 Mobile app UI design project',
          'Design review by senior UI mentor',
          'Certificate of completion'
        ]
      },
      builder: {
        id: 'builder',
        name: 'Product Design & Portfolio Track',
        duration: '2 Months',
        durationMonths: 2,
        weeksTotal: 8,
        fee: 9999,
        feeFormatted: '₹9,999',
        recommended: true,
        outcome: 'Complete 3 case studies, interactive prototypes, design system, and job placement assistance.',
        certificateType: 'Diploma in UI/UX Product Design + Placement Support',
        liveProjectRole: 'Design user flows and interactive prototypes for active client software briefs.',
        features: [
          'Everything in Design Essentials',
          'Advanced Figma design systems & variables',
          'User research & usability testing',
          'Smart animate micro-interactions',
          '3 Industry-ready portfolio case studies on Behance',
          '100% Placement assistance & UI design interview drills'
        ]
      }
    },
    faqs: [
      {
        question: 'Do I need a Mac or high-end graphics computer for this?',
        answer: 'No! Figma runs completely in the modern web browser (Chrome, Edge, Firefox) on standard Windows laptops, MacBooks, or even Chromebooks.'
      }
    ]
  }
];

