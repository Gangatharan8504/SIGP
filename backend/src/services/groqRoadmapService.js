const { getGroqClient } = require("../config/ai");

// Helper to generate verified safe YouTube search link
const buildYoutubeResource = (topic, targetRole) => {
  const query = encodeURIComponent(`${topic} tutorial ${targetRole}`);
  return {
    title: `Learn ${topic} (Video Guide)`,
    url: `https://www.youtube.com/results?search_query=${query}`,
    topic,
    searchQuery: `${topic} tutorial ${targetRole}`,
  };
};

/**
 * Curated 6-Week Placement Preparation Fallback Generator (Role Tailored)
 */
const getCuratedRoadmapByRole = ({ targetRole = "Java Developer", weakAreas = [] }) => {
  const roleLower = targetRole.toLowerCase();

  if (roleLower.includes("java")) {
    return {
      targetRole: "Java Developer",
      weakAreasDetected: weakAreas.length > 0 ? weakAreas : ["DSA & Time Complexity", "Java Multithreading", "Spring Boot Microservices"],
      weeks: [
        {
          weekNumber: 1,
          title: "Core Java & DSA Foundations",
          theme: "Java 21, OOP & Time Complexity",
          description: "Master Java OOP, Memory Management, Generics, and foundational Linear Data Structures.",
          learningObjectives: ["Understand JVM Memory & Garbage Collection", "Implement Arrays, Strings & Two-Pointer Patterns", "Master Java Collections Framework"],
          requiredSkills: ["Core Java", "Arrays", "HashMaps"],
          estimatedHours: 12,
          isUnlocked: true,
          isCompleted: false,
          progressPercentage: 0,
          tasks: [
            {
              taskId: "w1_t1",
              title: "Java OOP Deep-Dive: Polymorphism, Interfaces & Records",
              description: "Review Java OOP principles, abstract classes, sealed interfaces, and records.",
              type: "theory",
              required: true,
              status: "NOT_STARTED",
              completed: false,
              dependsOn: [],
              estimatedMinutes: 60,
              resourceLink: "/courses",
              youtubeResource: buildYoutubeResource("Java OOP and Interfaces", "Java Developer"),
            },
            {
              taskId: "w1_t2",
              title: "Java Collections Framework: ArrayList, LinkedList & HashMap",
              description: "Learn internal working of HashMap (hashing, buckets, treeification) and ConcurrentHashMap.",
              type: "course",
              required: true,
              status: "NOT_STARTED",
              completed: false,
              dependsOn: ["w1_t1"],
              estimatedMinutes: 90,
              resourceLink: "/courses",
              youtubeResource: buildYoutubeResource("Java Collections and HashMap Internal Working", "Java Developer"),
            },
            {
              taskId: "w1_t3",
              title: "Solve 5 Linear Array & Two-Pointer Problems in Compiler",
              description: "Practice Two Sum, 3Sum, and Container With Most Water on the SGIP Coding Compiler.",
              type: "coding",
              required: true,
              status: "NOT_STARTED",
              completed: false,
              dependsOn: ["w1_t2"],
              estimatedMinutes: 120,
              resourceLink: "/practice",
              youtubeResource: buildYoutubeResource("Two Pointer Technique Java DSA", "Java Developer"),
            },
            {
              taskId: "w1_t4",
              title: "Complete Week 1 Quantitative & Java Benchmark Assessment",
              description: "Take the 42-question mock assessment to verify your Week 1 fundamentals.",
              type: "assessment",
              required: true,
              status: "NOT_STARTED",
              completed: false,
              dependsOn: ["w1_t3"],
              estimatedMinutes: 60,
              resourceLink: "/secure-exam/pattern-test",
              youtubeResource: buildYoutubeResource("Java Placement Aptitude and Coding", "Java Developer"),
            },
          ],
        },
        {
          weekNumber: 2,
          title: "Non-Linear DSA: Trees, Heaps & Recursion",
          theme: "Trees, Binary Search Trees & Priority Queues",
          description: "Build deep competency in hierarchical data structures, binary search trees, and heap algorithms.",
          learningObjectives: ["Master Tree Traversals (Inorder, Preorder, Postorder, Level-order)", "Implement Binary Search Trees & Balanced Trees", "Solve Heap & Top-K Problems"],
          requiredSkills: ["Binary Trees", "BST", "PriorityQueue"],
          estimatedHours: 14,
          isUnlocked: false,
          isCompleted: false,
          progressPercentage: 0,
          tasks: [
            {
              taskId: "w2_t1",
              title: "Binary Tree Traversals (BFS & DFS) and Recursive Tracing",
              description: "Understand recursive vs iterative tree traversals and diameter calculations.",
              type: "theory",
              required: true,
              status: "LOCKED",
              completed: false,
              dependsOn: [],
              estimatedMinutes: 75,
              resourceLink: "/courses",
              youtubeResource: buildYoutubeResource("Binary Tree Traversal BFS DFS Java", "Java Developer"),
            },
            {
              taskId: "w2_t2",
              title: "Binary Search Tree Validation & Range Query Algorithms",
              description: "Implement Validate BST, Lowest Common Ancestor, and K-th Smallest Element.",
              type: "coding",
              required: true,
              status: "LOCKED",
              completed: false,
              dependsOn: ["w2_t1"],
              estimatedMinutes: 120,
              resourceLink: "/practice",
              youtubeResource: buildYoutubeResource("Binary Search Tree algorithms Java", "Java Developer"),
            },
            {
              taskId: "w2_t3",
              title: "PriorityQueue & Min/Max Heap Problems",
              description: "Solve Top K Frequent Elements and Merge K Sorted Lists using Java PriorityQueue.",
              type: "coding",
              required: true,
              status: "LOCKED",
              completed: false,
              dependsOn: ["w2_t2"],
              estimatedMinutes: 90,
              resourceLink: "/practice",
              youtubeResource: buildYoutubeResource("Java PriorityQueue and Heap DSA", "Java Developer"),
            },
          ],
        },
        {
          weekNumber: 3,
          title: "Graph Algorithms & Dynamic Programming",
          theme: "Graphs, Shortest Paths & DP Memoization",
          description: "Conquer complex graph traversals (Dijkstra, Topological Sort) and DP state-transition patterns.",
          learningObjectives: ["Master Graph Representations (Adjacency Matrix & List)", "Implement BFS/DFS on Graphs and Cycle Detection", "Solve 1D and 2D Dynamic Programming Problems"],
          requiredSkills: ["Graphs", "Dijkstra", "Dynamic Programming"],
          estimatedHours: 15,
          isUnlocked: false,
          isCompleted: false,
          progressPercentage: 0,
          tasks: [
            {
              taskId: "w3_t1",
              title: "Graph Representations & Connected Components",
              description: "Implement Number of Islands, Rotting Oranges, and Cycle Detection in Directed Graphs.",
              type: "coding",
              required: true,
              status: "LOCKED",
              completed: false,
              dependsOn: [],
              estimatedMinutes: 120,
              resourceLink: "/practice",
              youtubeResource: buildYoutubeResource("Graph algorithms BFS DFS Java", "Java Developer"),
            },
            {
              taskId: "w3_t2",
              title: "Dynamic Programming: Knapsack & Longest Common Subsequence",
              description: "Understand state definition, base cases, memoization, and bottom-up tabulation.",
              type: "theory",
              required: true,
              status: "LOCKED",
              completed: false,
              dependsOn: ["w3_t1"],
              estimatedMinutes: 90,
              resourceLink: "/courses",
              youtubeResource: buildYoutubeResource("Dynamic Programming 0/1 Knapsack Java", "Java Developer"),
            },
            {
              taskId: "w3_t3",
              title: "Solve 4 DP Classic Placement Problems in Compiler",
              description: "Practice Coin Change, Longest Increasing Subsequence, and House Robber.",
              type: "coding",
              required: true,
              status: "LOCKED",
              completed: false,
              dependsOn: ["w3_t2"],
              estimatedMinutes: 120,
              resourceLink: "/practice",
              youtubeResource: buildYoutubeResource("Dynamic Programming placement questions Java", "Java Developer"),
            },
          ],
        },
        {
          weekNumber: 4,
          title: "Java Multithreading & Concurrency",
          theme: "Threads, Executors & Synchronization",
          description: "Essential for Tier-1 Java technical interviews: threads, race conditions, locks, and ThreadPools.",
          learningObjectives: ["Understand Thread Lifecycle & Synchronization", "Master java.util.concurrent: ReentrantLock, Semaphore, CountDownLatch", "Implement Producer-Consumer and CompletableFuture"],
          requiredSkills: ["Threads", "Concurrency", "CompletableFuture"],
          estimatedHours: 12,
          isUnlocked: false,
          isCompleted: false,
          progressPercentage: 0,
          tasks: [
            {
              taskId: "w4_t1",
              title: "Java Multithreading: Synchronization, Volatile & Locks",
              description: "Study race conditions, synchronized blocks, volatile memory visibility, and Deadlocks.",
              type: "theory",
              required: true,
              status: "LOCKED",
              completed: false,
              dependsOn: [],
              estimatedMinutes: 80,
              resourceLink: "/courses",
              youtubeResource: buildYoutubeResource("Java Multithreading and Concurrency Interview", "Java Developer"),
            },
            {
              taskId: "w4_t2",
              title: "Implement Producer-Consumer Pattern with BlockingQueue",
              description: "Build a thread-safe producer-consumer queue in the Java Compiler.",
              type: "coding",
              required: true,
              status: "LOCKED",
              completed: false,
              dependsOn: ["w4_t1"],
              estimatedMinutes: 90,
              resourceLink: "/practice",
              youtubeResource: buildYoutubeResource("Java Producer Consumer BlockingQueue", "Java Developer"),
            },
            {
              taskId: "w4_t3",
              title: "Asynchronous Programming with CompletableFuture & Virtual Threads",
              description: "Explore non-blocking async execution and Java 21 Virtual Threads.",
              type: "course",
              required: true,
              status: "LOCKED",
              completed: false,
              dependsOn: ["w4_t2"],
              estimatedMinutes: 75,
              resourceLink: "/courses",
              youtubeResource: buildYoutubeResource("Java 21 Virtual Threads and CompletableFuture", "Java Developer"),
            },
          ],
        },
        {
          weekNumber: 5,
          title: "Spring Boot, REST APIs & SQL Database Design",
          theme: "Spring Boot 3, Hibernate/JPA & RDBMS Indexing",
          description: "Build production-grade REST APIs, relational schemas, database indexing, and transaction management.",
          learningObjectives: ["Build Spring Boot REST APIs with Dependency Injection", "Configure Spring Data JPA & Hibernate Relationships", "Optimize SQL Queries & Database Indexes"],
          requiredSkills: ["Spring Boot", "Spring Data JPA", "SQL Indexing"],
          estimatedHours: 14,
          isUnlocked: false,
          isCompleted: false,
          progressPercentage: 0,
          tasks: [
            {
              taskId: "w5_t1",
              title: "Spring Boot 3 RESTful Microservice Architecture",
              description: "Understand Controller-Service-Repository pattern, DTO validation, and ExceptionHandler.",
              type: "project",
              required: true,
              status: "LOCKED",
              completed: false,
              dependsOn: [],
              estimatedMinutes: 120,
              resourceLink: "/projects",
              youtubeResource: buildYoutubeResource("Spring Boot 3 REST API tutorial", "Java Developer"),
            },
            {
              taskId: "w5_t2",
              title: "SQL Performance Tuning: B-Tree Indexing & Query Execution Plans",
              description: "Practice EXPLAIN ANALYZE, composite indexes, and preventing N+1 queries in Hibernate.",
              type: "theory",
              required: true,
              status: "LOCKED",
              completed: false,
              dependsOn: ["w5_t1"],
              estimatedMinutes: 90,
              resourceLink: "/courses",
              youtubeResource: buildYoutubeResource("Database Indexing B-Tree SQL Performance", "Java Developer"),
            },
            {
              taskId: "w5_t3",
              title: "Submit Full-Stack/Backend Project to SGIP Portfolio",
              description: "Upload your Spring Boot / Database project to the Projects & Hackathons section.",
              type: "project",
              required: true,
              status: "LOCKED",
              completed: false,
              dependsOn: ["w5_t2"],
              estimatedMinutes: 90,
              resourceLink: "/projects",
              youtubeResource: buildYoutubeResource("Java Spring Boot Project Portfolio", "Java Developer"),
            },
          ],
        },
        {
          weekNumber: 6,
          title: "System Design, ATS Resume & Placement Mock Drives",
          theme: "Low-Level Design, Microservices & Mock Final Clearance",
          description: "Final sprint: Object-Oriented Design (SOLID), System Design fundamentals, Resume ATS scan, and final full assessment.",
          learningObjectives: ["Master SOLID Principles & Design Patterns (Factory, Singleton, Strategy)", "Understand Distributed Caching (Redis) & Rate Limiting", "Achieve 85%+ on Full Pattern Placement Mock"],
          requiredSkills: ["System Design", "SOLID Principles", "Interview Readiness"],
          estimatedHours: 12,
          isUnlocked: false,
          isCompleted: false,
          progressPercentage: 0,
          tasks: [
            {
              taskId: "w6_t1",
              title: "Low-Level Design: Parking Lot or Rate Limiter in Java",
              description: "Design and implement clean OOP class diagrams following SOLID principles.",
              type: "project",
              required: true,
              status: "LOCKED",
              completed: false,
              dependsOn: [],
              estimatedMinutes: 90,
              resourceLink: "/projects",
              youtubeResource: buildYoutubeResource("Low Level Design Java SOLID Interview", "Java Developer"),
            },
            {
              taskId: "w6_t2",
              title: "Run Groq AI Resume ATS Scan for Java Developer Roles",
              description: "Optimize your resume keywords, metrics, and project impact on the SGIP Resume Analyzer.",
              type: "resume",
              required: true,
              status: "LOCKED",
              completed: false,
              dependsOn: ["w6_t1"],
              estimatedMinutes: 45,
              resourceLink: "/resume-analyzer",
              youtubeResource: buildYoutubeResource("Java Developer Resume ATS Optimization", "Java Developer"),
            },
            {
              taskId: "w6_t3",
              title: "Final 60-Mark Placement Readiness Proctored Examination",
              description: "Complete your official 42-question benchmark with 75%+ score to qualify for Tier-1 drives.",
              type: "assessment",
              required: true,
              status: "LOCKED",
              completed: false,
              dependsOn: ["w6_t2"],
              estimatedMinutes: 80,
              resourceLink: "/secure-exam/pattern-test",
              youtubeResource: buildYoutubeResource("Technical Placement Interview Tips Java", "Java Developer"),
            },
          ],
        },
      ],
    };
  }

  // Generic Dynamic 6-Week Fallback tailored to the target role
  return {
    targetRole,
    weakAreasDetected: weakAreas.length > 0 ? weakAreas : ["Algorithmic Problem Solving", "System Architecture", "Placement Aptitude"],
    weeks: [
      {
        weekNumber: 1,
        title: `Core Fundamentals & ${targetRole} Prerequisites`,
        theme: "Language Foundations & Linear Data Structures",
        description: `Establish strong syntax, algorithmic complexity analysis, and linear data structures for ${targetRole}.`,
        learningObjectives: ["Master Core Language Syntax & Idioms", "Analyze Big-O Time & Space Complexity", "Solve Array & String Placement Problems"],
        requiredSkills: ["Core Programming", "Arrays", "Time Complexity"],
        estimatedHours: 12,
        isUnlocked: true,
        isCompleted: false,
        progressPercentage: 0,
        tasks: [
          {
            taskId: "w1_t1",
            title: `Core Programming Paradigms for ${targetRole}`,
            description: `Review key syntax, data structures, and memory models required for ${targetRole}.`,
            type: "theory",
            required: true,
            status: "NOT_STARTED",
            completed: false,
            dependsOn: [],
            estimatedMinutes: 60,
            resourceLink: "/courses",
            youtubeResource: buildYoutubeResource(`${targetRole} crash course`, targetRole),
          },
          {
            taskId: "w1_t2",
            title: "Two-Pointer & Sliding Window Problem Solving",
            description: "Solve 5 array manipulation problems on the SGIP Coding Compiler.",
            type: "coding",
            required: true,
            status: "NOT_STARTED",
            completed: false,
            dependsOn: ["w1_t1"],
            estimatedMinutes: 100,
            resourceLink: "/practice",
            youtubeResource: buildYoutubeResource("Sliding Window and Two Pointers DSA", targetRole),
          },
          {
            taskId: "w1_t3",
            title: "Take Baseline Placement Mock Assessment",
            description: "Complete the 42-question proctored baseline test to measure current readiness.",
            type: "assessment",
            required: true,
            status: "NOT_STARTED",
            completed: false,
            dependsOn: ["w1_t2"],
            estimatedMinutes: 80,
            resourceLink: "/secure-exam/pattern-test",
            youtubeResource: buildYoutubeResource("Placement Mock Assessment Tips", targetRole),
          },
        ],
      },
      {
        weekNumber: 2,
        title: "Non-Linear Data Structures & Hashing",
        theme: "Trees, Hash Tables & Search Algorithms",
        description: "Deep dive into HashMaps, Binary Trees, and divide-and-conquer search algorithms.",
        learningObjectives: ["Understand Hash Table Collision Resolutions", "Implement Tree BFS/DFS Traversals", "Apply Binary Search on Answer Spaces"],
        requiredSkills: ["Hash Tables", "Binary Trees", "Binary Search"],
        estimatedHours: 12,
        isUnlocked: false,
        isCompleted: false,
        progressPercentage: 0,
        tasks: [
          {
            taskId: "w2_t1",
            title: "Hashing Internals & Tree Traversals",
            description: "Study how hash maps work and implement tree depth-first and breadth-first search.",
            type: "theory",
            required: true,
            status: "LOCKED",
            completed: false,
            dependsOn: [],
            estimatedMinutes: 70,
            resourceLink: "/courses",
            youtubeResource: buildYoutubeResource("Binary Trees and Hashing DSA", targetRole),
          },
          {
            taskId: "w2_t2",
            title: "Solve 4 Tree & Binary Search Problems",
            description: "Practice on the online compiler with custom input test cases.",
            type: "coding",
            required: true,
            status: "LOCKED",
            completed: false,
            dependsOn: ["w2_t1"],
            estimatedMinutes: 110,
            resourceLink: "/practice",
            youtubeResource: buildYoutubeResource("Binary Search algorithm problems", targetRole),
          },
        ],
      },
      {
        weekNumber: 3,
        title: "Graphs, Shortest Paths & Dynamic Programming",
        theme: "Complex Algorithms & Optimization",
        description: "Master graph representations, Dijkstra algorithm, and fundamental dynamic programming patterns.",
        learningObjectives: ["Implement Graph Cycle Detection & Topological Sort", "Understand Memoization vs Tabulation in DP", "Solve Knapsack and Subsequence Problems"],
        requiredSkills: ["Graph Theory", "Dynamic Programming"],
        estimatedHours: 14,
        isUnlocked: false,
        isCompleted: false,
        progressPercentage: 0,
        tasks: [
          {
            taskId: "w3_t1",
            title: "Graph Algorithms: BFS, DFS & Topological Sort",
            description: "Learn graph traversal techniques for placement coding rounds.",
            type: "course",
            required: true,
            status: "LOCKED",
            completed: false,
            dependsOn: [],
            estimatedMinutes: 90,
            resourceLink: "/courses",
            youtubeResource: buildYoutubeResource("Graph algorithms topological sort", targetRole),
          },
          {
            taskId: "w3_t2",
            title: "Dynamic Programming Patterns & Code Implementation",
            description: "Solve 4 DP problems on the SGIP compiler.",
            type: "coding",
            required: true,
            status: "LOCKED",
            completed: false,
            dependsOn: ["w3_t1"],
            estimatedMinutes: 120,
            resourceLink: "/practice",
            youtubeResource: buildYoutubeResource("Dynamic programming for interviews", targetRole),
          },
        ],
      },
      {
        weekNumber: 4,
        title: `${targetRole} Core Frameworks & Architecture`,
        theme: "Full Architecture & Framework Deep-Dive",
        description: `Build deep practical knowledge of industry frameworks and backend/frontend architectures for ${targetRole}.`,
        learningObjectives: [`Understand ${targetRole} Architectural Patterns`, "Write Scalable & Clean Code", "Integrate Databases & RESTful Endpoints"],
        requiredSkills: [`${targetRole} Frameworks`, "REST APIs"],
        estimatedHours: 14,
        isUnlocked: false,
        isCompleted: false,
        progressPercentage: 0,
        tasks: [
          {
            taskId: "w4_t1",
            title: `Industry Framework Best Practices for ${targetRole}`,
            description: `Study design patterns, dependency injection, and clean architecture for ${targetRole}.`,
            type: "theory",
            required: true,
            status: "LOCKED",
            completed: false,
            dependsOn: [],
            estimatedMinutes: 80,
            resourceLink: "/courses",
            youtubeResource: buildYoutubeResource(`${targetRole} architecture best practices`, targetRole),
          },
          {
            taskId: "w4_t2",
            title: "Build and Deploy a Functional Capstone Module",
            description: "Upload project artifacts to the SGIP Projects portal.",
            type: "project",
            required: true,
            status: "LOCKED",
            completed: false,
            dependsOn: ["w4_t1"],
            estimatedMinutes: 120,
            resourceLink: "/projects",
            youtubeResource: buildYoutubeResource(`${targetRole} full stack project`, targetRole),
          },
        ],
      },
      {
        weekNumber: 5,
        title: "Databases, Cloud & System Design",
        theme: "Data Persistence & High Scalability",
        description: "Learn relational & NoSQL databases, caching, and fundamental high-level system design.",
        learningObjectives: ["Optimize SQL Indexing & Query Execution", "Understand Distributed Caching (Redis)", "Design Scalable Microservices"],
        requiredSkills: ["Database Design", "System Design", "Caching"],
        estimatedHours: 12,
        isUnlocked: false,
        isCompleted: false,
        progressPercentage: 0,
        tasks: [
          {
            taskId: "w5_t1",
            title: "Database Performance & Indexing Strategies",
            description: "Learn B-Trees, normalization, query optimization, and transaction ACID properties.",
            type: "course",
            required: true,
            status: "LOCKED",
            completed: false,
            dependsOn: [],
            estimatedMinutes: 90,
            resourceLink: "/courses",
            youtubeResource: buildYoutubeResource("Database indexing and system design", targetRole),
          },
          {
            taskId: "w5_t2",
            title: "System Design Fundamentals: Caching, Load Balancing & CDNs",
            description: "Study how top tech companies scale their infrastructure.",
            type: "theory",
            required: true,
            status: "LOCKED",
            completed: false,
            dependsOn: ["w5_t1"],
            estimatedMinutes: 90,
            resourceLink: "/courses",
            youtubeResource: buildYoutubeResource("System design interview fundamentals", targetRole),
          },
        ],
      },
      {
        weekNumber: 6,
        title: "Placement Drives, ATS Resume & Mock Finals",
        theme: "Final Polish & Corporate Placement Verification",
        description: "Final sprint: Optimize resume ATS score, pass final mock examination, and apply to hiring drives.",
        learningObjectives: ["Achieve 85%+ on Resume ATS Scanner", "Clear 60-Mark Proctored Assessment Benchmark", "Apply to Verified Placement Drives"],
        requiredSkills: ["ATS Resume", "Placement Clearance"],
        estimatedHours: 10,
        isUnlocked: false,
        isCompleted: false,
        progressPercentage: 0,
        tasks: [
          {
            taskId: "w6_t1",
            title: `Run AI Resume ATS Scan for ${targetRole}`,
            description: "Improve keyword matching and action verbs on the SGIP Resume Analyzer.",
            type: "resume",
            required: true,
            status: "LOCKED",
            completed: false,
            dependsOn: [],
            estimatedMinutes: 45,
            resourceLink: "/resume-analyzer",
            youtubeResource: buildYoutubeResource(`${targetRole} resume tips`, targetRole),
          },
          {
            taskId: "w6_t2",
            title: "Final 60-Mark Proctored Assessment Benchmark",
            description: "Complete the 42-question placement mock test with proctored monitoring.",
            type: "assessment",
            required: true,
            status: "LOCKED",
            completed: false,
            dependsOn: ["w6_t1"],
            estimatedMinutes: 80,
            resourceLink: "/secure-exam/pattern-test",
            youtubeResource: buildYoutubeResource("Campus placement interview technical questions", targetRole),
          },
        ],
      },
    ],
  };
};

