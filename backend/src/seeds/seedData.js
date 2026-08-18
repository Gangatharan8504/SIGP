const mongoose = require("mongoose");
const Skill = require("../models/Skill");
const Question = require("../models/Question");
const Assessment = require("../models/Assessment");
const Course = require("../models/Course");
const Resource = require("../models/Resource");
const Company = require("../models/Company");
const PlacementDrive = require("../models/PlacementDrive");
const RAGDocument = require("../models/RAGDocument");
const RAGChunk = require("../models/RAGChunk");

const seedDatabase = async () => {
  try {
    console.log("Checking SGIP master platform catalog...");

    // Check if catalog already exists
    const skillCount = await Skill.countDocuments();
    if (skillCount > 0) {
      console.log("SGIP platform taxonomy & catalog already initialized.");
      return;
    }

    console.log("Seeding master SGIP platform catalog & taxonomy...");

    // 1. Master Skills Catalog
    const skills = [
      { name: "JavaScript (ES6+)", category: "Frontend", demandLevel: "Very High" },
      { name: "React.js", category: "Frontend", demandLevel: "Very High" },
      { name: "Node.js", category: "Backend", demandLevel: "Very High" },
      { name: "Data Structures & Algorithms", category: "Core CS", demandLevel: "Very High" },
      { name: "MongoDB", category: "Database", demandLevel: "High" },
      { name: "PostgreSQL", category: "Database", demandLevel: "High" },
      { name: "Docker", category: "Cloud & DevOps", demandLevel: "High" },
      { name: "Redis", category: "Backend", demandLevel: "High" },
      { name: "Python", category: "Backend", demandLevel: "Very High" },
      { name: "C++", category: "Core CS", demandLevel: "High" },
      { name: "Java", category: "Core CS", demandLevel: "Very High" },
      { name: "System Design", category: "Core CS", demandLevel: "Very High" },
    ];
    await Skill.insertMany(skills);

    // 2. Question Bank
    const q1 = await Question.create({
      title: "Optimized Two Sum using Hash Map",
      description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target in O(n) linear time.",
      category: "Data Structures & Algorithms",
      difficulty: "Easy",
      type: "mcq",
      marks: 10,
      options: [
        { text: "Use Nested Loops with O(n²) time complexity", isCorrect: false },
        { text: "Use a Hash Map storing value to index for O(n) single pass lookup", isCorrect: true },
        { text: "Sort array and binary search with O(n log n) time and O(1) space", isCorrect: false },
        { text: "Use Recursion with exponential time complexity", isCorrect: false },
      ],
    });

    const q2 = await Question.create({
      title: "Binary Search Tree In-Order Traversal Property",
      description: "What sequence order is produced when performing an in-order traversal (Left, Root, Right) on a valid Binary Search Tree?",
      category: "Data Structures & Algorithms",
      difficulty: "Easy",
      type: "mcq",
      marks: 10,
      options: [
        { text: "Strictly Descending order", isCorrect: false },
        { text: "Strictly Non-Decreasing (Ascending) sorted order", isCorrect: true },
        { text: "Arbitrary heap order", isCorrect: false },
        { text: "Breadth-first topological order", isCorrect: false },
      ],
    });

    const q3 = await Question.create({
      title: "Dijkstra's Algorithm Min-Heap Priority Queue Complexity",
      description: "What is the optimal time complexity of Dijkstra's single-source shortest path algorithm using an adjacency list and a Binary Min-Heap?",
      category: "Data Structures & Algorithms",
      difficulty: "Medium",
      type: "mcq",
      marks: 10,
      options: [
        { text: "O(V²)", isCorrect: false },
        { text: "O((V + E) log V)", isCorrect: true },
        { text: "O(V * E)", isCorrect: false },
        { text: "O(V + E)", isCorrect: false },
      ],
    });

    const q4 = await Question.create({
      title: "React Virtual DOM Reconciliation Mechanism",
      description: "How does React's Diffing algorithm achieve O(n) heuristic reconciliation between Virtual DOM trees?",
      category: "Web Development",
      difficulty: "Medium",
      type: "mcq",
      marks: 10,
      options: [
        { text: "By doing a full tree edit distance algorithm in O(n³)", isCorrect: false },
        { text: "By assuming elements of different types produce different trees and using stable unique keys for list children", isCorrect: true },
        { text: "By directly mutating the real DOM nodes on every state update", isCorrect: false },
        { text: "By recompiling WebAssembly bytecodes", isCorrect: false },
      ],
    });

    const q5 = await Question.create({
      title: "Database Indexing & B+ Tree Search Complexity",
      description: "Why do relational database engines predominantly utilize B+ Trees over standard Binary Search Trees for disk-based indexing?",
      category: "Database Systems",
      difficulty: "Medium",
      type: "mcq",
      marks: 10,
      options: [
        { text: "B+ Trees minimize disk I/O operations by maximizing node fan-out and keeping sequential leaf-node links for range scans", isCorrect: true },
        { text: "Binary search trees consume zero memory overhead", isCorrect: false },
        { text: "B+ trees do not support range queries", isCorrect: false },
        { text: "B+ trees require no balancing operations", isCorrect: false },
      ],
    });

    const q6 = await Question.create({
      title: "Process Synchronization & Deadlock Coffman Conditions",
      description: "Which of the following is NOT one of the four essential Coffman conditions required for a Deadlock to occur?",
      category: "Core CS",
      difficulty: "Hard",
      type: "mcq",
      marks: 10,
      options: [
        { text: "Mutual Exclusion", isCorrect: false },
        { text: "Hold and Wait", isCorrect: false },
        { text: "Preemptive Resource Allocation", isCorrect: true },
        { text: "Circular Wait", isCorrect: false },
      ],
    });

    // 3. Proctored Benchmark Assessments Catalog
    await Assessment.create([
      {
        title: "Core Software Engineering Placement Benchmark",
        description: "Comprehensive 30-minute benchmark evaluating Algorithmic complexity, Trees, Graphs, and Hash Structures. Strictly max 3 attempts.",
        category: "Technical Aptitude & DSA",
        targetRole: "Software Development Engineer",
        skillTags: ["Data Structures & Algorithms", "Core CS", "Problem Solving"],
        difficulty: "Intermediate",
        durationMinutes: 30,
        totalMarks: 30,
        passingMarks: 20,
        maxAttempts: 3,
        isSecureExamMode: true,
        questions: [q1._id, q2._id, q3._id],
      },
      {
        title: "Full-Stack Web Architecture & React.js Benchmark",
        description: "Evaluates React 19 reconciliation, Node.js asynchronous event loop, state management, and REST API design for Product Engineering roles.",
        category: "Web Development",
        targetRole: "Full Stack Engineer",
        skillTags: ["React.js", "Node.js", "JavaScript", "Frontend"],
        difficulty: "Advanced",
        durationMinutes: 25,
        totalMarks: 20,
        passingMarks: 14,
        maxAttempts: 3,
        isSecureExamMode: true,
        questions: [q4._id, q1._id],
      },
      {
        title: "Database Systems & SQL Optimization Benchmark",
        description: "Assesses B+ Tree indexing, ACID transactions, normalization, NoSQL document modeling, and execution query plan optimization.",
        category: "Database Systems",
        targetRole: "Backend Engineer",
        skillTags: ["MongoDB", "SQL", "Database Design", "Indexing"],
        difficulty: "Intermediate",
        durationMinutes: 20,
        totalMarks: 20,
        passingMarks: 14,
        maxAttempts: 3,
        isSecureExamMode: true,
        questions: [q5._id, q1._id],
      },
      {
        title: "Operating Systems, Concurrency & Networking Test",
        description: "Tests core computer science principles: process scheduling, threads, memory paging, deadlocks, TCP/IP handshake, and sockets.",
        category: "Core CS",
        targetRole: "Systems Engineer",
        skillTags: ["Operating Systems", "Networking", "Concurrency"],
        difficulty: "Hard",
        durationMinutes: 25,
        totalMarks: 20,
        passingMarks: 14,
        maxAttempts: 3,
        isSecureExamMode: true,
        questions: [q6._id, q3._id],
      },
      {
        title: "Campus Quantitative Aptitude & Logical Reasoning",
        description: "Tier-1 company standard aptitude covering probability distributions, permutations, speed-distance-time, and syllogisms.",
        category: "Aptitude & Logic",
        targetRole: "Graduate Trainee Engineer",
        skillTags: ["Aptitude", "Logic", "Problem Solving"],
        difficulty: "Easy",
        durationMinutes: 30,
        totalMarks: 30,
        passingMarks: 20,
        maxAttempts: 3,
        isSecureExamMode: false,
        questions: [q1._id, q2._id, q3._id],
      },
    ]);

    // 4. Recruiting Companies
    const compGoogle = await Company.create({
      name: "Google",
      logo: "https://www.google.com/favicon.ico",
      industry: "Technology & Cloud Computing",
      tier: "Super Dream",
      typicalPackageLPA: { min: 24, max: 44 },
      eligibilityCriteria: { minCgpa: 8.0, maxBacklogs: 0, allowedDepartments: ["Computer Science and Engineering", "Information Technology"] },
      requiredTechStack: ["Data Structures & Algorithms", "System Design", "C++", "Java", "Python"],
      location: "Bangalore / Hyderabad",
    });

    const compMicrosoft = await Company.create({
      name: "Microsoft",
      logo: "https://www.microsoft.com/favicon.ico",
      industry: "Enterprise Software & AI",
      tier: "Super Dream",
      typicalPackageLPA: { min: 20, max: 40 },
      eligibilityCriteria: { minCgpa: 7.5, maxBacklogs: 0, allowedDepartments: ["Computer Science and Engineering", "Information Technology", "AI & Data Science"] },
      requiredTechStack: ["Data Structures & Algorithms", "React.js", "C#", "Cloud Services"],
      location: "Hyderabad / Noida",
    });

    const compCisco = await Company.create({
      name: "Cisco Systems",
      logo: "https://www.cisco.com/favicon.ico",
      industry: "Networking & Cybersecurity",
      tier: "Dream",
      typicalPackageLPA: { min: 14, max: 20 },
      eligibilityCriteria: { minCgpa: 7.0, maxBacklogs: 0, allowedDepartments: ["Computer Science and Engineering", "Information Technology", "Electronics"] },
      requiredTechStack: ["Python", "Computer Networks", "Linux", "Docker"],
      location: "Bangalore",
    });

    // 5. Placement Drives
    await PlacementDrive.create([
      {
        company: compGoogle._id,
        title: "Google Software Development Engineer Campus Drive 2026",
        role: "Software Development Engineer - I",
        packageCTC: 44,
        jobLocation: "Bangalore",
        driveDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        description: "Hiring final year engineering students for core cloud and search backend engineering groups.",
        rounds: [
          { roundNumber: 1, roundName: "Online Coding Test" },
          { roundNumber: 2, roundName: "Technical Interview I (DSA & Problem Solving)" },
          { roundNumber: 3, roundName: "Technical Interview II (System Architecture)" },
          { roundNumber: 4, roundName: "Googleyness & Behavioral Fit" },
        ],
        eligibilityRule: { minCgpa: 8.0, maxArrears: 0 },
        status: "Upcoming",
      },
      {
        company: compMicrosoft._id,
        title: "Microsoft Cloud & AI University Hiring 2026",
        role: "Associate Software Engineer",
        packageCTC: 38,
        jobLocation: "Hyderabad",
        driveDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        description: "Seeking enthusiastic developers to engineer scalable Azure microservices and generative AI tooling.",
        rounds: [
          { roundNumber: 1, roundName: "Online Assessment" },
          { roundNumber: 2, roundName: "Technical Round 1" },
          { roundNumber: 3, roundName: "Technical Round 2" },
          { roundNumber: 4, roundName: "AA Interview" },
        ],
        eligibilityRule: { minCgpa: 7.5, maxArrears: 0 },
        status: "Upcoming",
      },
    ]);

    // 6. Placement Courses
    await Course.create([
      {
        title: "Mastering Technical Placement Interviews: DSA & System Design",
        category: "Placement Preparation",
        instructor: "Placement Training Cell",
        durationHours: 32,
        rating: 4.9,
        description: "Complete algorithmic patterns and scalable system architecture for Tier-1 company hiring drives.",
      },
      {
        title: "Full Stack MERN & Cloud Architecture for Product Firms",
        category: "Web Development",
        instructor: "Senior Engineering Staff",
        durationHours: 40,
        rating: 4.8,
        description: "Production React 19, Node.js, distributed caching, and containerized cloud deployment.",
      },
    ]);

    // 7. RAG Knowledge Notes
    const ragDoc = await RAGDocument.create({
      title: "Data Structures & Algorithms Master Curriculum Guide",
      fileName: "dsa_master_curriculum.pdf",
      fileType: "PDF",
      fileSize: "2.4 MB",
      totalChunks: 3,
      department: "Computer Science and Engineering",
      subject: "Data Structures & Algorithms",
    });

    await RAGChunk.insertMany([
      {
        documentId: ragDoc._id,
        chunkIndex: 1,
        content: "Binary Search Trees (BST) maintain the invariant that for any given node, all keys in its left subtree are strictly smaller, and all keys in its right subtree are strictly greater. In-order traversal visits nodes in non-decreasing sorted order in O(n) linear time.",
        keywords: ["BST", "binary search tree", "in-order traversal", "time complexity"],
        sourceCitation: "DSA Master Curriculum - Section 4.2 (Trees)",
        department: "Computer Science and Engineering",
        subject: "Data Structures & Algorithms",
      },
      {
        documentId: ragDoc._id,
        chunkIndex: 2,
        content: "Dijkstra's Algorithm finds the shortest path from a single source node to all other nodes in a weighted graph with non-negative edge weights. Using an adjacency list representation with a Binary Min-Heap Priority Queue, the total running time is O((V + E) log V).",
        keywords: ["Dijkstra", "shortest path", "min-heap", "priority queue", "graph"],
        sourceCitation: "DSA Master Curriculum - Section 7.5 (Graph Algorithms)",
        department: "Computer Science and Engineering",
        subject: "Data Structures & Algorithms",
      },
      {
        documentId: ragDoc._id,
        chunkIndex: 3,
        content: "Dynamic Programming solves complex optimization problems by breaking them down into overlapping subproblems with optimal substructure. Memoization stores top-down recursive results, whereas Tabulation constructs bottom-up solutions in iterative arrays.",
        keywords: ["Dynamic Programming", "memoization", "tabulation", "optimal substructure"],
        sourceCitation: "DSA Master Curriculum - Section 9.1 (Dynamic Programming)",
        department: "Computer Science and Engineering",
        subject: "Data Structures & Algorithms",
      },
    ]);

    console.log("Master SGIP catalog & taxonomy seeded successfully!");
  } catch (err) {
    console.error("Database seeding error:", err);
  }
};

module.exports = seedDatabase;
