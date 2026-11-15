/* ============================================================================
 *  PORTFOLIO CONTENT — edit everything here.
 *  Values starting with "PLACEHOLDER" are hidden or shown as "Coming soon"
 *  on the live site until you replace them.
 * ========================================================================== */

export const DEGREE_URL = 'PLACEHOLDER_DEGREE_DRIVE_LINK';
export const TRANSCRIPT_URL = 'PLACEHOLDER_TRANSCRIPT_DRIVE_LINK';
export const RESUME_URL = '/files/AdityaMehta_CV.pdf';
export const DEANS_LIST_URL = 'https://drive.google.com/drive/folders/17-1SCsglCVlbl9B7GrnxgjiIo7sb591L?usp=sharing';
export const SCHOLARSHIP_LETTERS_URL = 'https://drive.google.com/drive/folders/1hhemd0I2nJOmaeXTutOrTEVRQFr2ajG0?usp=sharing';

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
    'I’m a Computer Science & Engineering graduate from IIT Gandhinagar (Class of 2026, CPI 9.41) with dual minors in AI and Management. I now work at Barclays, which I joined on a Pre-Placement Offer after my 2025 internship there.',
    'I like problems where technology meets finance: LLM tooling that helps investment bankers decide faster, modelling how markets behave, and the ML systems underneath both.',
    'Before Barclays, I built a face-recognition service at Kapidhwaj AI, trained a vision transformer to sharpen weather forecasts, and led a team of 100+ people at Blithchron, one of Gujarat’s largest student festivals.',
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
  { k: 'NOW', v: 'Barclays', up: true },
  { k: 'BARCLAYS', v: 'Pre-Placement Offer', up: true },
  { k: "DEAN'S LIST", v: '6 of 7 semesters', up: true },
  { k: 'FRESHMAN RANK', v: '4 / 288', up: true },
  { k: 'SCHOLARSHIPS', v: '3 of 3 years', up: true },
  { k: 'INTER-IIT', v: 'Tech · Cultural · Sports' },
  { k: 'MINORS', v: 'AI · Management' },
  { k: 'JEE ADV', v: 'AIR 4059' },
  { k: 'GCP', v: 'Associate Cloud Engineer' },
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
    summary: 'Joined full-time after graduating, on a Pre-Placement Offer earned during my 2025 internship.',
    points: [],
    tags: ['Investment Banking', 'Python', 'AI'],
  },
  {
    id: 'barclays-intern',
    company: 'Barclays',
    companyUrl: 'https://www.barclays.in/',
    role: 'IB Quants Analyst Intern',
    kind: 'Industrial Internship',
    location: 'Noida, India',
    period: 'May 2025 – Jul 2025',
    summary: 'Built LLM tooling for the Investment Bank. My work earned a Pre-Placement Offer.',
    points: [
      'Engineered a corpus sentiment-analysis pipeline using several large language models, giving investment bankers fast, actionable insights for day-to-day (BAU) decisions.',
      'Developed an AI-Validator pipeline that uses retrieval-augmented generation (RAG) to cross-check AI-generated documents and reduce operational risk on live production projects.',
      'Contributed to live industry workflows, streamlining analysis and reducing risk through integrated AI solutions.',
      'Received a Pre-Placement Offer (PPO) for performance during the internship.',
    ],
    tags: ['Python', 'LLMs', 'RAG', 'NLP', 'Investment Banking'],
    links: [{ label: 'Selection letter', url: '/files/SummerInternshipBarclays.png' }],
  },
  {
    id: 'kapidhwaj',
    company: 'Kapidhwaj AI',
    companyUrl: 'https://www.kapidhwaj.ai/',
    role: 'AI / ML Development Intern',
    kind: 'Industrial Internship',
    location: 'IITGN Research Park',
    period: 'May 2024 – Jul 2024',
    summary: 'Built a production face-recognition pipeline for a vision-security start-up.',
    points: [
      'Built a scalable face recognition pipeline in Python with high accuracy and low latency for real-time inference, using YOLOv8n detection, ArcFace embeddings and a ChromaDB vector store.',
      'Containerised the full system as a Docker image and deployed it on Google Cloud virtual machines.',
      'Developed a middleware API with FastAPI and SQLAlchemy to manage model instances and database operations.',
      'Contributed to a vision-security framework that is currently going through the patent process.',
    ],
    tags: ['Python', 'YOLOv8', 'ArcFace', 'ChromaDB', 'FastAPI', 'Docker', 'Google Cloud'],
    links: [
      { label: 'Certificate', url: '/files/CertificateKapidhwaj.png' },
      { label: 'Code', url: 'https://github.com/aditya-me13/Face_Recognition' },
    ],
  },
];

