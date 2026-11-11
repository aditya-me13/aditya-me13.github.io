/* ============================================================================
 *  PORTFOLIO CONTENT — edit everything here.
 *  Values starting with "PLACEHOLDER" are hidden or shown as "Coming soon"
 *  on the live site until you replace them.
 * ========================================================================== */

export const DEGREE_URL = 'PLACEHOLDER_DEGREE_DRIVE_LINK';
export const TRANSCRIPT_URL = 'PLACEHOLDER_TRANSCRIPT_DRIVE_LINK';
export const RESUME_URL = '/files/Aditya_Mehta_Resume.pdf';

export const CURRENT_ROLE = {
  title: 'PLACEHOLDER_TITLE', // e.g. "Graduate Analyst"
  team: 'PLACEHOLDER_TEAM', // e.g. "Investment Bank · Quantitative Analytics"
  company: 'Barclays',
  location: 'PLACEHOLDER_LOCATION', // e.g. "Pune, India"
  start: 'PLACEHOLDER_START', // e.g. "Jul 2026"
};

/* ------------------------------------------------------------------------ */

export const isPlaceholder = (v?: string) => !v || v.startsWith('PLACEHOLDER');
/** Returns the value, or a fallback while it is still a placeholder. */
export const filled = (v: string, fallback = '') => (isPlaceholder(v) ? fallback : v);

export const PROFILE = {
  name: 'Aditya Mehta',
  initials: 'AM',
  email: 'mehtaaditya1307@gmail.com',
  location: 'India',
  hometown: 'Mandvi, Kutch',
  photo: '/images/profile.jpg',
  tagline: 'Engineering luck.',
  rotating: [
    filled(CURRENT_ROLE.title, 'Working') + ' @ Barclays',
    "CSE @ IIT Gandhinagar '26",
    'Quant · ML · Systems',
    'Turning data into decisions',
  ],
  bio: [
    'I’m a Computer Science & Engineering graduate from IIT Gandhinagar (Class of 2026, CPI 9.41), now working at Barclays.',
    'I like problems that sit where technology meets finance: modelling how markets behave, building tools that help people make decisions faster, and the systems and ML that make them work.',
    'Before Barclays, I built ML pipelines in production, put image processing onto FPGAs, wrote game engines that play perfectly, and led teams of 100+ people to run one of Gujarat’s largest student festivals.',
  ],
};

export const SOCIALS = [
  { id: 'github', label: 'GitHub', handle: 'aditya-me13', url: 'https://github.com/aditya-me13' },
  { id: 'linkedin', label: 'LinkedIn', handle: 'aditya-me13', url: 'https://www.linkedin.com/in/aditya-me13/' },
  { id: 'leetcode', label: 'LeetCode', handle: 'aditya-me13', url: 'https://leetcode.com/u/aditya-me13/' },
  { id: 'instagram', label: 'Instagram', handle: 'adityaa_me13', url: 'https://www.instagram.com/adityaa_me13/' },
  { id: 'telegram', label: 'Telegram', handle: 'AdityaMehta1307', url: 'https://t.me/AdityaMehta1307' },
] as const;

export const TICKER = [
  { k: 'CPI', v: '9.41 / 10', up: true },
  { k: "DEAN'S LIST", v: '×5 semesters', up: true },
  { k: 'FRESHMAN RANK', v: '4 / 288', up: true },
  { k: 'JEE ADV', v: 'AIR 4059' },
  { k: 'IISER IAT', v: 'AIR 468' },
  { k: 'SCHOLARSHIPS', v: '2 × ₹1,00,000', up: true },
  { k: 'GCP', v: 'Associate Cloud Engineer' },
  { k: 'NOW', v: 'Barclays', up: true },
];

/* ------------------------------------------------------------------------ */

export type Experience = {
  id: string;
  company: string;
  companyUrl?: string;
  role: string;
  kind: string;
  location: string;
  period: string;
  current?: boolean;
  summary: string;
  points: string[];
  tags: string[];
  links?: { label: string; url: string }[];
};