/**
 * Generate Dynamic 6-Week Placement Roadmap via Groq AI
 */
const generateDynamicRoadmap = async ({
  targetRole = "Java Developer",
  studentSkills = [],
  assessmentScores = null,
  academicData = null,
  completedCourses = [],
  weakSkills = [],
}) => {
  const groq = getGroqClient();
  const fallback = getCuratedRoadmapByRole({ targetRole, weakAreas: weakSkills });

  if (!groq) {
    return fallback;
  }

  const prompt = `You are a Principal Campus Placement Architect and Technical Mentor.
Generate a structured, highly personalized 6-Week Placement Preparation Roadmap for a candidate aiming for the role of: "${targetRole}".

CANDIDATE PROFILE CONTEXT:
- Target Role: "${targetRole}"
- Academic CGPA: ${academicData?.cgpa || 8.0}
- Current Skills: ${studentSkills.map((s) => `${s.skillName || s.name} (${s.proficiency || 'Intermediate'})`).join(", ") || "Core Java, DSA, SQL"}
- Identified Skill Gaps & Weak Areas: ${weakSkills.join(", ") || "DSA Optimization, System Architecture, Multithreading"}
- Previous Assessment Performance: ${
    assessmentScores
      ? `Aptitude: ${assessmentScores.aptitude || 60}%, Coding: ${assessmentScores.coding || 50}%, Verbal: ${assessmentScores.verbal || 70}%`
      : "Baseline assessment pending"
  }

CRITICAL STRUCTURAL RULES:
1. Return EXACTLY 6 weeks (weekNumber 1 to 6).
2. Week 1 is UNLOCKED (isUnlocked: true). Weeks 2 to 6 MUST BE LOCKED (isUnlocked: false).
3. In Week 1, all tasks have status "NOT_STARTED". In Weeks 2 to 6, all tasks have status "LOCKED".
4. Address candidate's weak areas directly in weeks 1-3 with specific practice exercises.
5. Task types must be one of: "theory", "coding", "course", "assessment", "project", "resume".
6. Valid internal resourceLinks only:
   - Coding tasks: "/practice"
   - Course tasks: "/courses"
   - Assessment tasks: "/secure-exam/pattern-test"
   - Project tasks: "/projects"
   - Resume tasks: "/resume-analyzer"
7. Provide a youtubeResource object for every task with topic and query for learning before solving.

OUTPUT FORMAT:
Return ONLY a valid JSON object matching this schema:
{
  "targetRole": "${targetRole}",
  "weakAreasDetected": ["Weak Area 1", "Weak Area 2"],
  "weeks": [
    {
      "weekNumber": 1,
      "title": "Week Title",
      "theme": "Theme summary",
      "description": "2-sentence overview",
      "learningObjectives": ["Objective 1", "Objective 2"],
      "requiredSkills": ["Skill 1", "Skill 2"],
      "estimatedHours": 12,
      "isUnlocked": true,
      "isCompleted": false,
      "progressPercentage": 0,
      "tasks": [
        {
          "taskId": "w1_t1",
          "title": "Task title",
          "description": "Actionable task instruction",
          "type": "theory",
          "required": true,
          "status": "NOT_STARTED",
          "completed": false,
          "dependsOn": [],
          "estimatedMinutes": 60,
          "resourceLink": "/courses",
          "youtubeResource": {
            "title": "Learn Topic Video",
            "topic": "Topic Name",
            "searchQuery": "Topic Name tutorial ${targetRole}"
          }
        }
      ]
    }
  ]
}`;

  try {
    const candidateModels = ["openai/gpt-oss-120b", "openai/gpt-oss-20b", "groq/compound-mini"];
    for (const model of candidateModels) {
      try {
        const response = await groq.chat.completions.create({
          messages: [
            { role: "system", content: "You are an elite campus placement curriculum compiler. Output strictly valid parseable JSON only." },
            { role: "user", content: prompt }
          ],
          model,
          temperature: 0.3,
          max_tokens: 6000,
          response_format: { type: "json_object" }
        });

        let raw = response.choices[0]?.message?.content || "";
        raw = raw.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

        const parsed = JSON.parse(raw);
        if (parsed.weeks && Array.isArray(parsed.weeks) && parsed.weeks.length === 6) {
          // Normalize weeks and task links
          parsed.weeks.forEach((w, wIdx) => {
            w.weekNumber = wIdx + 1;
            w.isUnlocked = wIdx === 0;
            w.isCompleted = false;
            w.progressPercentage = 0;
            w.tasks = (w.tasks || []).map((t, tIdx) => ({
              taskId: `w${wIdx + 1}_t${tIdx + 1}`,
              title: t.title || `Task ${tIdx + 1}`,
              description: t.description || "",
              type: ["coding", "course", "assessment", "project", "resume", "theory"].includes(t.type) ? t.type : "theory",
              required: t.required !== false,
              status: wIdx === 0 ? "NOT_STARTED" : "LOCKED",
              completed: false,
              dependsOn: Array.isArray(t.dependsOn) ? t.dependsOn : [],
              estimatedMinutes: t.estimatedMinutes || 60,
              resourceLink: t.type === "coding" ? "/practice" : t.type === "assessment" ? "/secure-exam/pattern-test" : t.type === "resume" ? "/resume-analyzer" : t.type === "project" ? "/projects" : "/courses",
              youtubeResource: buildYoutubeResource(t.youtubeResource?.topic || t.title || "Software Engineering", targetRole),
            }));
          });

          return {
            targetRole: parsed.targetRole || targetRole,
            weakAreasDetected: parsed.weakAreasDetected || weakSkills,
            weeks: parsed.weeks,
          };
        }
      } catch (innerErr) {
        console.warn(`[Groq Roadmap AI Model ${model} generation attempt note]:`, innerErr.message);
      }
    }
  } catch (err) {
    console.error("[Groq Roadmap Service] Live generation error:", err.message);
  }

  return fallback;
};

module.exports = {
  generateDynamicRoadmap,
  getCuratedRoadmapByRole,
  buildYoutubeResource,
};
