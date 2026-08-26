export const DEFAULT_RESUME_DATA = {
  personalInfo: {
    fullName: "Alex Johnson",
    professionalTitle: "Full Stack Software Engineer",
    email: "alex.johnson.dev@example.com",
    phone: "+91 98765 43210",
    location: "Chennai, Tamil Nadu, India",
    linkedinUrl: "https://linkedin.com/in/alex-johnson-dev",
    githubUrl: "https://github.com/alexjohnson-dev",
    portfolioUrl: "https://alexjohnson.dev",
  },
  summary:
    "Results-driven Full Stack Software Engineer with a solid foundation in Java, JavaScript, React.js, Node.js, and MongoDB. Experienced in developing scalable web applications, designing RESTful APIs, and implementing clean software architectures. Passionate about solving complex algorithmic problems, building responsive user interfaces, and optimizing database performance.",
  education: [
    {
      id: "edu_1",
      degree: "B.Tech in Information Technology",
      institution: "Institute of Technology & Engineering",
      location: "Anna University, Tamil Nadu",
      startYear: "2023",
      endYear: "2027",
      cgpa: "8.4",
      description: "Core Coursework: Data Structures & Algorithms, Object-Oriented Programming, Database Management Systems, Operating Systems, Computer Networks.",
    },
    {
      id: "edu_2",
      degree: "Higher Secondary Certificate (Class XII)",
      institution: "Higher Secondary Model School",
      location: "Tamil Nadu, India",
      startYear: "2021",
      endYear: "2023",
      cgpa: "92.4%",
      description: "Major: Mathematics, Physics, Chemistry, Computer Science.",
    },
  ],
  skills: {
    programming: ["Java (JDK 21)", "Python 3", "JavaScript (ES6+)", "C++", "SQL"],
    frontend: ["React.js", "Tailwind CSS", "HTML5", "CSS3", "Redux Toolkit", "TypeScript"],
    backend: ["Node.js", "Express.js", "RESTful APIs", "Microservices", "JWT Auth"],
    database: ["MongoDB", "MySQL", "PostgreSQL", "Redis"],
    tools: ["Git", "GitHub", "Docker", "VS Code", "Postman", "Linux"],
  },
  experience: [
    {
      id: "exp_1",
      jobTitle: "Full Stack Development Intern",
      company: "NexGen Cloud Solutions",
      location: "Bengaluru, India",
      startDate: "June 2026",
      endDate: "July 2026",
      currentlyWorking: false,
      description:
        "• Developed and deployed responsive frontend user interface components using React.js and Tailwind CSS.\n• Architected and documented 14+ RESTful API endpoints using Node.js, Express, and JWT authentication.\n• Optimized MongoDB indexing and aggregation queries, reducing query response times by 32%.\n• Participated in agile sprint ceremonies, code reviews, and Git version control workflows.",
    },
  ],
  projects: [
    {
      id: "proj_1",
      name: "E-Waste Recycling & Smart Collection Platform",
      technologies: "React.js, Node.js, Express, MongoDB, Tailwind CSS",
      description:
        "• Engineered a full-stack platform enabling citizens to schedule electronic waste pickups with real-time tracking.\n• Built responsive user interfaces and administrative dashboards for tracking collection logistics and request statuses.\n• Implemented secure JWT role-based authentication and automated transactional status emails.\n• Designed scalable MongoDB schemas handling 1,000+ mock pickup requests with sub-second latency.",
      githubUrl: "https://github.com/alexjohnson-dev/e-waste-management",
      demoUrl: "https://ewaste-demo.vercel.app",
    },
    {
      id: "proj_2",
      name: "Algorithmic Code Sandbox & Online Compiler",
      technologies: "Java, Python, Docker, Node.js, Monaco Editor",
      description:
        "• Developed a real-time web code execution engine supporting Java, Python, C++, and JavaScript.\n• Integrated sandboxed compiler execution APIs evaluating custom stdin input against sample test cases.\n• Designed an OnlineGDB-style split-pane interface with dark terminal debugging output and execution benchmarks.",
      githubUrl: "https://github.com/alexjohnson-dev/code-compiler",
      demoUrl: "https://compiler-demo.vercel.app",
    },
  ],
  certifications: [
    {
      id: "cert_1",
      name: "Programming in Java (Elite Certification)",
      organization: "NPTEL / IIT Kharagpur",
      issueDate: "2025",
      credentialUrl: "https://nptel.ac.in/verify/xyz",
    },
    {
      id: "cert_2",
      name: "Meta Full-Stack Web Development Specialization",
      organization: "Coursera / Meta",
      issueDate: "2026",
      credentialUrl: "https://coursera.org/verify/meta-xyz",
    },
  ],
  achievements: [
    {
      id: "ach_1",
      title: "1st Place Winner — Smart Campus Hackathon 2025",
      description: "Led a team of 4 to design an AI-powered student growth diagnostic tool outperforming 60+ engineering teams.",
    },
    {
      id: "ach_2",
      title: "Solved 350+ Coding Problems on LeetCode & HackerRank",
      description: "Consistently ranked in the top 15% in university competitive programming contests (Arrays, Trees, DP).",
    },
  ],
  positions: [
    {
      id: "pos_1",
      position: "Technical Lead",
      organization: "University Developer & Coding Club",
      duration: "2025 – Present",
      description: "Conducted weekly hands-on workshops on Data Structures, Algorithms, and Full Stack Web Development for 120+ students.",
    },
  ],
  languages: [
    { id: "lang_1", language: "English", proficiency: "Professional Working Proficiency" },
    { id: "lang_2", language: "Tamil", proficiency: "Native" },
  ],
  interests: ["Algorithmic Problem Solving", "Cloud Computing & DevOps", "Open Source Development", "UI/UX Design"],
};