export const EXPERIENCE: Experience[] = [
  {
    id: 'barclays',
    company: 'Barclays',
    companyUrl: 'https://www.barclays.in/',
    role: filled(CURRENT_ROLE.title, 'Full-time role'),
    kind: filled(CURRENT_ROLE.team, 'Full-time'),
    location: filled(CURRENT_ROLE.location, 'India'),
    period: `${filled(CURRENT_ROLE.start, '2026')} – Present`,
    current: true,
    summary: 'Currently working at Barclays after graduating from IIT Gandhinagar.',
    points: [],
    tags: ['Finance', 'Python', 'Quant'],
  },
  {
    id: 'barclays-intern',
    company: 'Barclays',
    companyUrl: 'https://www.barclays.in/',
    role: 'Summer Intern, Investment Banking Quants',
    kind: 'FinTech Internship',
    location: 'Noida, India',
    period: 'May 2025 – Jul 2025',
    summary: 'Chosen from 100+ candidates for a quant-focused summer internship with the Investment Bank.',
    points: [
      'Worked on internal tools that help the Investment Banking team make decisions faster and more consistently.',
      'Modelled market behaviour to support trend analysis for the desk.',
    ],
    tags: ['Python', 'Quant', 'Markets', 'Tooling'],
    links: [{ label: 'Selection letter', url: '/files/SummerInternshipBarclays.png' }],
  },
  {
    id: 'kapidhwaj',
    company: 'Kapidhwaj AI',
    companyUrl: 'https://www.kapidhwaj.ai/',
    role: 'AI / ML Development Intern',
    kind: 'Industrial Internship',
    location: 'Research Park, Gandhinagar',
    period: 'May 2024 – Jul 2024',
    summary: 'Built a production face-recognition pipeline for an AI security start-up.',
    points: [
      'Built a scalable, low-latency face recognition pipeline with YOLOv8n detection and ArcFace embeddings.',
      'Integrated the ChromaDB vector database for fast storage and retrieval of embeddings, which sped up end-to-end processing significantly.',
      'Containerised the project into a Docker image and deployed it on Google Cloud virtual machines.',
      'Wrote a FastAPI middleware with multiple endpoints to manage model instances, with SQLAlchemy for the GCP database layer.',
    ],
    tags: ['Python', 'YOLOv8', 'ArcFace', 'ChromaDB', 'FastAPI', 'Docker', 'Google Cloud'],
    links: [
      { label: 'Certificate', url: '/files/CertificateKapidhwaj.png' },
      { label: 'Code', url: 'https://github.com/aditya-me13/Face_Recognition' },
    ],
  },
];

/* ------------------------------------------------------------------------ */

export const PROJECT_CATEGORIES = ['All', 'ML', 'Systems & Hardware', 'Algorithms', 'Signals', 'Scientific'] as const;
export type ProjectCategory = Exclude<(typeof PROJECT_CATEGORIES)[number], 'All'>;

export type Project = {
  id: string;
  title: string;
  short: string;
  category: ProjectCategory;
  period: string;
  advisor?: string;
  points: string[];
  skills: string[];
  team?: string[];
  links?: { label: string; url: string; kind: 'github' | 'video' | 'link' }[];
  featured?: boolean;
};

