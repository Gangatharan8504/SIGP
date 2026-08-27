export const SAMPLE_TOPIC_PRACTICE = {
  default: [
    {
      id: 1,
      question: "If a number is multiplied by 3 and 7 is added to the product, the result is 34. What is the number?",
      options: ["7", "9", "8", "10"],
      answer: "9",
      solution: "Let number be x. 3x + 7 = 34 => 3x = 27 => x = 9.",
    },
    {
      id: 2,
      question: "What is the least number which when divided by 12, 16, and 24 leaves remainder 3 in each case?",
      options: ["48", "51", "54", "45"],
      answer: "51",
      solution: "LCM(12, 16, 24) = 48. Number = 48 + 3 = 51.",
    },
    {
      id: 3,
      question: "If 15% of a number is 45, what is 40% of that number?",
      options: ["120", "150", "100", "135"],
      answer: "120",
      solution: "Number = (45 / 15) × 100 = 300. 40% of 300 = 120.",
    },
    {
      id: 4,
      question: "Two numbers are in the ratio 4:7. If their sum is 132, find the smaller number.",
      options: ["44", "48", "52", "36"],
      answer: "48",
      solution: "11x = 132 => x = 12. Smaller number = 4 × 12 = 48.",
    },
    {
      id: 5,
      question: "A train 120m long passes a pole in 6 seconds. What is the speed of the train in km/h?",
      options: ["72 km/h", "60 km/h", "80 km/h", "54 km/h"],
      answer: "72 km/h",
      solution: "Speed = 120/6 = 20 m/s = 20 × (18/5) = 72 km/h.",
    },
  ],
};

export const SAMPLE_TOPIC_QUIZ = {
  default: [
    {
      id: 1,
      q: "A sum of ₹12,500 amounts to ₹15,500 in 4 years at simple interest. What is the rate of interest?",
      options: ["5%", "6%", "6.5%", "7%"],
      answer: "6%",
      explanation: "SI = 15500 - 12500 = ₹3000. Rate = (3000 × 100) / (12500 × 4) = 6%.",
    },
    {
      id: 2,
      q: "A and B can do a work in 12 and 16 days respectively. If they work together, in how many days will they finish?",
      options: ["6 6/7 days", "7 days", "6 days", "8 days"],
      answer: "6 6/7 days",
      explanation: "(12 × 16) / (12 + 16) = 192 / 28 = 48 / 7 = 6 6/7 days.",
    },
    {
      id: 3,
      q: "Find the odd one out: 64, 125, 216, 343, 512, 729, 1000, 1331",
      options: ["None", "64", "729", "125"],
      answer: "None",
      explanation: "All numbers are perfect cubes: 4³, 5³, 6³, 7³, 8³, 9³, 10³, 11³.",
    },
    {
      id: 4,
      q: "In a certain code, 'LIGHT' is written as 'MJHIU'. How is 'SOUND' written in that code?",
      options: ["TPVOE", "TPVPE", "TOVOE", "UPVOE"],
      answer: "TPVOE",
      explanation: "Each letter is shifted by +1: S->T, O->P, U->V, N->O, D->E.",
    },
    {
      id: 5,
      q: "Choose the correct sentence: 'Neither the teacher nor the students ______ in the classroom.'",
      options: ["were", "was", "is", "has been"],
      answer: "were",
      explanation: "In 'Neither...nor', the verb agrees with the nearest subject ('students' is plural).",
    },
  ],
};