export const GENERIC_ATS_PLAIN_TEXT = `ALEX JOHNSON
+91 98765 43210 | alex.johnson.dev@example.com | Chennai, Tamil Nadu, India
GitHub: https://github.com/alexjohnson-dev | LinkedIn: https://linkedin.com/in/alex-johnson-dev | Portfolio: https://alexjohnson.dev

CAREER OBJECTIVE
Results-driven Full Stack Software Engineer with a solid technical foundation in Java, JavaScript, React.js, Node.js, and MongoDB. Experienced in building responsive web applications, designing RESTful APIs, and implementing clean software architectures. Passionate about solving complex algorithmic problems, optimizing database performance, and delivering scalable software solutions.

EDUCATION
B.Tech, Information Technology (Expected 2027)
Institute of Technology & Engineering, Anna University
CGPA: 8.4 / 10.0

TECHNICAL SKILLS
• Programming Languages: Java (JDK 21), Python, JavaScript (ES6+), C++, SQL
• Frontend Technologies: React.js, Tailwind CSS, HTML5, CSS3, Redux Toolkit, TypeScript
• Backend Technologies: Node.js, Express.js, RESTful APIs, Microservices, JWT Auth
• Database Systems: MongoDB, MySQL, PostgreSQL, Redis
• Developer Tools: Git, GitHub, Docker, VS Code, Postman, Linux

PROJECTS
E-Waste Recycling & Smart Collection Platform (Full-Stack Web App)
Tech Stack: React.js, Node.js, Express, MongoDB, Tailwind CSS
• Engineered a full-stack platform enabling citizens to schedule electronic waste pickups with real-time status tracking.
• Built responsive user interfaces and administrative dashboards for tracking collection logistics and request statuses.
• Implemented secure JWT role-based authentication and automated transactional status emails.
• Designed scalable MongoDB schemas handling 1,000+ mock pickup requests with sub-second latency.

Algorithmic Code Sandbox & Online Compiler
Tech Stack: Java, Python, Docker, Node.js, Monaco Editor
• Developed a real-time web code execution engine supporting Java, Python, C++, and JavaScript.
• Integrated sandboxed compiler execution APIs evaluating custom stdin input against sample test cases.
• Designed an OnlineGDB-style split-pane interface with dark terminal debugging output and execution benchmarks.

INTERNSHIP EXPERIENCE
Full Stack Development Intern — NexGen Cloud Solutions (June 2026 – July 2026)
• Developed and deployed responsive frontend user interface components using React.js and Tailwind CSS.
• Architected and documented 14+ RESTful API endpoints using Node.js, Express, and JWT authentication.
• Optimized MongoDB indexing and aggregation queries, reducing query response times by 32%.
• Participated in agile sprint ceremonies, code reviews, and Git version control workflows.

CERTIFICATIONS
• Programming in Java (Elite Certification) — NPTEL / IIT Kharagpur, 2025
• Meta Full-Stack Web Development Specialization — Coursera / Meta, 2026

ACHIEVEMENTS
• 1st Place Winner — Smart Campus Hackathon 2025 (Out of 60+ engineering teams)
• Solved 350+ Data Structures & Algorithms problems on LeetCode & HackerRank

LANGUAGES
English (Professional), Tamil (Native)`;