export const PROJECTS: Project[] = [
  {
    id: 'face-recognition',
    title: 'Real-time Face Recognition Service',
    short: 'Detection, embedding and a vector store, packaged as a containerised API on GCP.',
    category: 'ML',
    period: 'May – Jul 2024',
    advisor: 'Kapidhwaj AI (industry)',
    points: [
      'An end-to-end pipeline: YOLOv8n for detection, ArcFace for embeddings, and ChromaDB for similarity search.',
      'A FastAPI middleware that manages model instances, backed by SQLAlchemy, Dockerised and deployed on Google Cloud VMs.',
    ],
    skills: ['Python', 'FastAPI', 'Docker', 'Google Cloud', 'ChromaDB', 'SQLAlchemy'],
    links: [{ label: 'GitHub', url: 'https://github.com/aditya-me13/Face_Recognition', kind: 'github' }],
    featured: true,
  },
  {
    id: 'har',
    title: 'Human Activity Recognition',
    short: 'Classifying six human activities from raw accelerometer time-series.',
    category: 'ML',
    period: 'Jan – Apr 2024',
    advisor: 'Prof. Nipun Batra',
    points: [
      'Used the UCI-HAR dataset: time-series from 30 subjects performing 6 activities (walking, sitting, standing, walking upstairs, walking downstairs, lying).',
      'Extracted features with TSFEL, reduced their dimensionality with PCA, and trained and tuned a Decision Tree classifier.',
      'Collected real-world test data with the Physics Toolbox Suite app to check how well the model generalises.',
    ],
    skills: ['Python', 'Scikit-Learn', 'Pandas', 'TSFEL', 'NumPy'],
    team: ['Aadya Arora', 'Guntas Singh Saran', 'Hrriday V. Ruparel', 'Jiya Desai', 'Mumuksh Jain', 'Siya Patil'],
    links: [{ label: 'GitHub', url: 'https://github.com/ES335-2024/assignment-1-ml-tensionflow', kind: 'github' }],
    featured: true,
  },
  {
    id: 'text-gen',
    title: 'Next-Character Text Generator',
    short: 'An MLP language model that writes in the style of the book it was trained on.',
    category: 'ML',
    period: 'Jan – Apr 2024',
    advisor: 'Prof. Nipun Batra',
    points: [
      'Built a pipeline that predicts the next character from the preceding k characters using learned embeddings and an MLP.',
      'Trained models on corpora including Gulliver’s Travels, enwik8, Atomic Habits, Tolstoy’s essays and Alice in Wonderland, and compared different embedding sizes.',
    ],
    skills: ['Python', 'NumPy'],
    team: ['Aadya Arora', 'Guntas Singh Saran', 'Hrriday V. Ruparel', 'Jiya Desai', 'Mumuksh Jain', 'Siya Patil'],
    links: [{ label: 'GitHub', url: 'https://github.com/aditya-me13', kind: 'github' }],
  },
  {
    id: 'ipt-fpga',
    title: 'Image Processing Toolbox on FPGA',
    short: 'Image convolution filters implemented in hardware, fed over UART.',
    category: 'Systems & Hardware',
    period: 'Jan – Apr 2024',
    advisor: 'Prof. Joycee Mekie',
    points: [
      'Set up UART communication between a host machine and an FPGA to send binary image data to and from BRAMs.',
      'Implemented smoothing, sharpening and Gaussian convolution filters in Verilog, with a pipeline tuned for the speed-versus-area trade-off.',
    ],
    skills: ['Verilog', 'Xilinx Vivado', 'Python'],
    team: ['Abhinav Goud', 'Hrriday V. Ruparel', 'Sujal Patel'],
    links: [{ label: 'GitHub', url: 'https://github.com/aditya-me13/Image-Processing-Toolkit--IPT1', kind: 'github' }],
    featured: true,
  },
  {
    id: 'game-engine',
    title: 'Smart Game Engine',
    short: 'Game-playing agents that play optimally, plus a 2×2×2 Rubik’s Cube solver.',
    category: 'Algorithms',
    period: 'Aug – Nov 2024',
    advisor: 'Prof. Balagopal Komarath',
    points: [
      'Used graph search and game-tree algorithms to build agents that play optimally in Connect4, Sudoku, Tic-Tac-Toe and UpItUp.',
      'Designed a solver that finds the shortest solution for any 2×2×2 Rubik’s Cube scramble.',
    ],
    skills: ['C', 'C++'],
    team: ['Jiya Desai', 'Sujal Patel'],
    links: [{ label: 'GitHub', url: 'https://github.com/aditya-me13', kind: 'github' }],
    featured: true,
  },
  {
    id: 'smart-bicycle',
    title: 'Smart Bicycle Safety Monitor',
    short: 'Sensor fusion and fuzzy logic that keep parents informed about young riders.',
    category: 'Signals',
    period: 'Aug 2023 – Apr 2024',
    advisor: 'Prof. Nithin V. George',
    points: [
      'Built an Android app with MATLAB that monitors a child cyclist in real time using the gyroscope, accelerometer, GPS and microphone.',
      'Used fuzzy control logic to detect over-speeding, falls and boundary crossings.',
      'On a fall, the app starts recording audio and video and sends an SOS with the recordings and the GPS location to the parent’s device.',
    ],
    skills: ['MATLAB', 'Signal Processing'],
    team: ['Abhinav Goud', 'Akshat Barnwal', 'Jiya Desai', 'Nishi Shah'],
    links: [
      { label: 'Demo 1', url: 'https://www.youtube.com/watch?v=wltbPszcKK8', kind: 'video' },
      { label: 'Demo 2', url: 'https://www.youtube.com/watch?v=qEZNYEAVPpE', kind: 'video' },
      { label: 'GitHub', url: 'https://github.com/aditya-me13/SSRP-CS-IITGN/tree/main', kind: 'github' },
    ],
  },
  {
    id: 'second-order',
    title: 'Second-Order System Analyser',
    short: 'An interactive MATLAB app for exploring second-order system responses.',
    category: 'Signals',
    period: 'Jan – Apr 2024',
    advisor: 'Prof. Nithin V. George',
    points: [
      'An interactive MATLAB app that visualises how damping ratio and natural frequency shape a second-order system’s response.',
      'Plots step and frequency responses alongside key time-domain metrics, as a learning aid for signals and systems.',
    ],
    skills: ['MATLAB', 'Signal Processing'],
    team: ['Abhinav Goud', 'Akshat Barnwal'],
    links: [
      { label: 'Demo', url: 'https://youtu.be/fA2nxhroGQ0', kind: 'video' },
      { label: 'GitHub', url: 'https://github.com/aditya-me13/SSRP-CS-IITGN/tree/main/3.%20Second%20Order%20Systems', kind: 'github' },
    ],
  },
  {
    id: 'ml-basics',
    title: 'Eigenfaces & Classical ML',
    short: 'Face recognition with eigenfaces, dimensionality reduction and a data narrative.',
    category: 'ML',
    period: 'Jan – Apr 2023',
    advisor: 'Prof. Shanmuganathan Raman',
    points: [
      'Built a real-time face recognition system using eigenfaces and evaluated it on several scikit-learn datasets.',
      'Explored dimensionality reduction and object classification with a range of classical ML models.',
      'Wrote a hypothesis-driven data narrative using Pandas, Seaborn and Matplotlib.',
    ],
    skills: ['Python', 'Scikit-Learn', 'Pandas', 'Seaborn', 'Matplotlib', 'NumPy'],
  },
  {
    id: 'mangalyaan',
    title: 'Mangalyaan Propellant Analysis',
    short: 'Numerical methods to estimate the fuel ISRO’s Mars Orbiter used to leave Earth orbit.',
    category: 'Scientific',
    period: 'Aug – Oct 2022',
    advisor: 'Prof. Dilip Srinivas Sundaram & Prof. Akshaa Vatwani',
    points: [
      'Estimated the propellant mass used during Mangalyaan’s first five Earth-bound orbit-raising manoeuvres.',
      'Discretised the energy equations and solved them iteratively with Euler and Runge–Kutta methods, and studied the Oberth effect.',
    ],
    skills: ['Python', 'NumPy', 'SciPy'],
    team: ['Aadya Arora', 'Anmol Bhargava', 'Rhuju Trambadia', 'Siya Patil'],
  },
  {
    id: 'rover',
    title: 'Terrain-Mapping Rover',
    short: 'An autonomous rover that finds its own path and senses magnetic fields.',
    category: 'Systems & Hardware',
    period: 'Jan – Apr 2023',
    advisor: 'Prof. Arup Lal Chakraborty',
    points: [
      'Built a vehicle that drives across flat terrain on its own, detecting obstacles and choosing the next clear path.',
      'Combined ultrasonic and Hall-effect sensors to detect magnetic material across open ground.',
    ],
    skills: ['Arduino', 'C++'],
    team: ['Aditya Mangla'],
  },
  {
    id: 'epcot',
    title: 'EPCOT: Peltier Cooling Tent',
    short: 'A collapsible tent that regulates temperature and humidity for people at risk of heat stroke.',
    category: 'Systems & Hardware',
    period: 'May – Jul 2023',
    advisor: 'Prof. Udit Bhatia',
    points: [
      'Engineered a sensor-driven, collapsible tent that regulates temperature and humidity for people at risk of heat stroke.',
      'Combined Peltier-module cooling with evaporative cooling to balance efficiency and sustainability.',
    ],
    skills: ['Arduino', 'Autodesk Inventor'],
  },
];

