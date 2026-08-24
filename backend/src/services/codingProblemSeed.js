const CodingProblem = require("../models/CodingProblem");

const DEFAULT_PROBLEMS = [
  {
    title: "Two Sum",
    slug: "two-sum",
    category: "Data Structures & Algorithms",
    difficulty: "Easy",
    topics: ["Arrays", "Hash Table", "Two Pointers"],
    skillsTested: ["Array Traversal", "Hash Map Lookup", "Time Complexity Optimization"],
    description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
    inputFormat: "First line contains array `nums` separated by space. Second line contains integer `target`.",
    outputFormat: "Output the two 0-indexed indices separated by space (or in format `[i, j]`).",
    constraints: "2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9\nOnly one valid answer exists.",
    examples: [
      {
        input: "2 7 11 15\n9",
        output: "0 1",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
      {
        input: "3 2 4\n6",
        output: "1 2",
        explanation: "Because nums[1] + nums[2] == 6, we return [1, 2].",
      },
    ],
    starterCode: {
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextLine()) return;\n        String[] parts = sc.nextLine().trim().split("\\\\s+");\n        int target = sc.nextInt();\n        \n        int[] nums = new int[parts.length];\n        for (int i = 0; i < parts.length; i++) nums[i] = Integer.parseInt(parts[i]);\n        \n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int comp = target - nums[i];\n            if (map.containsKey(comp)) {\n                System.out.println(map.get(comp) + " " + i);\n                return;\n            }\n            map.put(nums[i], i);\n        }\n    }\n}`,
      python: `import sys\n\ndef main():\n    lines = sys.stdin.read().strip().split('\\n')\n    if not lines or not lines[0]:\n        return\n    nums = list(map(int, lines[0].split()))\n    target = int(lines[1])\n    \n    seen = {}\n    for i, n in enumerate(nums):\n        comp = target - n\n        if comp in seen:\n            print(f"{seen[comp]} {i}")\n            return\n        seen[n] = i\n\nif __name__ == "__main__":\n    main()`,
      cpp: `#include <iostream>\n#include <vector>\n#include <unordered_map>\n#include <sstream>\nusing namespace std;\n\nint main() {\n    string line;\n    if (!getline(cin, line)) return 0;\n    stringstream ss(line);\n    vector<int> nums;\n    int val;\n    while (ss >> val) nums.push_back(val);\n    int target;\n    cin >> target;\n    \n    unordered_map<int, int> map;\n    for (int i = 0; i < nums.size(); i++) {\n        int comp = target - nums[i];\n        if (map.find(comp) != map.end()) {\n            cout << map[comp] << " " << i << endl;\n            return 0;\n        }\n        map[nums[i]] = i;\n    }\n    return 0;\n}`,
      c: `#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int nums[1000];\n    int n = 0, val;\n    char ch;\n    while (scanf("%d%c", &val, &ch) == 2) {\n        nums[n++] = val;\n        if (ch == '\\n') break;\n    }\n    int target;\n    scanf("%d", &target);\n    for (int i = 0; i < n; i++) {\n        for (int j = i + 1; j < n; j++) {\n            if (nums[i] + nums[j] == target) {\n                printf("%d %d\\n", i, j);\n                return 0;\n            }\n        }\n    }\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nconst input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split('\\n');\nif (input.length >= 2) {\n  const nums = input[0].trim().split(/\\s+/).map(Number);\n  const target = Number(input[1]);\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const comp = target - nums[i];\n    if (map.has(comp)) {\n      console.log(map.get(comp) + " " + i);\n      process.exit(0);\n    }\n    map.set(nums[i], i);\n  }\n}`,
      sql: `-- SQL Practice: Find pairs with matching target\nSELECT * FROM numbers WHERE val = 9;`,
    },
    testCases: [
      { input: "2 7 11 15\n9", output: "0 1", isHidden: false },
      { input: "3 2 4\n6", output: "1 2", isHidden: false },
      { input: "3 3\n6", output: "0 1", isHidden: false },
      { input: "1 5 8 10 14\n18", output: "2 3", isHidden: true },
      { input: "-1 -2 -3 -4 -5\n-8", output: "2 4", isHidden: true },
    ],
  },
  {
    title: "Longest Substring Without Repeating Characters",
    slug: "longest-substring-without-repeating-characters",
    category: "Data Structures & Algorithms",
    difficulty: "Medium",
    topics: ["Strings", "Sliding Window", "Hash Table"],
    skillsTested: ["Sliding Window Technique", "Set Deduplication", "Pointer Invariance"],
    description: "Given a string `s`, find the length of the longest substring without duplicate characters.",
    inputFormat: "A single line containing the string `s`.",
    outputFormat: "Print a single integer representing the maximum length.",
    constraints: "0 <= s.length <= 5 * 10^4\ns consists of English letters, digits, symbols and spaces.",
    examples: [
      {
        input: "abcabcbb",
        output: "3",
        explanation: "The answer is 'abc', with the length of 3.",
      },
      {
        input: "bbbbb",
        output: "1",
        explanation: "The answer is 'b', with the length of 1.",
      },
      {
        input: "pwwkew",
        output: "3",
        explanation: "The answer is 'wke', with the length of 3.",
      },
    ],
    starterCode: {
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.hasNextLine() ? sc.nextLine() : "";\n        Set<Character> set = new HashSet<>();\n        int maxLen = 0, left = 0;\n        for (int right = 0; right < s.length(); right++) {\n            while (set.contains(s.charAt(right))) {\n                set.remove(s.charAt(left++));\n            }\n            set.add(s.charAt(right));\n            maxLen = Math.max(maxLen, right - left + 1);\n        }\n        System.out.println(maxLen);\n    }\n}`,
      python: `import sys\n\ndef main():\n    s = sys.stdin.read().rstrip('\\r\\n')\n    char_set = set()\n    left = 0\n    max_len = 0\n    for right in range(len(s)):\n        while s[right] in char_set:\n            char_set.remove(s[left])\n            left += 1\n        char_set.add(s[right])\n        max_len = max(max_len, right - left + 1)\n    print(max_len)\n\nif __name__ == "__main__":\n    main()`,
      cpp: `#include <iostream>\n#include <string>\n#include <unordered_set>\nusing namespace std;\n\nint main() {\n    string s;\n    if (!getline(cin, s)) { cout << 0 << endl; return 0; }\n    unordered_set<char> set;\n    int maxLen = 0, left = 0;\n    for (int right = 0; right < s.length(); right++) {\n        while (set.count(s[right])) set.erase(s[left++]);\n        set.insert(s[right]);\n        maxLen = max(maxLen, right - left + 1);\n    }\n    cout << maxLen << endl;\n    return 0;\n}`,
      c: `#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char s[50000];\n    if (!fgets(s, 50000, stdin)) { printf("0\\n"); return 0; }\n    int len = strlen(s);\n    if (len > 0 && s[len-1] == '\\n') s[--len] = '\\0';\n    int maxLen = 0, left = 0;\n    int lastIdx[256];\n    for (int i = 0; i < 256; i++) lastIdx[i] = -1;\n    for (int right = 0; right < len; right++) {\n        unsigned char c = s[right];\n        if (lastIdx[c] >= left) left = lastIdx[c] + 1;\n        lastIdx[c] = right;\n        int cur = right - left + 1;\n        if (cur > maxLen) maxLen = cur;\n    }\n    printf("%d\\n", maxLen);\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nconst s = fs.readFileSync(0, 'utf-8').replace(/[\\r\\n]/g, '');\nconst set = new Set();\nlet maxLen = 0, left = 0;\nfor (let right = 0; right < s.length; right++) {\n  while (set.has(s[right])) set.delete(s[left++]);\n  set.add(s[right]);\n  maxLen = Math.max(maxLen, right - left + 1);\n}\nconsole.log(maxLen);`,
      sql: `-- SQL Practice Query\nSELECT 3;`,
    },
    testCases: [
      { input: "abcabcbb", output: "3", isHidden: false },
      { input: "bbbbb", output: "1", isHidden: false },
      { input: "pwwkew", output: "3", isHidden: false },
      { input: "au", output: "2", isHidden: true },
      { input: "tmmzuxt", output: "5", isHidden: true },
    ],
  },
  {
    title: "Valid Parentheses",
    slug: "valid-parentheses",
    category: "Data Structures & Algorithms",
    difficulty: "Easy",
    topics: ["Stack", "Strings"],
    skillsTested: ["Stack LIFO Property", "Bracket Matching", "Boundary Validation"],
    description: "Given a string `s` containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.",
    inputFormat: "A single line string containing bracket characters.",
    outputFormat: "Print `true` or `false`.",
    constraints: "1 <= s.length <= 10^4\ns consists of parentheses only '()[]{}'.",
    examples: [
      { input: "()", output: "true", explanation: "Matching pair ()" },
      { input: "()[]{}", output: "true", explanation: "All matching pairs" },
      { input: "(]", output: "false", explanation: "Mismatched closing bracket" },
    ],
    starterCode: {
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.hasNextLine() ? sc.nextLine().trim() : "";\n        Stack<Character> stack = new Stack<>();\n        for (char c : s.toCharArray()) {\n            if (c == '(') stack.push(')');\n            else if (c == '{') stack.push('}');\n            else if (c == '[') stack.push(']');\n            else if (stack.isEmpty() || stack.pop() != c) {\n                System.out.println("false");\n                return;\n            }\n        }\n        System.out.println(stack.isEmpty() ? "true" : "false");\n    }\n}`,
      python: `import sys\n\ndef main():\n    s = sys.stdin.read().strip()\n    stack = []\n    mapping = {')': '(', '}': '{', ']': '['}\n    for char in s:\n        if char in mapping:\n            top = stack.pop() if stack else '#'\n            if mapping[char] != top:\n                print("false")\n                return\n        else:\n            stack.append(char)\n    print("true" if not stack else "false")\n\nif __name__ == "__main__":\n    main()`,
      cpp: `#include <iostream>\n#include <stack>\n#include <string>\nusing namespace std;\n\nint main() {\n    string s;\n    if (!getline(cin, s)) { cout << "true" << endl; return 0; }\n    stack<char> st;\n    for (char c : s) {\n        if (c == '(') st.push(')');\n        else if (c == '{') st.push('}');\n        else if (c == '[') st.push(']');\n        else if (st.empty() || st.top() != c) { cout << "false" << endl; return 0; }\n        else st.pop();\n    }\n    cout << (st.empty() ? "true" : "false") << endl;\n    return 0;\n}`,
      c: `#include <stdio.h>\n#include <string.h>\n#include <stdbool>\n\nint main() {\n    char s[10001];\n    if (!scanf("%s", s)) { printf("true\\n"); return 0; }\n    char stack[10001];\n    int top = -1;\n    for (int i = 0; s[i] != '\\0'; i++) {\n        char c = s[i];\n        if (c == '(') stack[++top] = ')';\n        else if (c == '{') stack[++top] = '}';\n        else if (c == '[') stack[++top] = ']';\n        else if (top < 0 || stack[top--] != c) { printf("false\\n"); return 0; }\n    }\n    printf("%s\\n", top == -1 ? "true" : "false");\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nconst s = fs.readFileSync(0, 'utf-8').trim();\nconst stack = [];\nfor (const c of s) {\n  if (c === '(') stack.push(')');\n  else if (c === '{') stack.push('}');\n  else if (c === '[') stack.push(']');\n  else if (stack.length === 0 || stack.pop() !== c) {\n    console.log("false");\n    process.exit(0);\n  }\n}\nconsole.log(stack.length === 0 ? "true" : "false");`,
      sql: `-- SQL Matching\nSELECT 'true';`,
    },
    testCases: [
      { input: "()", output: "true", isHidden: false },
      { input: "()[]{}", output: "true", isHidden: false },
      { input: "(]", output: "false", isHidden: false },
      { input: "([)]", output: "false", isHidden: true },
      { input: "{[]}", output: "true", isHidden: true },
    ],
  },
  {
    title: "Merge Intervals",
    slug: "merge-intervals",
    category: "Data Structures & Algorithms",
    difficulty: "Medium",
    topics: ["Arrays", "Sorting"],
    skillsTested: ["Interval Sorting", "Overlap Merging", "Greedy Range Consolidation"],
    description: "Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
    inputFormat: "First line integer `N`. Following `N` lines contain `start` and `end` separated by space.",
    outputFormat: "Print merged intervals, each on a new line with start and end separated by space.",
    constraints: "1 <= intervals.length <= 10^4\nintervals[i].length == 2\n0 <= start_i <= end_i <= 10^4",
    examples: [
      {
        input: "4\n1 3\n2 6\n8 10\n15 18",
        output: "1 6\n8 10\n15 18",
        explanation: "Since intervals [1,3] and [2,6] overlap, merge them into [1,6].",
      },
      {
        input: "2\n1 4\n4 5",
        output: "1 5",
        explanation: "Intervals [1,4] and [4,5] are considered overlapping.",
      },
    ],
    starterCode: {
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[][] intervals = new int[n][2];\n        for (int i = 0; i < n; i++) {\n            intervals[i][0] = sc.nextInt();\n            intervals[i][1] = sc.nextInt();\n        }\n        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));\n        List<int[]> merged = new ArrayList<>();\n        int[] prev = intervals[0];\n        for (int i = 1; i < n; i++) {\n            if (intervals[i][0] <= prev[1]) {\n                prev[1] = Math.max(prev[1], intervals[i][1]);\n            } else {\n                merged.add(prev);\n                prev = intervals[i];\n            }\n        }\n        merged.add(prev);\n        for (int[] inv : merged) System.out.println(inv[0] + " " + inv[1]);\n    }\n}`,
      python: `import sys\n\ndef main():\n    lines = sys.stdin.read().strip().split('\\n')\n    if not lines or not lines[0]: return\n    n = int(lines[0])\n    intervals = []\n    for i in range(1, n + 1):\n        parts = list(map(int, lines[i].split()))\n        intervals.append(parts)\n    intervals.sort(key=lambda x: x[0])\n    merged = [intervals[0]]\n    for inv in intervals[1:]:\n        if inv[0] <= merged[-1][1]:\n            merged[-1][1] = max(merged[-1][1], inv[1])\n        else:\n            merged.append(inv)\n    for m in merged:\n        print(f"{m[0]} {m[1]}")\n\nif __name__ == "__main__":\n    main()`,
      cpp: `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n;\n    if (!(cin >> n)) return 0;\n    vector<vector<int>> intervals(n, vector<int>(2));\n    for (int i = 0; i < n; i++) cin >> intervals[i][0] >> intervals[i][1];\n    sort(intervals.begin(), intervals.end());\n    vector<vector<int>> merged;\n    merged.push_back(intervals[0]);\n    for (int i = 1; i < n; i++) {\n        if (intervals[i][0] <= merged.back()[1]) {\n            merged.back()[1] = max(merged.back()[1], intervals[i][1]);\n        } else {\n            merged.push_back(intervals[i]);\n        }\n    }\n    for (auto& m : merged) cout << m[0] << " " << m[1] << endl;\n    return 0;\n}`,
      c: `#include <stdio.h>\n#include <stdlib.h>\n\ntypedef struct { int s, e; } Inv;\nint cmp(const void* a, const void* b) { return ((Inv*)a)->s - ((Inv*)b)->s; }\nint main() {\n    int n; if (scanf("%d", &n) != 1) return 0;\n    Inv invs[10000];\n    for (int i = 0; i < n; i++) scanf("%d %d", &invs[i].s, &invs[i].e);\n    qsort(invs, n, sizeof(Inv), cmp);\n    int curS = invs[0].s, curE = invs[0].e;\n    for (int i = 1; i < n; i++) {\n        if (invs[i].s <= curE) { if (invs[i].e > curE) curE = invs[i].e; }\n        else { printf("%d %d\\n", curS, curE); curS = invs[i].s; curE = invs[i].e; }\n    }\n    printf("%d %d\\n", curS, curE);\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nconst lines = fs.readFileSync(0, 'utf-8').trim().split('\\n');\nif (lines.length > 1) {\n  const n = Number(lines[0]);\n  const intervals = lines.slice(1, n + 1).map(l => l.trim().split(/\\s+/).map(Number));\n  intervals.sort((a, b) => a[0] - b[0]);\n  const merged = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = merged[merged.length - 1];\n    if (intervals[i][0] <= last[1]) last[1] = Math.max(last[1], intervals[i][1]);\n    else merged.push(intervals[i]);\n  }\n  merged.forEach(m => console.log(m.join(' ')));\n}`,
      sql: `-- SQL Range Analysis\nSELECT '1 6';`,
    },
    testCases: [
      { input: "4\n1 3\n2 6\n8 10\n15 18", output: "1 6\n8 10\n15 18", isHidden: false },
      { input: "2\n1 4\n4 5", output: "1 5", isHidden: false },
      { input: "3\n1 4\n0 4\n3 5", output: "0 5", isHidden: true },
      { input: "2\n1 4\n2 3", output: "1 4", isHidden: true },
    ],
  },
  {
    title: "SQL Placement Diagnostic: Highest Department Salary",
    slug: "highest-department-salary",
    category: "Database Systems",
    difficulty: "Medium",
    topics: ["SQL", "Aggregation", "GROUP BY", "Subqueries"],
    skillsTested: ["SQL Window Functions", "Aggregation and Joining", "Relational Filtering"],
    description: "Given tables `Employee (id, name, salary, departmentId)` and `Department (id, name)`, write an SQL query to find employees who have the highest salary in each of the departments.",
    inputFormat: "SQLite database loaded with Employee and Department tables.",
    outputFormat: "Table with columns: `Department`, `Employee`, `Salary`.",
    constraints: "Standard SQL-92 / SQLite dialect.",
    examples: [
      {
        input: "-- SQLite tables initialized",
        output: "IT|Max|90000\nIT|Jim|90000\nSales|Henry|80000",
        explanation: "Max and Jim both earn 90000 in IT.",
      },
    ],
    starterCode: {
      sql: `CREATE TABLE Department (id INT, name TEXT);\nINSERT INTO Department VALUES (1, 'IT'), (2, 'Sales');\n\nCREATE TABLE Employee (id INT, name TEXT, salary INT, departmentId INT);\nINSERT INTO Employee VALUES (1, 'Joe', 70000, 1), (2, 'Jim', 90000, 1), (3, 'Henry', 80000, 2), (4, 'Sam', 60000, 2), (5, 'Max', 90000, 1);\n\n-- Write your SELECT query below\nSELECT d.name AS Department, e.name AS Employee, e.salary AS Salary\nFROM Employee e\nJOIN Department d ON e.departmentId = d.id\nWHERE (e.departmentId, e.salary) IN (\n    SELECT departmentId, MAX(salary)\n    FROM Employee\n    GROUP BY departmentId\n)\nORDER BY d.name, e.salary DESC;`,
      java: `public class Main { public static void main(String[] args) { System.out.println("IT|Max|90000\\nIT|Jim|90000\\nSales|Henry|80000"); } }`,
      python: `print("IT|Max|90000\\nIT|Jim|90000\\nSales|Henry|80000")`,
      cpp: `#include <iostream>\nusing namespace std;\nint main() { cout << "IT|Max|90000\\nIT|Jim|90000\\nSales|Henry|80000" << endl; return 0; }`,
      c: `#include <stdio.h>\nint main() { printf("IT|Max|90000\\nIT|Jim|90000\\nSales|Henry|80000\\n"); return 0; }`,
      javascript: `console.log("IT|Max|90000\\nIT|Jim|90000\\nSales|Henry|80000");`,
    },
    testCases: [
      {
        input: "-- Run SQL Query",
        output: "IT|Max|90000\nIT|Jim|90000\nSales|Henry|80000",
        isHidden: false,
      },
    ],
  },
];

const seedCodingProblems = async () => {
  try {
    for (const prob of DEFAULT_PROBLEMS) {
      await CodingProblem.findOneAndUpdate({ slug: prob.slug }, prob, {
        upsert: true,
        new: true,
      });
    }
  } catch (err) {
    console.warn("CodingProblem seed warning:", err.message);
  }
};

module.exports = {
  seedCodingProblems,
  DEFAULT_PROBLEMS,
};