/* ------------------------------------------------------------------------ */

export const PROJECT_CATEGORIES = ['All', 'ML', 'Software & Security', 'Systems & Hardware', 'Algorithms', 'Signals', 'Scientific'] as const;
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
    id: 'weather-emulator',
    title: 'Weather Forecast Emulator',
    short: 'A vision transformer that downscales coarse weather data from 27 km to 9 km, served as a web app.',
    category: 'ML',
    period: 'Aug – Nov 2025',
    advisor: 'Prof. Nipun Batra',
    points: [
      'Built an ML system that downscales coarse weather data from 27 km to 9 km resolution for more accurate local forecasts.',
      'Designed a ~33M-parameter Vision Transformer with region-aware encoding, integrated into a full-stack data pipeline.',
      'Reached an RMSE of 1.96 K, an MAE of 1.49 K and an R² of 0.983, and deployed an interactive web app on HuggingFace Spaces to explore results by region.',
      'Runner-up project at IITGN’s Undergraduate Research Showcase, Semester I, AY 2025–26.',
    ],
    skills: ['Python', 'Vision Transformers', 'HuggingFace Spaces'],
    links: [
      { label: 'Web app', url: 'https://huggingface.co/spaces/aditya-me13/cams-pollution-dashboard', kind: 'link' },
      { label: 'Poster', url: 'https://drive.google.com/file/d/1MUbKkyu9SqKyDagGQZ4yUS-RX5-vOI-A/view?usp=sharing', kind: 'link' },
    ],
    featured: true,
  },
  {
    id: 'privacy-images',
    title: 'Privacy-Preserving Image Sharing',
    short: 'Masks faces in shared images, with encrypted, authorised recovery of the original regions.',
    category: 'Software & Security',
    period: 'Aug – Nov 2025',
    advisor: 'Prof. Abhishek Bichhawat',
    points: [
      'Built a system that hides identities in shared images while letting authorised users recover the masked face regions, with an analysis of usability, security and real-world deployability.',
      'Combined pixelation with AES-256-GCM encryption using an envelope (DEK–KEK) key scheme, and embedded compact binary metadata for fast parsing and scalable handling.',
      'Cut metadata overhead by about 33% and enabled selective decryption with file sizes close to the original image.',
    ],
    skills: ['Python', 'Cryptography'],
    links: [{ label: 'Poster', url: 'https://drive.google.com/file/d/1arIpUa7fBrp4--2ZQegkinYJmeBQqe3E/view?usp=sharing', kind: 'link' }],
    featured: true,
  },
  {
    id: 'alpha-coders',
    title: 'Alpha Coders',
    short: 'An online coding-assessment platform with sandboxed code execution and real-time evaluation.',
    category: 'Software & Security',
    period: 'Jan – Apr 2025',
    advisor: 'Prof. Sameer Kulkarni',
    points: [
      'Built a full-stack MERN platform where assessors create and manage coding tests and candidates take timed programming assessments with real-time evaluation and automated result analysis.',
      'Engineered a secure execution environment for Python and C++ using Docker containers and sandbox isolation.',
      'Implemented role-based access control with session tokens for invitation-only assessments.',
    ],
    skills: ['JavaScript', 'React', 'Node.js', 'Express', 'MongoDB', 'Docker'],
    links: [{ label: 'GitHub', url: 'https://github.com/SujalAVMP/Alpha-Coders', kind: 'github' }],
    featured: true,
  },
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
    short: 'Pipelined image convolution in hardware, with data streamed over UART.',
    category: 'Systems & Hardware',
    period: 'Jan – Apr 2023',
    advisor: 'Prof. Joycee Mekie',
    points: [
      'Established UART communication between the FPGA and a host for reliable serial transfer of binary data to and from BRAMs.',
      'Integrated Python-based I/O handling with Xilinx Vivado for end-to-end hardware deployment.',
      'Applied convolution filters (smoothing, sharpening, Gaussian) in a pipelined architecture for efficient on-chip image processing.',
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
  { group: 'Languages', items: ['Python', 'C', 'C++', 'JavaScript', 'Verilog', 'MATLAB'] },
  { group: 'ML & AI', items: ['Vision Transformers', 'LLMs & RAG', 'Scikit-Learn', 'TensorFlow', 'NumPy', 'Pandas', 'SciPy', 'Matplotlib', 'Seaborn', 'TSFEL', 'Signal Processing'] },
  { group: 'Web, Backend & Cloud', items: ['React', 'Node.js', 'Express', 'MongoDB', 'FastAPI', 'SQLAlchemy', 'ChromaDB', 'Docker', 'Google Cloud', 'HuggingFace Spaces', 'Git', 'Linux'] },
  { group: 'Security, Hardware & Design', items: ['Cryptography', 'Xilinx Vivado', 'Arduino', 'Autodesk Inventor', 'Adobe Creative Suite', 'LaTeX'] },
];