/* ------------------------------------------------------------------------ */

export const SKILLS: { group: string; items: string[] }[] = [
  { group: 'Languages', items: ['Python', 'C', 'C++', 'Verilog', 'MATLAB', 'Rust (basics)'] },
  { group: 'ML & Data', items: ['NumPy', 'Pandas', 'Scikit-Learn', 'TensorFlow', 'SciPy', 'Matplotlib', 'Seaborn', 'TSFEL', 'Signal Processing'] },
  { group: 'Backend & Cloud', items: ['FastAPI', 'Docker', 'Google Cloud', 'SQLAlchemy', 'ChromaDB', 'Git', 'Linux'] },
  { group: 'Hardware & Design', items: ['Xilinx Vivado', 'Arduino', 'Autodesk Inventor', 'Adobe Creative Suite', 'LaTeX'] },
];

/* ------------------------------------------------------------------------ */

export const EDUCATION = [
  {
    id: 'iitgn',
    school: 'Indian Institute of Technology Gandhinagar',
    degree: 'B.Tech, Computer Science & Engineering',
    period: '2022 – 2026',
    score: 9.41,
    scoreLabel: 'CPI / 10',
    note: 'Moved from Electrical Engineering to CSE after first year as the first eligible branch-change candidate. Ranked 4th of 288 in the batch.',
    primary: true,
  },
  {
    id: 'xii',
    school: 'St. Xavier’s High School, Adipur',
    degree: 'Class XII (GSHSEB): Physics, Chemistry, Maths',
    period: '2020 – 2022',
    score: 94.25,
    scoreLabel: '%',
  },
  {
    id: 'x',
    school: 'Archana St. Xavier’s School, Mandvi',
    degree: 'Class X (GSEB)',
    period: '2019 – 2020',
    score: 94.66,
    scoreLabel: '%',
  },
];

