export interface AssessmentQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

/**
 * 5 short pre-assessment multiple-choice questions on basic programming concepts.
 * These can be easily edited or extended here.
 * The score is recorded for mentors/admin and does NOT block enrolment.
 */
export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 1,
    question: "Which data structure follows the First-In, First-Out (FIFO) principle?",
    options: ["Stack", "Queue", "Binary Tree", "Hash Map"],
    correctIndex: 1,
    explanation: "Queues process items in the order they were inserted (FIFO), like a real-world checkout queue."
  },
  {
    id: 2,
    question: "What is the primary role of a REST API in mobile application development?",
    options: [
      "To compile the source code into native machine code",
      "To allow the mobile app to securely exchange data with a backend server",
      "To style the user interface components with CSS",
      "To increase physical device battery life"
    ],
    correctIndex: 1,
    explanation: "REST APIs provide standard HTTP endpoints to fetch and save app data between mobile client and backend."
  },
  {
    id: 3,
    question: "In modern reactive mobile development (Flutter / React Native), what does 'State' represent?",
    options: [
      "The physical country where the user is downloading the app",
      "The database schema of SQLite",
      "The current data that determines how the UI is displayed at any given moment",
      "The operating system version of the user's phone"
    ],
    correctIndex: 2,
    explanation: "State represents the reactive data (like logged in user, cart count) that directly drives what the screen shows."
  },
  {
    id: 4,
    question: "Why do professional software teams use Git and GitHub branches?",
    options: [
      "To track code history, isolate feature development, and collaborate safely via pull requests",
      "To automatically design Figma mockups",
      "To compress JPEG images before deployment",
      "To replace the need for writing unit tests"
    ],
    correctIndex: 0,
    explanation: "Git allows developers to work concurrently on separate branches without breaking main production code."
  },
  {
    id: 5,
    question: "What does the code `[2, 4, 6].map(n => n * 2)` return in JavaScript / Dart?",
    options: [
      "[2, 4, 6]",
      "[4, 8, 12]",
      "24",
      "[4, 4, 4]"
    ],
    correctIndex: 1,
    explanation: "Array mapping transforms each element by the callback function, doubling each number to [4, 8, 12]."
  }
];
