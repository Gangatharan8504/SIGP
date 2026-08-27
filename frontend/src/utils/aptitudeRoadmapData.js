export const APTITUDE_ROADMAP_METADATA = {
  title: "30-Day Aptitude & Placement Master Schedule",
  target_roles: "IT Placements, TCS, Infosys, Wipro, Accenture, CTS",
  sources: {
    tamil: {
      name: "Feel Free to Learn (தமிழ்)",
      url: "https://www.youtube.com/@FeelFreetoLearnTAMIL",
    },
    english: {
      name: "CareerRide",
      url: "https://www.youtube.com/@CareerRideOfficial",
    },
  },
};

export const APTITUDE_30_DAYS_SCHEDULE = [
  {
    day: 1,
    phase: "Phase 1: Basic Mathematics",
    phaseIndex: 1,
    topic: "Number System & Divisibility Rules",
    focus_areas: ["Classifications of Numbers", "Divisibility Rules (2 to 11)", "Summation Formulas"],
    tamil_resource_url: "https://www.youtube.com/watch?v=g-_xCXSVv1w",
    english_resource_url: "http://www.youtube.com/playlist?list=PLpyc33gOcbVA4qXMoQ5vmhefTruk5t9lt",
    shortcuts: [
      "Divisibility by 3 & 9: Sum of digits must be divisible by 3 or 9.",
      "Divisibility by 4 & 8: Last 2 digits for 4, last 3 digits for 8.",
      "Divisibility by 11: (Sum of digits at odd places) - (Sum of digits at even places) = 0 or multiple of 11.",
      "Composite Divisors: 72 = 8 × 9, 88 = 8 × 11, 99 = 9 × 11.",
      "Sum of first n natural numbers = n(n+1)/2. Sum of first n odd numbers = n².",
    ],
    level1: [
      {
        q: "If the 6-digit number 5432A7 is completely divisible by 9, find digit A.",
        sol: "Sum = 5 + 4 + 3 + 2 + A + 7 = 21 + A. Next multiple of 9 is 27. Therefore 21 + A = 27 => A = 6.",
      },
      {
        q: "Find the smallest digit to replace * in 653*47 so that it is divisible by 11.",
        sol: "Odd places: 7 + * + 5 = 12 + *. Even places: 4 + 3 + 6 = 13. Difference: (12 + *) - 13 = * - 1. * - 1 = 0 => * = 1.",
      },
      {
        q: "Find the sum of all natural numbers between 1 and 100 that are multiples of 5.",
        sol: "Multiples: 5, 10, ..., 100 (n = 20). Sum = (20/2)(5 + 100) = 10 × 105 = 1050.",
      },
    ],
    level2: [
      {
        company: "TCS NQT",
        q: "If the 9-digit number 785x3678y is divisible by 72, find (x + y) where y ≠ 0.",
        sol: "72 = 8 × 9. Last 3 digits 78y div by 8 => y = 4. Sum of digits = 48 + x => x = 6. (x + y) = 6 + 4 = 10.",
      },
      {
        company: "Infosys",
        q: "If 342x18y6 is divisible by 88, find x - y for the largest single digit value of y.",
        sol: "88 = 8 × 11. Largest y for 8y6 div by 8 is y = 9. Divisibility by 11: (18+x) - 15 = x + 3 = 11 => x = 8. x - y = 8 - 9 = -1.",
      },
      {
        company: "Wipro Elite",
        q: "How many 3-digit numbers are divisible by both 4 and 6, but not by 8?",
        sol: "LCM(4,6) = 12. 3-digit multiples of 12 = 75. LCM(4,6,8) = 24. Multiples of 24 = 37. Answer = 75 - 37 = 38.",
      },
    ],
    quiz: [
      {
        q: "If the 7-digit number 425x36y is divisible by 72, find the value of (2x + 3y) assuming y is even.",
        options: ["18", "22", "26", "30"],
        answer: "26",
        explanation: "72 = 8 × 9. Last 3 digits 36y div by 8 => y = 4 (x=7) or y=8 (x=8). For x=7,y=4: 2(7)+3(4) = 26.",
      },
      {
        q: "What least number must be subtracted from 1936 so that dividing by 9, 10, 15 leaves remainder 7?",
        options: ["39", "46", "29", "53"],
        answer: "39",
        explanation: "LCM(9, 10, 15) = 90. 1936 % 90 = 46. To leave remainder 7, subtract 46 - 7 = 39.",
      },
    ],
  },
  {
    day: 2,
    phase: "Phase 1: Basic Mathematics",
    phaseIndex: 1,
    topic: "Unit Digit & Remainder Theorem",
    focus_areas: ["Cyclicity Concept", "Unit Digits of Powers", "Basic Remainder Theorem"],
    tamil_resource_url: "http://www.youtube.com/playlist?list=PL1lPSVzW89HbDUfnF-h7uoeP73vsPeZyj",
    english_resource_url: "http://www.youtube.com/playlist?list=PLpyc33gOcbVA4qXMoQ5vmhefTruk5t9lt",
    shortcuts: [
      "Cyclicity of 2, 3, 7, 8 is 4: Divide power by 4, take remainder.",
      "Cyclicity of 4 & 9 is 2: 4^(odd)=4, 4^(even)=6. 9^(odd)=9, 9^(even)=1.",
      "Remainder of (a × b) / m = (rem(a) × rem(b)) % m.",
    ],
    level1: [
      {
        q: "Find the unit digit in (7^95 - 3^58).",
        sol: "7^(95%4=3) ends in 3. 3^(58%4=2) ends in 9. Unit digit = (13 - 9) = 4.",
      },
      {
        q: "Find the unit digit in 2467^153 × 341^72.",
        sol: "7^(153%4=1) = 7. 1^72 = 1. Product unit digit = 7 × 1 = 7.",
      },
      {
        q: "Find remainder when 2^31 is divided by 5.",
        sol: "2^4 ≡ 1 (mod 5). 2^31 = (2^4)^7 × 2^3 ≡ 1 × 8 ≡ 3 (mod 5).",
      },
    ],
    level2: [
      {
        company: "CTS",
        q: "Find unit digit of (17^256 + 19^256 - 13^256).",
        sol: "7^4 ends in 1, 9^even ends in 1, 3^4 ends in 1. 1 + 1 - 1 = 1.",
      },
      {
        company: "TCS Ninja",
        q: "Find remainder when (67^67 + 67) is divided by 68.",
        sol: "67 ≡ -1 (mod 68). (-1)^67 + (-1) = -2 ≡ 66 (mod 68).",
      },
      {
        company: "Infosys",
        q: "What is the remainder when (25^25 + 26^26) is divided by 27?",
        sol: "(-2)^25 + (-1)^26 = -2^25 + 1 ≡ -20 + 1 = -19 ≡ 8 (mod 27).",
      },
    ],
    quiz: [
      {
        q: "Find unit digit in 3^65 × 6^59 × 7^71.",
        options: ["4", "2", "6", "8"],
        answer: "4",
        explanation: "3^1=3, 6^any=6, 7^3=3 => 3 × 6 × 3 = 54 => 4.",
      },
      {
        q: "Find remainder when 7^84 is divided by 342.",
        options: ["1", "7", "49", "341"],
        answer: "1",
        explanation: "7^3 = 343 ≡ 1 (mod 342). (7^3)^28 ≡ 1^28 = 1.",
      },
    ],
  },
  {
    day: 3,
    phase: "Phase 1: Basic Mathematics",
    phaseIndex: 1,
    topic: "HCF & LCM - Concepts & Properties",
    focus_areas: ["Prime Factorization", "Division Method", "HCF & LCM of Fractions"],
    tamil_resource_url: "https://www.youtube.com/watch?v=RGOvOpQo8cY",
    english_resource_url: "http://www.youtube.com/playlist?list=PLpyc33gOcbVA4qXMoQ5vmhefTruk5t9lt",
    shortcuts: [
      "Product of 2 numbers = HCF × LCM.",
      "HCF of fractions = HCF(numerators) / LCM(denominators).",
      "LCM of fractions = LCM(numerators) / HCF(denominators).",
    ],
    level1: [
      {
        q: "HCF and LCM are 12 and 240. If one number is 48, find other.",
        sol: "Number = (12 × 240) / 48 = 60.",
      },
      {
        q: "Find HCF of 2/3, 8/9, 16/81, 10/27.",
        sol: "HCF = HCF(2,8,16,10) / LCM(3,9,81,27) = 2/81.",
      },
      {
        q: "Two numbers in ratio 3:4 have HCF = 4. Find LCM.",
        sol: "LCM = 4 × 3 × 4 = 48.",
      },
    ],
    level2: [
      {
        company: "Accenture",
        q: "Sum of two numbers is 528 and HCF is 33. How many pairs exist?",
        sol: "33(a+b) = 528 => a+b = 16. Co-prime pairs: (1,15), (3,13), (5,11), (7,9) => 4 pairs.",
      },
      {
        company: "TCS",
        q: "LCM is 495, HCF is 5, sum is 100. Find difference.",
        sol: "ab = 99, a+b = 20 => pair (11,9). Numbers are 55 and 45. Diff = 10.",
      },
      {
        company: "Wipro",
        q: "Largest 4-digit number divisible by 12, 15, 18, 27.",
        sol: "LCM = 540. 9999 - (9999 % 540) = 9999 - 279 = 9720.",
      },
    ],
    quiz: [
      {
        q: "Find LCM of 2/5, 3/10, 4/15.",
        options: ["12/5", "12/25", "6/5", "24/5"],
        answer: "12/5",
        explanation: "LCM = LCM(2,3,4) / HCF(5,10,15) = 12/5.",
      },
      {
        q: "Ratio of two numbers is 4:5 and LCM is 180. Find smaller number.",
        options: ["36", "45", "18", "27"],
        answer: "36",
        explanation: "20x = 180 => x = 9. 4 × 9 = 36.",
      },
    ],
  },
  {
    day: 4,
    phase: "Phase 1: Basic Mathematics",
    phaseIndex: 1,
    topic: "HCF & LCM - Advanced Word Problems",
    focus_areas: ["Traffic Lights Problems", "Bells Tolling Together", "Remainder Conditions"],
    tamil_resource_url: "https://www.youtube.com/watch?v=RGOvOpQo8cY",
    english_resource_url: "http://www.youtube.com/playlist?list=PLpyc33gOcbVA4qXMoQ5vmhefTruk5t9lt",
    shortcuts: [
      "Bells tolling together = LCM of individual periods.",
      "Smallest number divided by a,b,c leaving remainder r = LCM(a,b,c) + r.",
      "Constant difference (a-r1) = (b-r2) = k: Answer = LCM(a,b,c) - k.",
    ],
    level1: [
      {
        q: "Four bells toll at 6, 8, 12, 18s. When will they toll together?",
        sol: "LCM(6,8,12,18) = 72 seconds.",
      },
      {
        q: "Least number divided by 6, 7, 8, 9, 12 leaving remainder 1.",
        sol: "LCM(6,7,8,9,12) + 1 = 504 + 1 = 505.",
      },
      {
        q: "Greatest number dividing 29, 60, 103 leaving remainders 5, 12, 7.",
        sol: "HCF(24, 48, 96) = 24.",
      },
    ],
    level2: [
      {
        company: "TCS",
        q: "6 bells toll at 2, 4, 6, 8, 10, 12s. In 30 min, how many times do they toll together?",
        sol: "LCM = 2 min. Times = (30/2) + 1 = 16 times.",
      },
      {
        company: "Infosys",
        q: "Greatest number dividing 148, 246, 623 leaving remainders 4, 6, 11.",
        sol: "HCF(144, 240, 612) = 36.",
      },
      {
        company: "CTS",
        q: "Least number divided by 20, 25, 35, 40 leaving remainders 14, 19, 29, 34.",
        sol: "Diff = 6. LCM = 1400. Number = 1400 - 6 = 1394.",
      },
    ],
    quiz: [
      {
        q: "Three measuring rods: 64cm, 80cm, 96cm. Least length of cloth measured exactly?",
        options: ["9.6 m", "19.2 m", "4.8 m", "96 m"],
        answer: "9.6 m",
        explanation: "LCM(64,80,96) = 960 cm = 9.6 metres.",
      },
      {
        q: "Largest number dividing 62, 132, 237 leaving same remainder in each case?",
        options: ["35", "70", "15", "25"],
        answer: "35",
        explanation: "HCF(70, 105, 175) = 35.",
      },
    ],
  },
  {
    day: 5,
    phase: "Phase 1: Basic Mathematics",
    phaseIndex: 1,
    topic: "Simplification, BODMAS & Approximation",
    focus_areas: ["BODMAS Rule", "Fraction Manipulation", "Vedic Math Shortcuts"],
    tamil_resource_url: "http://www.youtube.com/playlist?list=PL1lPSVzW89HbDUfnF-h7uoeP73vsPeZyj",
    english_resource_url: "http://www.youtube.com/playlist?list=PLpyc33gOcbVA4qXMoQ5vmhefTruk5t9lt",
    shortcuts: [
      "BODMAS order: Brackets, Orders, Division, Multiplication, Addition, Subtraction.",
      "(a+b)² - (a-b)² = 4ab.",
      "[(a+b)² + (a-b)²] / (a²+b²) = 2.",
    ],
    level1: [
      {
        q: "Evaluate: 25 - [20 - {10 - (7 - 5 - 3)}]",
        sol: "7-5-3 = -1 => 10-(-1)=11 => 20-11=9 => 25-9=16.",
      },
      {
        q: "Simplify: (0.73³ + 0.27³) / (0.73² - 0.73×0.27 + 0.27²)",
        sol: "a + b = 0.73 + 0.27 = 1.",
      },
      {
        q: "Calculate: 1800 ÷ 10 ÷ 2",
        sol: "(1800 / 10) / 2 = 90.",
      },
    ],
    level2: [
      {
        company: "Wipro",
        q: "Find value of √[30 + √[30 + √[30 + ... ∞]]]",
        sol: "Consecutive factors 5×6 => answer is larger = 6.",
      },
      {
        company: "TCS",
        q: "If a + 1/a = 4, find a³ + 1/a³.",
        sol: "4³ - 3(4) = 64 - 12 = 52.",
      },
      {
        company: "Accenture",
        q: "Simplify: [(856 + 167)² + (856 - 167)²] / (856² + 167²)",
        sol: "2(a²+b²) / (a²+b²) = 2.",
      },
    ],
    quiz: [
      {
        q: "Evaluate: [(759 + 241)² - (759 - 241)²] / (759 × 241)",
        options: ["2", "4", "1", "518"],
        answer: "4",
        explanation: "4ab / ab = 4.",
      },
      {
        q: "If x = √[42 - √[42 - √[42 - ... ∞]]], find x.",
        options: ["7", "6", "5", "42"],
        answer: "6",
        explanation: "42 = 6 × 7. With minus sign, take 6.",
      },
    ],
  },
  {
    day: 6,
    phase: "Phase 1: Basic Mathematics",
    phaseIndex: 1,
    topic: "Percentage - Concepts & Fraction Conversions",
    focus_areas: ["Percentage to Fraction Table", "Base Value Concept", "Percentage Increase/Decrease"],
    tamil_resource_url: "http://www.youtube.com/playlist?list=PL1lPSVzW89Hb9OB0BVOKAgya76G1ID5-k",
    english_resource_url: "http://www.youtube.com/playlist?list=PLpyc33gOcbVA4qXMoQ5vmhefTruk5t9lt",
    shortcuts: [
      "1/2=50%, 1/3=33.33%, 1/4=25%, 1/5=20%, 1/6=16.66%, 1/7=14.28%, 1/8=12.5%.",
      "If A is r% more than B, B is [r/(100+r)]×100% less than A.",
      "Net change = a + b + ab/100.",
    ],
    level1: [
      {
        q: "If A's salary is 25% more than B, by what % is B less than A?",
        sol: "(25/125) × 100% = 20%.",
      },
      {
        q: "Price of sugar up by 20%. By what % must consumption drop?",
        sol: "(20/120) × 100% = 16.66%.",
      },
      {
        q: "A number increases by 10% then decreases by 10%. Net % change?",
        sol: "10 - 10 - 1 = -1% (1% decrease).",
      },
    ],
    level2: [
      {
        company: "Infosys",
        q: "Length of rectangle up by 20%, breadth down by 10%. Change in area?",
        sol: "20 - 10 - 2 = +8% increase.",
      },
      {
        company: "TCS",
        q: "35% failed English, 42% failed Math, 15% failed both. % passed in both?",
        sol: "Failed at least one = 35+42-15 = 62%. Passed both = 100 - 62 = 38%.",
      },
      {
        company: "Capgemini",
        q: "Scoring 20% fails by 10 marks; 36% gets 22 marks above passing. Max marks?",
        sol: "16% = 32 marks => 100% = 200 marks.",
      },
    ],
    quiz: [
      {
        q: "If petrol price increases by 25%, by how much % should consumption drop to keep budget?",
        options: ["20%", "25%", "16.66%", "30%"],
        answer: "20%",
        explanation: "25/125 × 100 = 20%.",
      },
      {
        q: "Side of a square increases by 30%. % increase in area?",
        options: ["60%", "69%", "30%", "90%"],
        answer: "69%",
        explanation: "30 + 30 + 9 = 69%.",
      },
    ],
  },
  {
    day: 7,
    phase: "Phase 1: Basic Mathematics",
    phaseIndex: 1,
    topic: "Percentage - Population & Expenditure",
    focus_areas: ["Successive Percentage Changes", "Expenditure & Price Fluctuation", "Exam Pass/Fail Problems"],
    tamil_resource_url: "http://www.youtube.com/playlist?list=PL1lPSVzW89Hb9OB0BVOKAgya76G1ID5-k",
    english_resource_url: "http://www.youtube.com/playlist?list=PLpyc33gOcbVA4qXMoQ5vmhefTruk5t9lt",
    shortcuts: [
      "Population after n years = P(1 + r/100)^n.",
      "Income = Expenditure + Savings.",
      "Election Margin = Winner % - Loser %.",
    ],
    level1: [
      {
        q: "Town population 176400 increases at 5% p.a. Population after 2 years?",
        sol: "176400 × (21/20)² = 194,481.",
      },
      {
        q: "Winner got 60% votes and won by 1400. Total valid votes?",
        sol: "20% = 1400 => 100% = 7000.",
      },
      {
        q: "Spends 75% income. Income up by 20%, exp up by 10%. % increase in savings?",
        sol: "Old Sav=25, New Sav=120-82.5=37.5. Increase = (12.5/25)×100 = 50%.",
      },
    ],
    level2: [
      {
        company: "TCS",
        q: "Population 160000 increased by 3% then 2.5%. Present population?",
        sol: "160000 × 1.03 × 1.025 = 168,920.",
      },
      {
        company: "Infosys",
        q: "10% didn't vote, 60 invalid. Winner got 47% enrolled, won by 308. Total enrolled?",
        sol: "4x + 60 = 308 => 4x = 248 => x = 62 => Total = 6200.",
      },
      {
        company: "Wipro",
        q: "Fresh grapes (80% water), dry grapes (10% water). Dry grapes from 250 kg fresh grapes?",
        sol: "Pulp = 20% of 250 = 50 kg. 90% of Dry = 50 => Dry = 55.55 kg.",
      },
    ],
    quiz: [
      {
        q: "Candidate gets 84% votes and wins by 476 votes. Total votes polled?",
        options: ["700", "650", "800", "750"],
        answer: "700",
        explanation: "68% = 476 => 100% = 700.",
      },
      {
        q: "Machine depreciates at 10% p.a. Present value ₹1,62,000. Value 2 years ago?",
        options: ["₹2,00,000", "₹1,96,000", "₹1,80,000", "₹2,10,000"],
        answer: "₹2,00,000",
        explanation: "162000 / 0.81 = ₹2,00,000.",
      },
    ],
  },
  {
    day: 8,
    phase: "Phase 1: Basic Mathematics",
    phaseIndex: 1,
    topic: "Ratio & Proportion - Basic Operations",
    focus_areas: ["Compounded Ratio", "Duplicate & Sub-duplicate Ratio", "Mean Proportional"],
    tamil_resource_url: "http://www.youtube.com/playlist?list=PL1lPSVzW89HbDUfnF-h7uoeP73vsPeZyj",
    english_resource_url: "http://www.youtube.com/playlist?list=PLpyc33gOcbVA4qXMoQ5vmhefTruk5t9lt",
    shortcuts: [
      "A:B:C = (A×B_1) : (B×B_1) : (B×C_1).",
      "Mean Proportional = √(a × b). Third Proportional = b² / a.",
      "Fourth Proportional = (b × c) / a.",
    ],
    level1: [
      {
        q: "A:B = 2:3, B:C = 4:5. Find A:B:C.",
        sol: "8 : 12 : 15.",
      },
      {
        q: "Mean proportional between 9 and 25.",
        sol: "√(9 × 25) = 15.",
      },
      {
        q: "Third proportional to 16 and 24.",
        sol: "24² / 16 = 36.",
      },
    ],
    level2: [
      {
        company: "TCS",
        q: "3A = 4B = 7C. Divide ₹427 among A, B, C. Find C's share.",
        sol: "Ratio = 28 : 21 : 12. C = (12/61) × 427 = ₹84.",
      },
      {
        company: "Cognizant",
        q: "50p, 25p, 10p coins in ratio 5:9:4 amount to ₹206. Number of 25p coins?",
        sol: "Value per unit = ₹5.15. Units = 40. 25p coins = 9 × 40 = 360.",
      },
      {
        company: "Wipro",
        q: "Incomes in ratio 5:4, expenditures in 3:2. Each saves ₹1600. A's income?",
        sol: "(5x - 1600)/(4x - 1600) = 3/2 => x = 800 => A = ₹4000.",
      },
    ],
    quiz: [
      {
        q: "A:B = 3:4, B:C = 8:9, C:D = 15:16. Find A:D.",
        options: ["5:8", "3:5", "2:3", "7:9"],
        answer: "5:8",
        explanation: "(3/4) × (8/9) × (15/16) = 5/8.",
      },
      {
        q: "Fourth proportional to 4, 9, 12?",
        options: ["27", "18", "36", "24"],
        answer: "27",
        explanation: "(9 × 12) / 4 = 27.",
      },
    ],
  },
  {
    day: 9,
    phase: "Phase 1: Basic Mathematics",
    phaseIndex: 1,
    topic: "Ratio & Proportion - Mixtures & Partnership",
    focus_areas: ["Alligation Rule", "Capital & Time Ratio in Partnership", "Profit Distribution"],
    tamil_resource_url: "http://www.youtube.com/playlist?list=PL1lPSVzW89HbDUfnF-h7uoeP73vsPeZyj",
    english_resource_url: "http://www.youtube.com/playlist?list=PLpyc33gOcbVA4qXMoQ5vmhefTruk5t9lt",
    shortcuts: [
      "Alligation: (Cheaper) / (Dearer) = (d - m) / (m - c).",
      "Partnership profit ratio = (C1 × T1) : (C2 × T2).",
      "Remaining liquid = Initial × (1 - x/V)^n.",
    ],
    level1: [
      {
        q: "Ratio to mix rice at ₹9.30/kg and ₹10.80/kg to get mixture worth ₹10/kg?",
        sol: "(10.80 - 10) : (10 - 9.30) = 0.80 : 0.70 = 8 : 7.",
      },
      {
        q: "A and B invest ₹12000 and ₹16000. Profit ₹28000. A's share?",
        sol: "(3/7) × 28000 = ₹12000.",
      },
      {
        q: "40L milk. 4L replaced with water twice. Milk left?",
        sol: "40 × (9/10)² = 32.4 litres.",
      },
    ],
    level2: [
      {
        company: "Infosys",
        q: "A starts with ₹3500. After 5 months B joins. Profit shared 2:3. B's investment?",
        sol: "(3500 × 12) / (B × 7) = 2/3 => B = ₹9000.",
      },
      {
        company: "TCS",
        q: "Two vessels milk:water are 7:5 and 17:7. Ratio to mix to get 5:3?",
        sol: "Alligation on milk fractions gives 2 : 1.",
      },
      {
        company: "Wipro",
        q: "A (10 oxen, 7m), B (12 oxen, 5m), C (15 oxen, 3m). Rent ₹175. C's share?",
        sol: "Ratio = 14 : 12 : 9. C = (9/35) × 175 = ₹45.",
      },
    ],
    quiz: [
      {
        q: "60L milk. 6L replaced with water 3 times. Milk left?",
        options: ["43.74 L", "45.20 L", "42.50 L", "48.00 L"],
        answer: "43.74 L",
        explanation: "60 × (0.9)³ = 43.74 L.",
      },
      {
        q: "A invests ₹45000 for 12m, B invests ₹60000 for 8m. Ratio of profit?",
        options: ["9:8", "3:4", "5:4", "1:1"],
        answer: "9:8",
        explanation: "(45×12) : (60×8) = 540 : 480 = 9 : 8.",
      },
    ],
  },
  {
    day: 10,
    phase: "Phase 1: Basic Mathematics",
    phaseIndex: 1,
    topic: "Average - Weighted Average & Replacements",
    focus_areas: ["Arithmetic Mean", "Weighted Average Formula", "Included/Excluded Person Problems"],
    tamil_resource_url: "http://www.youtube.com/playlist?list=PL1lPSVzW89HZSU-2nTJm47pt8GveJBjAE",
    english_resource_url: "http://www.youtube.com/playlist?list=PLpyc33gOcbVA4qXMoQ5vmhefTruk5t9lt",
    shortcuts: [
      "Average = Total Sum / Count.",
      "New person weight = Replaced weight ± (Change in avg × Total count).",
      "Average speed = 2xy / (x + y) for equal distances.",
    ],
    level1: [
      {
        q: "Average of 5 numbers is 27. One excluded, average is 25. Excluded number?",
        sol: "(5 × 27) - (4 × 25) = 135 - 100 = 35.",
      },
      {
        q: "Average age of 24 students + teacher is 15. Without teacher, avg is 14. Teacher's age?",
        sol: "(25 × 15) - (24 × 14) = 375 - 336 = 39.",
      },
      {
        q: "Average weight of 8 persons increases by 2.5 kg when new person replaces one of 65 kg.",
        sol: "65 + (8 × 2.5) = 85 kg.",
      },
    ],
    level2: [
      {
        company: "TCS NQT",
        q: "Batsman average increases by 5 after scoring 90 in 12th inning. New average?",
        sol: "11x + 90 = 12(x+5) => x = 30. New avg = 35.",
      },
      {
        company: "Infosys",
        q: "Avg temp Mon-Wed 40°C, Tue-Thu 41°C. Thu is 42°C. Monday temp?",
        sol: "Thu - Mon = 3 => 42 - Mon = 3 => Mon = 39°C.",
      },
      {
        company: "Capgemini",
        q: "Avg weight of A,B,C is 45. A+B avg is 40, B+C avg is 43. Weight of B?",
        sol: "Total=135, A+B=80 => C=55. B+C=86 => B = 31 kg.",
      },
    ],
    quiz: [
      {
        q: "Average of 5 consecutive odd numbers is 61. Difference between highest and lowest?",
        options: ["8", "10", "12", "6"],
        answer: "8",
        explanation: "57, 59, 61, 63, 65 => 65 - 57 = 8.",
      },
      {
        q: "Car covers 60 km at 30 km/h and next 60 km at 60 km/h. Average speed?",
        options: ["40 km/h", "45 km/h", "50 km/h", "35 km/h"],
        answer: "40 km/h",
        explanation: "(2 × 30 × 60) / 90 = 40 km/h.",
      },
    ],
  },
  // -------------------------------------------------------------
  // PHASE 2: ARITHMETIC (Days 11 - 18)
  // -------------------------------------------------------------
  {
    day: 11,
    phase: "Phase 2: Arithmetic",
    phaseIndex: 2,
    topic: "Profit & Loss - CP, SP & Marked Price",
    focus_areas: ["Cost Price vs Selling Price", "Gain/Loss Percentage", "Marked Price & Discount"],
    tamil_resource_url: "http://www.youtube.com/playlist?list=PL1lPSVzW89HbDUfnF-h7uoeP73vsPeZyj",
    english_resource_url: "http://www.youtube.com/playlist?list=PLpyc33gOcbVA4qXMoQ5vmhefTruk5t9lt",
    shortcuts: [
      "Gain % = (Gain/CP) × 100. Loss % = (Loss/CP) × 100.",
      "Marked Price: SP = MP × (100 - Discount%)/100.",
      "When two items sold at same SP with x% gain and x% loss: Net loss = (x/10)² %.",
    ],
    level1: [
      {
        q: "CP = ₹450, SP = ₹540. Profit %?",
        sol: "(90/450) × 100 = 20%.",
      },
      {
        q: "SP = ₹720 with 20% gain. Find CP.",
        sol: "(720 × 100) / 120 = ₹600.",
      },
      {
        q: "Two items sold at ₹19,950 each, +5% on one and -5% on other. Overall result?",
        sol: "(5/10)² = 0.25% Loss.",
      },
    ],
    level2: [
      {
        company: "TCS",
        q: "Marks 40% above CP, offers 20% discount. Profit %?",
        sol: "40 - 20 - 8 = 12% profit.",
      },
      {
        company: "Infosys",
        q: "CP of 15 articles = SP of 12 articles. Gain %?",
        sol: "(3/12) × 100 = 25%.",
      },
      {
        company: "Wipro",
        q: "Sells at 10% loss. If ₹90 more, gains 5%. Find CP.",
        sol: "15% = 90 => CP = ₹600.",
      },
    ],
    quiz: [
      {
        q: "CP of 20 pens = SP of 16 pens. Find profit %.",
        options: ["20%", "25%", "30%", "15%"],
        answer: "25%",
        explanation: "(4/16) × 100 = 25%.",
      },
      {
        q: "Two items sold at ₹990 each, one at 10% gain and other at 10% loss. Overall?",
        options: ["1% Loss", "1% Gain", "No profit no loss", "2% Loss"],
        answer: "1% Loss",
        explanation: "(10/10)² = 1% Loss.",
      },
    ],
  },
  {
    day: 12,
    phase: "Phase 2: Arithmetic",
    phaseIndex: 2,
    topic: "Profit & Loss - Dishonest Dealer & Discounts",
    focus_areas: ["False Weight Concept", "Successive Discounts Formula", "Free Item Percentage"],
    tamil_resource_url: "http://www.youtube.com/playlist?list=PL1lPSVzW89HbDUfnF-h7uoeP73vsPeZyj",
    english_resource_url: "http://www.youtube.com/playlist?list=PLpyc33gOcbVA4qXMoQ5vmhefTruk5t9lt",
    shortcuts: [
      "Dishonest Dealer Gain % = [Error / (True Value - Error)] × 100.",
      "Successive discounts d1 and d2: Equivalent discount = (d1 + d2 - d1×d2/100)%.",
      "Buy x get y free: Discount % = [y / (x + y)] × 100%.",
    ],
    level1: [
      {
        q: "Dealer sells at CP but uses 900g weight for 1kg. Gain %?",
        sol: "[100 / (1000 - 100)] × 100 = 100/900 × 100 = 11 1/9%.",
      },
      {
        q: "Find single discount equivalent to 20% and 10%.",
        sol: "20 + 10 - 2 = 28%.",
      },
      {
        q: "Buy 4 Get 1 Free. Find effective discount %.",
        sol: "(1 / 5) × 100 = 20%.",
      },
    ],
    level2: [
      {
        company: "TCS",
        q: "Dealer marks up goods by 20% and gives 800g instead of 1kg. Total gain %?",
        sol: "(1.20 / 0.80) - 1 = 1.5 - 1 = 50% gain.",
      },
      {
        company: "Infosys",
        q: "Successive discounts of 10%, 20%, 25% on marked price ₹1000. Selling price?",
        sol: "1000 × 0.9 × 0.8 × 0.75 = ₹540.",
      },
      {
        company: "CTS",
        q: "Trader gives 1 article free on purchase of 15 articles and discounts 4%. Net discount %?",
        sol: "Total items 16. Free = 1/16 = 6.25%. Net = 6.25 + 4 - 0.25 = 10%.",
      },
    ],
    quiz: [
      {
        q: "Dealer uses 960g weight for 1 kg. Find gain %.",
        options: ["4 1/6%", "4%", "5%", "4 1/2%"],
        answer: "4 1/6%",
        explanation: "(40 / 960) × 100 = 25/6 = 4 1/6%.",
      },
      {
        q: "Successive discounts 20%, 15%, 10% equivalent to single discount of:",
        options: ["38.8%", "45%", "35%", "40%"],
        answer: "38.8%",
        explanation: "1 - (0.8 × 0.85 × 0.9) = 1 - 0.612 = 38.8%.",
      },
    ],
  },
  {
    day: 13,
    phase: "Phase 2: Arithmetic",
    phaseIndex: 2,
    topic: "Time & Work - Efficiency & Alternate Days",
    focus_areas: ["Unit Work Method", "Efficiency Ratios", "Alternate Day Work Cycle"],
    tamil_resource_url: "http://www.youtube.com/playlist?list=PL1lPSVzW89HbDUfnF-h7uoeP73vsPeZyj",
    english_resource_url: "http://www.youtube.com/playlist?list=PLpyc33gOcbVA4qXMoQ5vmhefTruk5t9lt",
    shortcuts: [
      "Total Work = LCM of days.",
      "Efficiency = Work / Time.",
      "M1×D1×H1/W1 = M2×D2×H2/W2.",
    ],
    level1: [
      {
        q: "A does work in 10 days, B in 15 days. Together in how many days?",
        sol: "30 / (3+2) = 6 days.",
      },
      {
        q: "A is twice as efficient as B. Together finish in 14 days. A alone?",
        sol: "Total = 14 × 3 = 42. A = 42/2 = 21 days.",
      },
      {
        q: "12 men finish in 8 days. Men needed for 6 days?",
        sol: "(12 × 8) / 6 = 16 men.",
      },
    ],
    level2: [
      {
        company: "TCS",
        q: "A in 12d, B in 18d work alternate days starting with A. Total days?",
        sol: "36 units. 2 days = 5 units. 14 days = 35 units. Day 15: A does 1 unit in 1/3 day => 14 1/3 days.",
      },
      {
        company: "Infosys",
        q: "A,B,C in 24, 30, 40 days. C left 4 days before completion. Total days?",
        sol: "Total work = 120 + (4×3) = 132. Total days = 132 / 12 = 11 days.",
      },
      {
        company: "Cognizant",
        q: "3 men or 6 women in 16 days. 12 men and 8 women in how many days?",
        sol: "12M+8W = 32W. (6W × 16) / 32W = 3 days.",
      },
    ],
    quiz: [
      {
        q: "A in 8 days, B in 12 days. Together in how many days?",
        options: ["4.8 days", "5 days", "6 days", "4 days"],
        answer: "4.8 days",
        explanation: "96 / 20 = 4.8 days.",
      },
      {
        q: "20 women in 16 days, 16 men in 15 days. Ratio of efficiency of man to woman?",
        options: ["4:3", "3:4", "5:3", "2:1"],
        answer: "4:3",
        explanation: "320W = 240M => M/W = 4/3.",
      },
    ],
  },
  {
    day: 14,
    phase: "Phase 2: Arithmetic",
    phaseIndex: 2,
    topic: "Time & Work - Pipes & Cisterns",
    focus_areas: ["Inlet and Outlet Pipes", "Leakage Calculation", "Time taken to fill/empty tank"],
    tamil_resource_url: "http://www.youtube.com/playlist?list=PL1lPSVzW89HbDUfnF-h7uoeP73vsPeZyj",
    english_resource_url: "http://www.youtube.com/playlist?list=PLpyc33gOcbVA4qXMoQ5vmhefTruk5t9lt",
    shortcuts: [
      "Inlet pipe = positive rate, Outlet/leak = negative rate.",
      "Tank full time = Capacity / Net rate.",
    ],
    level1: [
      {
        q: "Pipe A fills tank in 20 min, B in 30 min. Together?",
        sol: "60 / (3+2) = 12 minutes.",
      },
      {
        q: "Pipe fills in 10 hrs, leak empties in 15 hrs. Net fill time?",
        sol: "30 / (3 - 2) = 30 hours.",
      },
      {
        q: "Two pipes fill in 12 and 15 mins, third empties in 20 mins. All open together?",
        sol: "60 / (5 + 4 - 3) = 60 / 6 = 10 minutes.",
      },
    ],
    level2: [
      {
        company: "TCS",
        q: "Pipe A fills in 14h, with leak fills in 16h. How long will leak take to empty full tank?",
        sol: "1/14 - 1/16 = 2/224 = 1/112 => 112 hours.",
      },
      {
        company: "Infosys",
        q: "Pipes A and B fill in 20 and 30 min. Both opened, A closed after 4 min. Total time to fill?",
        sol: "4 min of A+B = 4 × 5 = 20 units. Remaining 40 units by B = 40/2 = 20 min. Total = 24 min.",
      },
      {
        company: "Wipro",
        q: "12 buckets of 13.5L capacity fill a tank. How many buckets of 9L capacity needed?",
        sol: "(12 × 13.5) / 9 = 162 / 9 = 18 buckets.",
      },
    ],
    quiz: [
      {
        q: "Two pipes fill tank in 3 hours and 3 hours 45 mins. Waste pipe empties in 1 hour. If all opened when tank is half full, time to empty?",
        options: ["1 hour", "1 hr 15 min", "45 min", "1 hr 30 min"],
        answer: "1 hour",
        explanation: "Rates: +4, +16/5, -12 => Net = -24/5. Half tank = 6 units => 6 / (24/5) = 1.25 hours = 1 hr 15 min.",
      },
      {
        q: "Pipe A is 3 times faster than B. Together they fill tank in 36 min. B alone fills in:",
        options: ["144 min", "108 min", "120 min", "160 min"],
        answer: "144 min",
        explanation: "Capacity = 36 × 4 = 144. B = 144 / 1 = 144 min.",
      },
    ],
  },
  {
    day: 15,
    phase: "Phase 2: Arithmetic",
    phaseIndex: 2,
    topic: "Time & Distance - Relative Speed & Trains",
    focus_areas: ["km/h to m/s Conversions", "Relative Speed (Same vs Opposite direction)", "Train passing platform/man"],
    tamil_resource_url: "http://www.youtube.com/playlist?list=PL1lPSVzW89HbDUfnF-h7uoeP73vsPeZyj",
    english_resource_url: "http://www.youtube.com/playlist?list=PLpyc33gOcbVA4qXMoQ5vmhefTruk5t9lt",
    shortcuts: [
      "km/h to m/s = Multiply by 5/18. m/s to km/h = Multiply by 18/5.",
      "Opposite direction: Add speeds. Same direction: Subtract speeds.",
      "Distance crossing platform = L_train + L_platform.",
    ],
    level1: [
      {
        q: "54 km/h in m/s?",
        sol: "54 × 5/18 = 15 m/s.",
      },
      {
        q: "Train 200m long running at 72 km/h passes a pole in:",
        sol: "200 / 20 = 10 seconds.",
      },
      {
        q: "Train 150m passes 250m platform in 20s. Speed in km/h?",
        sol: "(400/20) × 18/5 = 72 km/h.",
      },
    ],
    level2: [
      {
        company: "TCS",
        q: "Trains 140m and 160m run opposite at 60 and 48 km/h. Crossing time?",
        sol: "300 / (108 × 5/18) = 300 / 30 = 10s.",
      },
      {
        company: "Infosys",
        q: "Train passes 800m and 400m bridges in 100s and 60s. Length of train?",
        sol: "3(L+800) = 5(L+400) => L = 200m.",
      },
      {
        company: "Wipro",
        q: "Thief spotted at 200m. Thief 10 km/h, police 11 km/h. Distance thief runs before caught?",
        sol: "Time = 200 / (5/18) = 720s = 12 min. Dist = 10 × (12/60) = 2 km.",
      },
    ],
    quiz: [
      {
        q: "Train at 90 km/h crosses 300m platform in 20s. Length of train?",
        options: ["200 m", "250 m", "150 m", "300 m"],
        answer: "200 m",
        explanation: "25 × 20 = 500m. Train = 500 - 300 = 200m.",
      },
      {
        q: "Two trains start towards each other at 75 and 50 km/h. When they meet, one traveled 175 km more. Total dist?",
        options: ["875 km", "750 km", "1000 km", "625 km"],
        answer: "875 km",
        explanation: "Time = 175/25 = 7h. Dist = 125 × 7 = 875 km.",
      },
    ],
  },
  {
    day: 16,
    phase: "Phase 2: Arithmetic",
    phaseIndex: 2,
    topic: "Time & Distance - Boats & Streams",
    focus_areas: ["Upstream vs Downstream Speed", "Speed of Boat in Still Water", "Speed of Stream"],
    tamil_resource_url: "http://www.youtube.com/playlist?list=PL1lPSVzW89HbDUfnF-h7uoeP73vsPeZyj",
    english_resource_url: "http://www.youtube.com/playlist?list=PLpyc33gOcbVA4qXMoQ5vmhefTruk5t9lt",
    shortcuts: [
      "Downstream speed u = u_boat + v_stream.",
      "Upstream speed v = u_boat - v_stream.",
      "Boat speed = (Downstream + Upstream) / 2.",
      "Stream speed = (Downstream - Upstream) / 2.",
    ],
    level1: [
      {
        q: "Boat speed in still water 10 km/h, stream 3 km/h. Find downstream and upstream speed.",
        sol: "Downstream = 10+3 = 13 km/h. Upstream = 10-3 = 7 km/h.",
      },
      {
        q: "Boat travels 24 km downstream in 2h and 24 km upstream in 4h. Boat speed in still water?",
        sol: "Down = 12, Up = 6. Still water speed = (12 + 6) / 2 = 9 km/h.",
      },
      {
        q: "Downstream speed 15 km/h, upstream 9 km/h. Find speed of current.",
        sol: "Stream = (15 - 9) / 2 = 3 km/h.",
      },
    ],
    level2: [
      {
        company: "TCS",
        q: "Man rows 40 km downstream in 5h and 18 km upstream in 3h. Find speed of stream.",
        sol: "Down = 8 km/h, Up = 6 km/h. Stream = (8 - 6) / 2 = 1 km/h.",
      },
      {
        company: "Infosys",
        q: "A boat takes twice as long to row upstream as downstream. If water speed is 3 km/h, find boat speed.",
        sol: "(u - 3) × 2 = (u + 3) × 1 => 2u - 6 = u + 3 => u = 9 km/h.",
      },
      {
        company: "Accenture",
        q: "A man can row 6 km/h in still water. River runs at 2 km/h. Takes 3h to row to place and return. Find distance.",
        sol: "Dist / 8 + Dist / 4 = 3 => 3D / 8 = 3 => D = 8 km.",
      },
    ],
    quiz: [
      {
        q: "Speed of boat downstream is 16 km/h and upstream is 10 km/h. Find speed of boat in still water.",
        options: ["13 km/h", "12 km/h", "14 km/h", "15 km/h"],
        answer: "13 km/h",
        explanation: "(16 + 10) / 2 = 13 km/h.",
      },
      {
        q: "Boat goes 14 km upstream in 56 min. Speed of stream is 2 km/h. Boat speed in still water?",
        options: ["17 km/h", "15 km/h", "18 km/h", "16 km/h"],
        answer: "17 km/h",
        explanation: "Upstream = 14 / (56/60) = 15 km/h. Boat = 15 + 2 = 17 km/h.",
      },
    ],
  },
  {
    day: 17,
    phase: "Phase 2: Arithmetic",
    phaseIndex: 2,
    topic: "Simple Interest",
    focus_areas: ["PTR/100 Formula", "Rate of Interest Calculations", "Amount doubling/tripling shortcut"],
    tamil_resource_url: "http://www.youtube.com/playlist?list=PL1lPSVzW89HYTitAcAMUT6UjBWgia1eKn",
    english_resource_url: "http://www.youtube.com/playlist?list=PLpyc33gOcbVA4qXMoQ5vmhefTruk5t9lt",
    shortcuts: [
      "SI = (P × R × T) / 100.",
      "Rate for n-times sum = (n - 1) × 100 / T.",
      "T2 = T1 × (m - 1) / (n - 1).",
    ],
    level1: [
      {
        q: "SI on ₹68000 at 16 2/3% for 9 months.",
        sol: "SI = (68000 × 50/3 × 3/4) / 100 = ₹8,500.",
      },
      {
        q: "Sum triples in 8 years at SI. Rate %?",
        sol: "(3 - 1) × 100 / 8 = 25%.",
      },
      {
        q: "Years to double at 12.5% p.a. SI?",
        sol: "100 / 12.5 = 8 years.",
      },
    ],
    level2: [
      {
        company: "TCS",
        q: "Sum becomes ₹756 in 2y and ₹873 in 3.5y. Find sum and rate.",
        sol: "1.5y SI = 117 => 1y SI = 78. Principal = 756 - 156 = ₹600. Rate = 13%.",
      },
      {
        company: "Infosys",
        q: "₹1550 lent partly at 5% and 8%. 3y interest ₹300. Sum at 5%?",
        sol: "Alligation gives 16:15 ratio => Sum = (16/31) × 1550 = ₹800.",
      },
      {
        company: "Wipro",
        q: "Sum triples in 5 years. In how many years will it become 9 times?",
        sol: "5 × (8/2) = 20 years.",
      },
    ],
    quiz: [
      {
        q: "Sum doubles in 7 years at SI. When will it become 4 times?",
        options: ["21 years", "14 years", "28 years", "18 years"],
        answer: "21 years",
        explanation: "7 × 3 = 21 years.",
      },
      {
        q: "SI is 4/9 of principal and years = rate %. Find rate %.",
        options: ["6 2/3%", "6%", "7 1/2%", "8%"],
        answer: "6 2/3%",
        explanation: "R² = 400/9 => R = 20/3 = 6 2/3%.",
      },
    ],
  },
  {
    day: 18,
    phase: "Phase 2: Arithmetic",
    phaseIndex: 2,
    topic: "Compound Interest & SI/CI Difference",
    focus_areas: ["Compounding Annually/Half-Yearly", "2-Year Difference Formula", "3-Year Difference Formula"],
    tamil_resource_url: "http://www.youtube.com/playlist?list=PL1lPSVzW89HYTitAcAMUT6UjBWgia1eKn",
    english_resource_url: "http://www.youtube.com/playlist?list=PLpyc33gOcbVA4qXMoQ5vmhefTruk5t9lt",
    shortcuts: [
      "Amount = P(1 + R/100)^T.",
      "2-Year Difference between CI and SI: Diff = P(R/100)².",
      "3-Year Difference: Diff = P(R/100)² × (3 + R/100).",
      "CI doubling shortcut: If sum doubles in T years at CI, it becomes 2^k in k×T years.",
    ],
    level1: [
      {
        q: "CI on ₹25000 at 12% p.a. for 2 years compounded annually.",
        sol: "Amount = 25000 × (1.12)² = ₹31,360. CI = 31360 - 25000 = ₹6,360.",
      },
      {
        q: "Difference between CI and SI on ₹5000 for 2 years at 10% p.a.",
        sol: "Diff = 5000 × (10/100)² = 5000 × 0.01 = ₹50.",
      },
      {
        q: "Sum doubles in 4 years at CI. In how many years will it become 8 times?",
        sol: "8 = 2³ => Time = 4 × 3 = 12 years.",
      },
    ],
    level2: [
      {
        company: "TCS",
        q: "Difference between CI and SI on a sum for 3 years at 10% is ₹93. Find sum.",
        sol: "93 = P(0.01)(3.10) = 0.031 P => P = 93 / 0.031 = ₹3,000.",
      },
      {
        company: "Infosys",
        q: "A sum at CI becomes ₹1352 in 2 years and ₹1406.08 in 3 years. Find rate %.",
        sol: "Interest = 1406.08 - 1352 = 54.08. Rate = (54.08 / 1352) × 100 = 4%.",
      },
      {
        company: "Wipro",
        q: "CI on sum for 2 years at 4% is ₹102. Find SI on same sum for same time.",
        sol: "CI rate = 4 + 4 + 0.16 = 8.16%. SI rate = 8%. SI = 102 × (8/8.16) = ₹100.",
      },
    ],
    quiz: [
      {
        q: "Difference between CI and SI on ₹10,000 for 2 years at 5% p.a. is:",
        options: ["₹25", "₹50", "₹12.50", "₹100"],
        answer: "₹25",
        explanation: "10000 × (5/100)² = ₹25.",
      },
      {
        q: "Sum of money at CI triples itself in 3 years. In 9 years it will become:",
        options: ["27 times", "9 times", "12 times", "81 times"],
        answer: "27 times",
        explanation: "3^(9/3) = 3³ = 27 times.",
      },
    ],
  },
  // -------------------------------------------------------------
  // PHASE 3: DATA INTERPRETATION & LOGICAL REASONING (Days 19 - 25)
  // -------------------------------------------------------------
  {
    day: 19,
    phase: "Phase 3: DI & Logical Reasoning",
    phaseIndex: 3,
    topic: "Data Interpretation - Bar & Pie Charts",
    focus_areas: ["Reading Data Fast", "Angle to Percentage Conversions", "Ratio & Growth Calculations"],
    tamil_resource_url: "http://www.youtube.com/playlist?list=PL1lPSVzW89HbDUfnF-h7uoeP73vsPeZyj",
    english_resource_url: "http://www.youtube.com/playlist?list=PLpyc33gOcbVBvdfzlSn97a1TlfysSPwm-",
    shortcuts: [
      "Pie chart 360° = 100% (1% = 3.6°).",
      "% Growth = [(Final - Initial) / Initial] × 100.",
    ],
    level1: [
      {
        q: "Convert 54° of a pie chart into percentage.",
        sol: "(54 / 360) × 100 = 15%.",
      },
      {
        q: "Total expenditure is ₹72,000. Food sector is 108°. Find food expense.",
        sol: "(108 / 360) × 72000 = ₹21,600.",
      },
      {
        q: "Sales grew from 400 to 520 units. Find % increase.",
        sol: "(120 / 400) × 100 = 30%.",
      },
    ],
    level2: [
      {
        company: "TCS NQT",
        q: "In pie chart, R&D is 72° and Marketing is 108°. What % more is Marketing than R&D?",
        sol: "[(108 - 72) / 72] × 100 = 36/72 × 100 = 50%.",
      },
      {
        company: "Infosys",
        q: "Total production is 60,000 units. Ratio of Company A to B is 3:2. Find production of A.",
        sol: "(3/5) × 60000 = 36,000 units.",
      },
      {
        company: "CTS",
        q: "Bar chart shows revenue in 2024=₹80L, 2025=₹100L. Find CAGR / growth rate.",
        sol: "(20/80) × 100 = 25%.",
      },
    ],
    quiz: [
      {
        q: "In a pie chart, education sector angle is 90°. What % of total budget is education?",
        options: ["25%", "30%", "20%", "33.33%"],
        answer: "25%",
        explanation: "(90 / 360) × 100 = 25%.",
      },
      {
        q: "If 15% is spent on rent, what is central angle in pie chart?",
        options: ["54°", "60°", "45°", "72°"],
        answer: "54°",
        explanation: "15 × 3.6° = 54°.",
      },
    ],
  },
  {
    day: 20,
    phase: "Phase 3: DI & Logical Reasoning",
    phaseIndex: 3,
    topic: "Data Interpretation - Line Graphs & Tables",
    focus_areas: ["Missing Data Tables", "Trend Analysis in Line Graphs", "Multi-chart Problems"],
    tamil_resource_url: "http://www.youtube.com/playlist?list=PL1lPSVzW89HbDUfnF-h7uoeP73vsPeZyj",
    english_resource_url: "http://www.youtube.com/playlist?list=PLpyc33gOcbVBvdfzlSn97a1TlfysSPwm-",
    shortcuts: [
      "Ratio comparison shortcut: a/b vs c/d cross-multiplication.",
      "Average growth = Total change / Number of intervals.",
    ],
    level1: [
      {
        q: "Table shows exports for 3 years: 200, 240, 310. Find average exports.",
        sol: "(200 + 240 + 310) / 3 = 750 / 3 = 250.",
      },
      {
        q: "Production line graph shows 50 in Jan, 80 in Feb. % increase?",
        sol: "(30 / 50) × 100 = 60%.",
      },
      {
        q: "Table: Passed = 80, Total = 120. Pass percentage?",
        sol: "(80 / 120) × 100 = 66.67%.",
      },
    ],
    level2: [
      {
        company: "TCS",
        q: "In a table, Company Profit % = [(Income - Exp)/Exp] × 100. If Exp = ₹40L, Profit = 25%, find Income.",
        sol: "Income = 40 × 1.25 = ₹50L.",
      },
      {
        company: "Infosys",
        q: "Line graph shows steepest growth year between 2021 (100) -> 2022 (180) -> 2023 (220). Which year had higher % growth?",
        sol: "2021-22 = 80%, 2022-23 = 22.2%. Highest in 2022.",
      },
      {
        company: "Wipro",
        q: "Missing value in table: Avg of 5 depts is 420. Four depts are 400, 450, 380, 430. Find 5th.",
        sol: "(5 × 420) - 1660 = 2100 - 1660 = 440.",
      },
    ],
    quiz: [
      {
        q: "Imports are ₹60 Cr, Exports ₹75 Cr. Ratio of imports to exports?",
        options: ["4:5", "5:4", "3:4", "2:3"],
        answer: "4:5",
        explanation: "60 : 75 = 4 : 5.",
      },
      {
        q: "Average of data points 12, 18, 24, 30, 36 is:",
        options: ["24", "20", "28", "26"],
        answer: "24",
        explanation: "Middle term of AP = 24.",
      },
    ],
  },
  {
    day: 21,
    phase: "Phase 3: DI & Logical Reasoning",
    phaseIndex: 3,
    topic: "Logical Reasoning - Coding & Decoding",
    focus_areas: ["Letter Shift Patterns", "Number Coding", "Substitution & Matrix Coding"],
    tamil_resource_url: "http://www.youtube.com/playlist?list=PL1lPSVzW89HbDUfnF-h7uoeP73vsPeZyj",
    english_resource_url: "http://www.youtube.com/playlist?list=PLpyc33gOcbVADMKqylI__O_O_RMeHTyNK",
    shortcuts: [
      "Alphabet positions: EJOTY (5, 10, 15, 20, 25).",
      "Opposite pair sum = 27 (A-Z, B-Y, C-X, D-W, E-V, etc.).",
    ],
    level1: [
      {
        q: "If ROAD is URDG, how is SWAN written?",
        sol: "+3 shift: S->V, W->Z, A->D, N->Q => VZDQ.",
      },
      {
        q: "DELHI is 73541, CALCUTTA is 82589662. Code for CALICUT?",
        sol: "Direct substitution: 8251896.",
      },
      {
        q: "COMPUTER is RFUVQNPC. Code for MEDICINE?",
        sol: "Reversal + 1 shift: EOJDJEFM.",
      },
    ],
    level2: [
      {
        company: "TCS Ninja",
        q: "'pit na som' = 'bring me water', 'na jo tod' = 'water is life', 'som jo lin' = 'give me life'. Which word means 'is'?",
        sol: "'na' = water, 'jo' = life => 'tod' = is.",
      },
      {
        company: "Infosys",
        q: "SYSTEM = SYSMET, NEARER = AENRER. Code for FRACTION?",
        sol: "First 4 reversed 'CARF', last 4 reversed 'NOIT' => CARFNOIT.",
      },
      {
        company: "Capgemini",
        q: "A=2, M=26, Z=52. Value of BET?",
        sol: "4 + 10 + 40 = 54.",
      },
    ],
    quiz: [
      {
        q: "If TEACHER is VGCEJGT, how is CHILDREN coded?",
        options: ["EJKNFTGP", "EJKNFSTP", "EJKNFUTP", "EJKNFSTG"],
        answer: "EJKNFTGP",
        explanation: "+2 shift on all letters.",
      },
      {
        q: "If CAT = 24 and SAD = 24, then SHE = ?",
        options: ["32", "44", "28", "30"],
        answer: "32",
        explanation: "19 + 8 + 5 = 32.",
      },
    ],
  },
  {
    day: 22,
    phase: "Phase 3: DI & Logical Reasoning",
    phaseIndex: 3,
    topic: "Logical Reasoning - Blood Relations",
    focus_areas: ["Family Tree Diagrams", "Coded Blood Relations", "Pointing to a Photograph Problems"],
    tamil_resource_url: "http://www.youtube.com/playlist?list=PL1lPSVzW89HbDUfnF-h7uoeP73vsPeZyj",
    english_resource_url: "http://www.youtube.com/playlist?list=PLpyc33gOcbVADMKqylI__O_O_RMeHTyNK",
    shortcuts: [
      "(+) Male, (-) Female, (=) Married couple, (|) Generation gap.",
      "'My father's only son' = Myself (for male speaker).",
    ],
    level1: [
      {
        q: "Pointing to photo: 'That man's father is my father's son (I have no brothers).' Who is in photo?",
        sol: "Speaker's Son.",
      },
      {
        q: "A is B's brother. C is A's mother. D is C's father. D to A?",
        sol: "Maternal grandfather.",
      },
      {
        q: "'He is the son of the daughter of the father of my uncle.' Boy to girl?",
        sol: "Brother.",
      },
    ],
    level2: [
      {
        company: "TCS",
        q: "A+B: brother, A-B: sister, A×B: father. Which means C is son of M?",
        sol: "M × N - C + F (M is father, C is male brother).",
      },
      {
        company: "Infosys",
        q: "'His mother is only daughter of my mother.' Woman to man?",
        sol: "Mother.",
      },
      {
        company: "Wipro",
        q: "K brother of T, M mother of K, W brother of M. W to T?",
        sol: "Maternal Uncle.",
      },
    ],
    quiz: [
      {
        q: "A father of C, D son of B. E brother of A. C sister of D. How is B related to E?",
        options: ["Sister-in-law", "Sister", "Brother", "Niece"],
        answer: "Sister-in-law",
        explanation: "B is wife of A, so B is Sister-in-law of E.",
      },
      {
        q: "Naman says: 'She is daughter of only son of my grandfather.' Woman to Naman?",
        options: ["Sister", "Daughter", "Mother", "Aunt"],
        answer: "Sister",
        explanation: "Daughter of father = Sister.",
      },
    ],
  },
  {
    day: 23,
    phase: "Phase 3: DI & Logical Reasoning",
    phaseIndex: 3,
    topic: "Logical Reasoning - Direction Sense Test",
    focus_areas: ["Compass Positions", "Pythagoras Theorem for Distance", "Shadow Based Problems"],
    tamil_resource_url: "http://www.youtube.com/playlist?list=PL1lPSVzW89HbDUfnF-h7uoeP73vsPeZyj",
    english_resource_url: "http://www.youtube.com/playlist?list=PLpyc33gOcbVADMKqylI__O_O_RMeHTyNK",
    shortcuts: [
      "Cardinal directions: N, E, S, W (clockwise NESW).",
      "Shortest distance = √(x² + y²) (Pythagoras).",
      "Sunrise shadow falls West; Sunset shadow falls East.",
    ],
    level1: [
      {
        q: "A man walks 3 km North, turns right and walks 4 km. Shortest distance from start?",
        sol: "√(3² + 4²) = 5 km.",
      },
      {
        q: "Facing East, turns 90° clockwise then 180° anti-clockwise. Which direction now?",
        sol: "East -> South (90° CW) -> North (180° ACW). North.",
      },
      {
        q: "Walks 10m South, turns left 20m, turns left 10m. Distance from start?",
        sol: "20m East.",
      },
    ],
    level2: [
      {
        company: "TCS",
        q: "One morning after sunrise, Suresh stood facing a pole. Pole's shadow fell exactly to his right. Which direction was he facing?",
        sol: "Sun in East, shadow in West. Since West is to his right, he faces South.",
      },
      {
        company: "Infosys",
        q: "Rohan walks 8 km South, turns right 6 km, turns left 4 km. Direction from start?",
        sol: "South-West.",
      },
      {
        company: "CTS",
        q: "Starting from point X, walks 15m West, turns left 20m, turns left 15m. How far is he from X?",
        sol: "20m.",
      },
    ],
    quiz: [
      {
        q: "A man walks 6 km North, turns left 4 km, turns left 6 km. How far is he from starting point?",
        options: ["4 km", "6 km", "8 km", "2 km"],
        answer: "4 km",
        explanation: "Distance = 4 km West.",
      },
      {
        q: "At sunset, Amit stood facing a pole. His shadow was to his left. Which way was he facing?",
        options: ["North", "South", "East", "West"],
        answer: "North",
        explanation: "Sunset shadow in East. If East is on left, he is facing North.",
      },
    ],
  },
  {
    day: 24,
    phase: "Phase 3: DI & Logical Reasoning",
    phaseIndex: 3,
    topic: "Logical Reasoning - Seating Arrangement",
    focus_areas: ["Linear Arrangement (Facing North/South)", "Circular Arrangement (Facing Inward/Outward)"],
    tamil_resource_url: "http://www.youtube.com/playlist?list=PL1lPSVzW89HbDUfnF-h7uoeP73vsPeZyj",
    english_resource_url: "http://www.youtube.com/playlist?list=PLpyc33gOcbVADMKqylI__O_O_RMeHTyNK",
    shortcuts: [
      "Circular facing center: Left is clockwise, Right is anti-clockwise.",
      "Circular facing outward: Left is anti-clockwise, Right is clockwise.",
      "Fix direct positioning clues first before relative clues.",
    ],
    level1: [
      {
        q: "5 friends A, B, C, D, E sitting in row facing North. C is middle. A is left of B, D is right of E. Find extreme left.",
        sol: "Order: E, D, C, A, B or D, E, C, A, B. Extreme left is E/D.",
      },
      {
        q: "6 people around circle facing center. A is opposite D. B is right of A. Position of B relative to D?",
        sol: "Third to left of D.",
      },
      {
        q: "8 people around circular table facing center. P is second to right of T. Left of P is Q.",
        sol: "Direct neighbor clockwise.",
      },
    ],
    level2: [
      {
        company: "TCS",
        q: "A, B, C, D, E, F in circular arrangement facing center. B is between D and C. A is second to left of E and second to right of C. Who is facing A?",
        sol: "D is facing A.",
      },
      {
        company: "Infosys",
        q: "7 people P, Q, R, S, T, U, V in a line facing North. V is between T and Q. P is on extreme right.",
        sol: "Determine exact position using anchor points.",
      },
      {
        company: "Wipro",
        q: "Circular table 8 friends, 4 facing center and 4 facing outside. Opposite rules applied.",
        sol: "Apply alternating orientation rules.",
      },
    ],
    quiz: [
      {
        q: "Four girls A, B, C, D sitting around circle facing center. B and C in front of each other. Who sits to left of D if A is right of B?",
        options: ["A", "B", "C", "D"],
        answer: "A",
        explanation: "Arrangement is B -> A -> C -> D.",
      },
      {
        q: "In linear row facing North, A is 10th from left and B is 9th from right. 3 between them. Total people?",
        options: ["22", "20", "24", "18"],
        answer: "22",
        explanation: "10 + 3 + 9 = 22.",
      },
    ],
  },
  {
    day: 25,
    phase: "Phase 3: DI & Logical Reasoning",
    phaseIndex: 3,
    topic: "Logical Reasoning - Syllogisms & Venn Diagrams",
    focus_areas: ["Statement-Conclusion Logic", "Venn Diagram Overlay", "Possibility Cases"],
    tamil_resource_url: "http://www.youtube.com/playlist?list=PL1lPSVzW89HbDUfnF-h7uoeP73vsPeZyj",
    english_resource_url: "http://www.youtube.com/playlist?list=PLpyc33gOcbVADMKqylI__O_O_RMeHTyNK",
    shortcuts: [
      "All A are B + All B are C => All A are C.",
      "Some A are B + All B are C => Some A are C.",
      "No A is B + All C are A => No C is B.",
      "Either I or II condition: 1 conclusion (+), 1 (-), same subject/predicate, both individually false.",
    ],
    level1: [
      {
        q: "Statements: All cats are dogs. All dogs are birds. Conclusion: (I) All cats are birds. (II) Some birds are cats.",
        sol: "Both conclusions I and II follow.",
      },
      {
        q: "Statements: Some pens are books. All books are pencils. Conclusion: Some pens are pencils.",
        sol: "Follows.",
      },
      {
        q: "Statements: No car is bus. No bus is truck. Conclusion: No car is truck.",
        sol: "Does not follow (indefinite relationship).",
      },
    ],
    level2: [
      {
        company: "TCS",
        q: "Statements: Some apples are mangoes. No mango is banana. Conclusions: (I) Some apples are not bananas. (II) Some bananas are apples.",
        sol: "Only conclusion (I) follows.",
      },
      {
        company: "Infosys",
        q: "Statements: All keys are locks. Some locks are doors. Conclusion: (I) Some keys are doors. (II) No key is door.",
        sol: "Either (I) or (II) follows (complementary pair).",
      },
      {
        company: "CTS",
        q: "Statements: Only a few circles are squares. All squares are triangles. Conclusion: Some circles are triangles.",
        sol: "Follows.",
      },
    ],
    quiz: [
      {
        q: "Statements: All flowers are trees. No tree is house. Conclusion: (I) No flower is house. (II) Some trees are flowers.",
        options: ["Both I and II follow", "Only I follows", "Only II follows", "Neither follows"],
        answer: "Both I and II follow",
        explanation: "All flowers are inside trees, trees cannot be houses, so flowers cannot be houses.",
      },
      {
        q: "Venn diagram representing: Authors, Teachers, Men.",
        options: ["Three overlapping circles", "One inside another", "Two separate circles", "None"],
        answer: "Three overlapping circles",
        explanation: "A person can be all three or any combination.",
      },
    ],
  },
  // -------------------------------------------------------------
  // PHASE 4: VERBAL ABILITY & MOCK TESTS (Days 26 - 30)
  // -------------------------------------------------------------
  {
    day: 26,
    phase: "Phase 4: Verbal & Mock Tests",
    phaseIndex: 4,
    topic: "Verbal Ability - Spotting Errors",
    focus_areas: ["Subject-Verb Agreement", "Tense Rules", "Modifier & Preposition Errors"],
    tamil_resource_url: "http://www.youtube.com/playlist?list=PL1lPSVzW89HbDUfnF-h7uoeP73vsPeZyj",
    english_resource_url: "http://www.youtube.com/playlist?list=PLpyc33gOcbVBbD8Vfy-gCbivjSSHbMpUX",
    shortcuts: [
      "Either...or / Neither...nor agrees with nearest subject.",
      "'Along with', 'as well as' agrees with first subject.",
      "'Each of', 'One of' takes singular verb.",
    ],
    level1: [
      {
        q: "Spot error: 'Neither of the two candidates (A) / are eligible (B) / for post (C)'",
        sol: "Error in (B). Replace 'are' with 'is'.",
      },
      {
        q: "Spot error: 'The teacher along with his students (A) / were present (B) / at seminar (C)'",
        sol: "Error in (B). Replace 'were' with 'was'.",
      },
      {
        q: "Spot error: 'One of my friends (A) / live in Delhi (B)'",
        sol: "Error in (B). Replace 'live' with 'lives'.",
      },
    ],
    level2: [
      {
        company: "TCS",
        q: "Spot error: 'Not only manager (A) / but also employees (B) / was surprised (C)'",
        sol: "Error in (C). 'employees' is plural => 'were surprised'.",
      },
      {
        company: "Infosys",
        q: "Spot error: 'A large number of students (A) / has applied (B)'",
        sol: "Error in (B). 'A number of' takes plural verb 'have applied'.",
      },
      {
        company: "CTS",
        q: "Spot error: 'Ten miles (A) / are a long distance (B)'",
        sol: "Error in (B). Specific distance unit takes singular 'is'.",
      },
    ],
    quiz: [
      {
        q: "'The Prime Minister as well as his cabinet (A) / are arriving tomorrow (B)'",
        options: ["Error in B (change 'are' to 'is')", "Part A", "Part C", "No error"],
        answer: "Error in B (change 'are' to 'is')",
        explanation: "'As well as' agrees with first singular subject.",
      },
      {
        q: "'Each of the participants ______ awarded.'",
        options: ["was", "were", "are", "have been"],
        answer: "was",
        explanation: "'Each of' takes singular verb.",
      },
    ],
  },
  {
    day: 27,
    phase: "Phase 4: Verbal & Mock Tests",
    phaseIndex: 4,
    topic: "Verbal Ability - Sentence Completion",
    focus_areas: ["Single & Double Fillers", "Contextual Vocabulary", "Conjunction Usage"],
    tamil_resource_url: "http://www.youtube.com/playlist?list=PL1lPSVzW89HbDUfnF-h7uoeP73vsPeZyj",
    english_resource_url: "http://www.youtube.com/playlist?list=PLpyc33gOcbVBbD8Vfy-gCbivjSSHbMpUX",
    shortcuts: [
      "Look for trigger words: 'although', 'despite' (contrast), 'moreover', 'and' (continuation).",
      "Tone matching: positive-positive or positive-negative.",
    ],
    level1: [
      {
        q: "Fill: 'Despite several warnings, he ______ to repeat the mistake.'",
        sol: "'continued'.",
      },
      {
        q: "Fill: 'The judge acquitted the accused because of ______ evidence.'",
        sol: "'insufficient / lack of'.",
      },
      {
        q: "Fill: 'She is ______ intelligent ______ hardworking.'",
        sol: "'both...and' or 'not only...but also'.",
      },
    ],
    level2: [
      {
        company: "TCS",
        q: "Double filler: 'The new policy was designed to ______ corruption and ______ transparency.'",
        sol: "'curb / eliminate' and 'promote / enhance'.",
      },
      {
        company: "Infosys",
        q: "Fill: 'His speech was so ______ that everyone was left speechless.'",
        sol: "'eloquent / profound'.",
      },
      {
        company: "Wipro",
        q: "Fill: 'The scientist was known for his ______ approach to research.'",
        sol: "'meticulous'.",
      },
    ],
    quiz: [
      {
        q: "'Although the task was arduous, the team ______ it before deadline.'",
        options: ["accomplished", "delayed", "abandoned", "surrendered"],
        answer: "accomplished",
        explanation: "'Although' introduces contrast to arduous.",
      },
      {
        q: "'The company’s profits ______ due to proactive strategies.'",
        options: ["soared", "plummeted", "diminished", "stagnated"],
        answer: "soared",
        explanation: "'Proactive strategies' creates positive outcome.",
      },
    ],
  },
  {
    day: 28,
    phase: "Phase 4: Verbal & Mock Tests",
    phaseIndex: 4,
    topic: "Verbal Ability - Para Jumbles",
    focus_areas: ["Opening Sentence Identification", "Mandatory Pairs", "Transition Word Strategy"],
    tamil_resource_url: "http://www.youtube.com/playlist?list=PL1lPSVzW89HbDUfnF-h7uoeP73vsPeZyj",
    english_resource_url: "http://www.youtube.com/playlist?list=PLpyc33gOcbVBbD8Vfy-gCbivjSSHbMpUX",
    shortcuts: [
      "Rule out sentences starting with 'However', 'Therefore', 'This', 'These' as openers.",
      "Find Noun -> Pronoun pairs (e.g. 'Albert Einstein' -> 'He').",
      "Look for chronological or cause-and-effect flow.",
    ],
    level1: [
      {
        q: "Arrange: (A) He established theory. (B) Einstein was born in 1879. (C) It won Nobel prize.",
        sol: "Order: B -> A -> C.",
      },
      {
        q: "Arrange: (A) As a result, prices rose. (B) Rainfall was scarce. (C) Crops failed.",
        sol: "Order: B -> C -> A.",
      },
      {
        q: "Identify opening sentence among: (A) However, this method failed. (B) Traditional agriculture relied on rain. (C) Therefore modern irrigation started.",
        sol: "Opening is (B).",
      },
    ],
    level2: [
      {
        company: "TCS Verbal",
        q: "Arrange: (A) Renewable energy is now cheaper. (B) Climate change poses a threat. (C) Thus, solar adoption is rising.",
        sol: "Order: B -> A -> C.",
      },
      {
        company: "Infosys",
        q: "Mandatory pair finding in 4-sentence paragraph.",
        sol: "Link noun introduction to definite article 'the'.",
      },
      {
        company: "CTS",
        q: "Arrangement with chronology from foundation to global expansion.",
        sol: "Chronological sequence.",
      },
    ],
    quiz: [
      {
        q: "Rearrange: (P) He was awarded. (Q) Ramanujam was a genius. (R) He discovered formulas.",
        options: ["Q -> R -> P", "P -> Q -> R", "R -> P -> Q", "Q -> P -> R"],
        answer: "Q -> R -> P",
        explanation: "Introduction (Q), discovery (R), award (P).",
      },
      {
        q: "Which word cannot start an opening sentence?",
        options: ["Furthermore", "India", "Technology", "Education"],
        answer: "Furthermore",
        explanation: "'Furthermore' requires preceding context.",
      },
    ],
  },
  {
    day: 29,
    phase: "Phase 4: Verbal & Mock Tests",
    phaseIndex: 4,
    topic: "Verbal Ability - Reading Comprehension",
    focus_areas: ["Skimming and Scanning", "Tone & Main Idea Questions", "Inference Questions"],
    tamil_resource_url: "http://www.youtube.com/playlist?list=PL1lPSVzW89HbDUfnF-h7uoeP73vsPeZyj",
    english_resource_url: "http://www.youtube.com/playlist?list=PLpyc33gOcbVBbD8Vfy-gCbivjSSHbMpUX",
    shortcuts: [
      "Read questions before reading the passage to know target keywords.",
      "First & last paragraph usually contain the author's central thesis/tone.",
    ],
    level1: [
      {
        q: "Difference between skimming and scanning?",
        sol: "Skimming gets general idea; scanning locates specific facts/numbers.",
      },
      {
        q: "Identifying tone: 'The reckless destruction of ecosystems is alarming.'",
        sol: "Tone is 'Critical / Concerned'.",
      },
      {
        q: "Finding antonym of 'Ephemeral' in context of fleeting beauty.",
        sol: "'Permanent / Eternal'.",
      },
    ],
    level2: [
      {
        company: "TCS NQT",
        q: "Passage on AI ethics. Main idea identification.",
        sol: "Balancing innovation with safety regulation.",
      },
      {
        company: "Infosys",
        q: "Inference question based on corporate governance excerpt.",
        sol: "Evaluate conclusions strictly implied by text.",
      },
      {
        company: "Wipro",
        q: "Vocabulary in context: 'Pervasive impact of smartphones'.",
        sol: "'Widespread / Omnipresent'.",
      },
    ],
    quiz: [
      {
        q: "What is the synonym of 'Pragmatic'?",
        options: ["Practical", "Idealistic", "Theoretical", "Hesitant"],
        answer: "Practical",
        explanation: "Pragmatic means dealing with things sensibly and realistically.",
      },
      {
        q: "What is the antonym of 'Mundane'?",
        options: ["Extraordinary", "Ordinary", "Banal", "Routine"],
        answer: "Extraordinary",
        explanation: "Mundane means dull/ordinary.",
      },
    ],
  },
  {
    day: 30,
    phase: "Phase 4: Verbal & Mock Tests",
    phaseIndex: 4,
    topic: "Full-Length Mixed Practice Set",
    focus_areas: ["Time-bound 30-Question Mock", "Weak Area Review", "Speed & Accuracy Tuning"],
    tamil_resource_url: "http://www.youtube.com/playlist?list=PL1lPSVzW89HbDUfnF-h7uoeP73vsPeZyj",
    english_resource_url: "http://www.youtube.com/playlist?list=PLpyc33gOcbVBvdfzlSn97a1TlfysSPwm-",
    shortcuts: [
      "Target: 1 min per Quant, 45s per Verbal.",
      "Eliminate 2 false options instantly.",
      "Never get stuck on 1 question > 90 seconds.",
    ],
    level1: [
      {
        q: "Find 25% of 40% of 1500.",
        sol: "0.25 × 0.40 × 1500 = 150.",
      },
      {
        q: "15 men do work in 10 days. 25 men in how many days?",
        sol: "(15 × 10) / 25 = 6 days.",
      },
      {
        q: "Odd one out: 27, 64, 125, 144, 216",
        sol: "144 is 12² (others are cubes).",
      },
    ],
    level2: [
      {
        company: "TCS / Infosys",
        q: "Sum ₹12000 becomes ₹15840 in 4y at SI. If rate up by 2%, new amount?",
        sol: "Extra SI = (12000×2×4)/100 = ₹960. New amount = ₹16,800.",
      },
      {
        company: "Wipro / CTS",
        q: "Train at 54 km/h crosses man in same direction at 6 km/h in 15s. Length?",
        sol: "Rel speed = 48 km/h = 40/3 m/s. Length = (40/3) × 15 = 200m.",
      },
      {
        company: "Accenture",
        q: "75% voted, 2% invalid. Winner got 9261 (75% of valid). Total enrolled?",
        sol: "N × 0.75 × 0.98 × 0.75 = 9261 => N = 16,800.",
      },
    ],
    quiz: [
      {
        q: "Sum doubles in 5 years at CI. In how many years will it become 8 times?",
        options: ["15 years", "20 years", "10 years", "25 years"],
        answer: "15 years",
        explanation: "8 = 2³ => 5 × 3 = 15 years.",
      },
      {
        q: "A and B invest in ratio 3:5. A leaves after 6 months. Annual profit ₹26,000. B's share?",
        options: ["₹20,000", "₹18,000", "₹16,000", "₹15,000"],
        answer: "₹20,000",
        explanation: "Ratio = 18 : 60 = 3 : 10. B = (10/13) × 26000 = ₹20,000.",
      },
    ],
  },
];