export const COURSES = [
  { name: 'Data Structures & Algorithms', grade: 'A' },
  { name: 'Machine Learning', grade: 'A' },
  { name: 'Calculus & Linear Algebra', grade: 'A' },
  { name: 'Probability & Statistics', grade: 'A-' },
  { name: 'Data Centric Computing', grade: 'A-' },
  { name: 'Digital Electronics', grade: 'A-' },
  { name: 'Basic Electrical Engineering', grade: 'A' },
  { name: 'Engineering Basics', grade: 'A' },
  { name: 'Advanced DSA', grade: 'B' },
];

/* ------------------------------------------------------------------------ */

export type Role = { title: string; org: string; period: string; points: string[]; link?: string };

export const LEADERSHIP: { group: string; roles: Role[] }[] = [
  {
    group: 'Academic',
    roles: [
      {
        title: 'Undergraduate Teaching Assistant',
        org: 'Machine Learning course',
        period: 'Aug 2025 – 2026',
        points: [
          'Supported a cohort of 150+ students through regression, classification, clustering and neural networks.',
          'Ran doubt-clearing sessions, reviewed assignments and helped with grading.',
          'Acted as the link between the professor and students, passing on queries and feedback to improve the course.',
        ],
      },
      {
        title: 'Branch Representative',
        org: 'Student Placement Cell',
        period: 'Apr 2025 – 2026',
        points: [
          'Represented the CSE department as the liaison between students and Career Development Services.',
          'Helped align industry expectations with student preparation, and brought in faculty where needed.',
        ],
      },
    ],
  },
  {
    group: 'Organisational',
    roles: [
      {
        title: 'Core Committee Member',
        org: 'Blithchron, IITGN Cultural Fest',
        period: 'May 2023 – Apr 2024',
        points: [
          'Led a team of 100+ UG and PG students to run Gujarat’s largest student-run cultural festival.',
          'Managed budgets, vendors and coordination with the institute administration from start to finish.',
          'Taught myself Adobe Illustrator, Photoshop, Premiere Pro and After Effects to produce the festival’s promotional content, which significantly increased engagement.',
        ],
        link: 'https://www.instagram.com/blithchron_iitgn/',
      },
      {
        title: 'Student Guide Coordinator',
        org: 'Student Support Services',
        period: 'Apr 2025 – 2026',
        points: [
          'Coordinated 35+ student guides and mentors for the incoming batch, including allocation and training.',
          'Introduced a structured feedback system so the programme could spot and address student needs early.',
          'Before this, served two terms as a Student Guide (2023–25), mentoring first-year students.',
        ],
      },
    ],
  },
  {
    group: 'Community',
    roles: [
      {
        title: 'Class Representative',
        org: 'Computer Science & Engineering',
        period: 'Aug 2024 – Apr 2025',
        points: [
          'Elected to represent a 70-student cohort.',
          'Raised the class’s academic concerns and feedback with faculty.',
        ],
      },
      {
        title: 'General Executive',
        org: 'Professional Development Council',
        period: 'May 2024 – Mar 2025',
        points: [
          'Helped organise workshops on résumé building, interview preparation and mock tests.',
          'Acted as the bridge between the student body and the placement cell.',
        ],
      },
      {
        title: 'General Executive',
        org: 'TEDx IITGandhinagar',
        period: 'Aug 2023 – Mar 2024',
        points: ['Ran the event’s online presence and social media, and helped curate its content.'],
      },
    ],
  },
];