/* ------------------------------------------------------------------------ */

export const EDUCATION = [
  {
    id: 'iitgn',
    school: 'Indian Institute of Technology Gandhinagar',
    degree: 'B.Tech, Computer Science & Engineering · Dual Minors in AI and Management',
    period: '2022 – 2026',
    score: 9.41,
    scoreLabel: 'CPI / 10',
    note: 'Moved from Electrical Engineering to CSE after ranking 4th of 288 in freshman year and 1st among all branch-change applicants. Completed 202 credits across eight semesters, including the two minors.',
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
        period: 'Aug 2025 – Nov 2025',
        points: [
          'Guided 150+ students through core ML topics: regression, classification, clustering and neural networks.',
          'Ran doubt-solving sessions and tutorials, and evaluated assignments and exams to improve how the course was delivered.',
        ],
      },
      {
        title: 'ADH Mentor',
        org: 'Design Innovation and Prototyping course',
        period: 'Aug 2024 – Nov 2024',
        points: ['Mentored 4 project groups (50+ students) on the design, ideation and execution of their course prototypes.'],
      },
      {
        title: 'Branch Representative, CSE',
        org: 'Career Development Services',
        period: 'Apr 2025 – Mar 2026',
        points: [
          'Represented the CSE department at the placement cell as the liaison between CS students and the Career Development Services team.',
          'Worked to align industry expectations with student preparation, addressing concerns and involving CSE faculty where needed.',
        ],
      },
    ],
  },
  {
    group: 'Organisational',
    roles: [
      {
        title: 'Design Core',
        org: 'Blithchron ’24, IITGN Cultural Fest',
        period: 'May 2023 – Apr 2024',
        points: [
          'Led a team of 100+ UG and PG students to organise Gujarat’s largest student-run cultural festival.',
          'Managed the festival budget, coordinated with vendors and the administration, and oversaw planning and execution at scale.',
          'Taught myself the Adobe Creative Suite to produce the festival’s social media content and grow its digital engagement.',
        ],
        link: 'https://www.instagram.com/blithchron_iitgn',
      },
      {
        title: 'Student Guide Coordinator',
        org: 'Student Support Services',
        period: 'Apr 2025 – Apr 2026',
        points: [
          'Coordinated 35+ student mentors, overseeing onboarding, transition and support for the incoming batch.',
          'Introduced feedback-driven improvements to make the mentorship programme more effective.',
        ],
      },
      {
        title: 'Student Guide',
        org: 'Student Support Services',
        period: '2023 – 2026',
        points: ['Mentored first-year students on academics, settling into campus and well-being, for three consecutive years.'],
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
          'Elected to represent the 70-student CSE branch as the main link between students and faculty on academic issues and course logistics.',
          'Organised the Teacher’s Day celebration and the branch farewell, handling logistics and budget.',
        ],
      },
      {
        title: 'Core Team Member',
        org: 'Annuity Club (finance)',
        period: 'Aug 2025 – Apr 2026',
        points: [
          'Helped plan club workshops and competitions on quantitative and personal finance.',
          'Took part in a pan-IIT competition by Zelta Automations, building trading alphas optimised for risk and reward.',
        ],
      },
      {
        title: 'General Executive',
        org: 'Professional Development Council',
        period: 'May 2024 – Mar 2025',
        points: ['Organised workshops on résumé building, interview preparation and assessments.'],
      },
      {
        title: 'Design Executive',
        org: 'TEDx IIT Gandhinagar',
        period: 'Aug 2023 – Mar 2024',
        points: ['Curated digital content and supported the event across its online platforms.'],
      },
      {
        title: 'Member',
        org: 'StepUp Dance Club',
        period: 'Aug 2024 – Mar 2026',
        points: ['Ran a garba workshop in 2024 and performed in 6+ dance shows, including at the Inter-IIT Cultural Meet 8.0 at IIT Kanpur.'],
      },
    ],
  },
];