/* ------------------------------------------------------------------------ */

export type Achievement = { title: string; detail: string; kind: 'academic' | 'rank' | 'scholarship' | 'cert' | 'misc'; url?: string };

export const ACHIEVEMENTS: Achievement[] = [
  { title: 'Dean’s List × 5', detail: 'Academic excellence in every eligible semester at IIT Gandhinagar.', kind: 'academic', url: 'https://www.iitgn.ac.in/students/deanslist' },
  { title: 'Amalthea Scholarship', detail: '₹1,00,000 for academic performance and potential, AY 2024–25.', kind: 'scholarship', url: 'https://iitgn.ac.in/students/scholarships/Amalthea' },
  { title: 'Acharya Ekkirala Bharadwaja Scholarship', detail: '₹1,00,000 for academic performance and potential, AY 2023–24.', kind: 'scholarship', url: 'https://iitgn.ac.in/students/scholarships/Acharya-Ekkirala-Bharadwaja-Scholarship' },
  { title: '4th of 288', detail: 'Rank across all branches at the end of freshman year, which earned the first branch change to CSE.', kind: 'rank' },
  { title: 'JEE Advanced AIR 4059', detail: 'Joint Entrance Examination (Advanced).', kind: 'rank' },
  { title: 'IISER IAT AIR 468', detail: 'Research-track admission test for the IISERs.', kind: 'rank' },
  { title: 'ACPC State Rank 49', detail: 'Gujarat engineering admissions, AY 2021–22.', kind: 'rank' },
  { title: 'Google Cloud Associate Engineer', detail: 'Associate Cloud Engineer course certification (Udemy).', kind: 'cert', url: 'https://www.udemy.com/certificate/UC-b5a53396-ff92-4d48-aa8f-d44e43540f34/' },
  { title: 'Complete Investment Banking', detail: 'Investment banking fundamentals course certification (Udemy).', kind: 'cert', url: 'https://www.udemy.com/certificate/UC-94b35d82-3f17-493b-b512-65497ff0d7ea/' },
  { title: 'Lawn Tennis Masters Cup ’25', detail: 'Captained “Wimbledon Wizards” to runner-up.', kind: 'misc' },
  { title: 'Intro to LaTeX: Winner', detail: 'Contest run by the Student Academic Council.', kind: 'misc' },
];

/* ------------------------------------------------------------------------ */

export const BEYOND = [
  { emoji: '🎾', title: 'Tennis & cricket', text: 'I captain on the tennis court and follow cricket the way most Indians do: religiously.' },
  { emoji: '🎬', title: 'Video & design', text: 'Editing and graphic design are how I express myself creatively. I taught myself the Adobe suite for a festival and kept using it.' },
  { emoji: '💃', title: 'Garba & Bollywood', text: 'I’m Gujarati, so garba comes naturally. Shout “Pani” and I’ll finish the line.' },
  { emoji: '📚', title: 'Stories', text: 'The Wizarding World, the MCU, FRIENDS, and above all Taarak Mehta Ka Ooltah Chashmah.' },
  { emoji: '✍️', title: 'Poetry', text: 'Hindi and Urdu shayari, Gujarati folk lyrics, and a good English quote.' },
  { emoji: '🍨', title: 'Ice cream', text: 'I have a serious sweet tooth, and ice cream wins every time.' },
];

export const QUOTE = 'There is no treasure worth as much as the good that can be done with it.';

export const SECTIONS = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'education', label: 'Education' },
  { id: 'leadership', label: 'Leadership' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'contact', label: 'Contact' },
] as const;