/* ------------------------------------------------------------------------ */

export type Achievement = { title: string; detail: string; kind: 'academic' | 'rank' | 'scholarship' | 'cert' | 'misc'; url?: string };

export const ACHIEVEMENTS: Achievement[] = [
  { title: 'Dean’s List × 6', detail: 'Dean’s List or Academic Citation in 6 of 7 eligible semesters at IIT Gandhinagar.', kind: 'academic', url: 'https://drive.google.com/drive/folders/17-1SCsglCVlbl9B7GrnxgjiIo7sb591L?usp=sharing' },
  { title: 'Institute Donor Scholarships', detail: 'Awarded in all 3 eligible years: Acharya Ekkirala Bharadwaja (2023–24), Amalthea (2024–25) and the Institute Donor Scholarship (2025–26).', kind: 'scholarship', url: 'https://drive.google.com/drive/folders/1hhemd0I2nJOmaeXTutOrTEVRQFr2ajG0?usp=sharing' },
  { title: 'Research Showcase Runner-up', detail: 'Weather Forecast Emulator, Undergraduate Research Showcase, Semester I, AY 2025–26.', kind: 'academic' },
  { title: '4th of 288', detail: 'Freshman-year rank across all branches, and 1st among all branch-change applicants.', kind: 'rank' },
  { title: 'Inter-IIT Representation', detail: 'Tech Meet 14.0 at IIT Patna (Pathway problem statement), Cultural Meet 8.0 at IIT Kanpur (StepUp), and the lawn tennis probables for Sports Meet 58.0.', kind: 'misc' },
  { title: 'Lawn Tennis', detail: 'Winner, Masters Cup 3.0 (2026). Runner-up captain, Masters Cup 2.0 (2025). 2nd runner-up, General Championship 2025 and 2026.', kind: 'misc' },
  { title: 'DA-IICT Concours ’25', detail: 'Represented IIT Gandhinagar at the 16th inter-college sports fest.', kind: 'misc' },
  { title: 'JEE Advanced AIR 4059', detail: 'Joint Entrance Examination (Advanced).', kind: 'rank' },
  { title: 'IISER IAT AIR 468', detail: 'Research-track admission test for the IISERs.', kind: 'rank' },
  { title: 'ACPC State Rank 49', detail: 'Gujarat engineering admissions, AY 2021–22.', kind: 'rank' },
  { title: 'Google Cloud Associate Engineer', detail: 'Hands-on cloud infrastructure and deployments.', kind: 'cert', url: 'https://www.udemy.com/certificate/UC-b5a53396-ff92-4d48-aa8f-d44e43540f34/' },
  { title: 'Investment Banking Fundamentals', detail: 'Valuation, financial modelling and core banking workflows.', kind: 'cert', url: 'https://www.udemy.com/certificate/UC-94b35d82-3f17-493b-b512-65497ff0d7ea/' },
];

/* ------------------------------------------------------------------------ */

export const BEYOND: { icon: 'tennis' | 'video' | 'music' | 'book' | 'pen' | 'icecream'; title: string; text: string }[] = [
  { icon: 'tennis', title: 'Tennis & cricket', text: 'I won the IITGN Lawn Tennis Masters Cup in 2026 and made the Inter-IIT probables. I follow cricket the way most Indians do: religiously.' },
  { icon: 'video', title: 'Video & design', text: 'Editing and graphic design are how I express myself creatively. I taught myself the Adobe suite for a festival and kept using it.' },
  { icon: 'music', title: 'Garba & dance', text: 'I’m Gujarati, so garba comes naturally. I ran a garba workshop on campus and danced with StepUp at the Inter-IIT Cultural Meet.' },
  { icon: 'book', title: 'Stories', text: 'The Wizarding World, the MCU, FRIENDS, and above all Taarak Mehta Ka Ooltah Chashmah.' },
  { icon: 'pen', title: 'Poetry', text: 'Hindi and Urdu shayari, Gujarati folk lyrics, and a good English quote.' },
  { icon: 'icecream', title: 'Ice cream', text: 'I have a serious sweet tooth, and ice cream wins every time.' },
];

export const QUOTE = 'There is no treasure worth as much as the good that can be done with it.';

export const SECTIONS = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'education', label: 'Education' },
  { id: 'leadership', label: 'Leadership' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'contact', label: 'Contact' },
] as const;
