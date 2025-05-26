import { Message } from "./message";

export const mockMessages: Message[] = [
  {
    id: 1,
    role: "user",
    content: "Hey there! Can you help me understand quantum computing?",
    timestamp: new Date("2025-05-21T10:00:00Z"),
  },
  {
    id: 2,
    role: "assistant",
    content:
      "Of course! Quantum computing is a type of computation that uses quantum bits, or qubits, instead of classical bits.",
    timestamp: new Date("2025-05-21T10:00:02Z"),
  },
  {
    id: 3,
    role: "user",
    content: "How are qubits different from normal bits?",
    timestamp: new Date("2025-05-21T10:00:05Z"),
  },
  {
    id: 4,
    role: "assistant",
    content:
      "Great question. Unlike bits, which are either 0 or 1, qubits can exist in a superposition of both 0 and 1 at the same time.",
    timestamp: new Date("2025-05-21T10:00:07Z"),
  },
  {
    id: 5,
    role: "user",
    content: "So does that mean they can do multiple calculations at once?",
    timestamp: new Date("2025-05-21T10:00:10Z"),
  },
  {
    id: 6,
    role: "assistant",
    content:
      "Exactly! That's one of the key advantages — quantum computers can process complex problems faster by evaluating many possibilities simultaneously.",
    timestamp: new Date("2025-05-21T10:00:13Z"),
  },
  {
    id: 7,
    role: "user",
    content: "Are there any real-world applications already?",
    timestamp: new Date("2025-05-21T10:00:16Z"),
  },
  {
    id: 8,
    role: "assistant",
    content:
      "Yes! Quantum computing is being explored in areas like cryptography, drug discovery, financial modeling, and optimization problems.",
    timestamp: new Date("2025-05-21T10:00:20Z"),
  },
  {
    id: 9,
    role: "user",
    content: "That's amazing. Thanks for breaking it down simply!",
    timestamp: new Date("2025-05-21T10:00:23Z"),
  },
  {
    id: 10,
    role: "assistant",
    content:
      "You're welcome! Let me know if you’d like to go deeper into any topic.",
    timestamp: new Date("2025-05-21T10:00:25Z"),
  },
  {
    id: 11,
    role: "assistant",
    content:
      "You're welcome! Let me know if you’d like to go deeper into any topic.",
    timestamp: new Date("2025-05-21T10:00:25Z"),
  },
  {
    id: 12,
    role: "assistant",
    content:
      "You're welcome! Let me know if you’d like to go deeper into any topic.",
    timestamp: new Date("2025-05-21T10:00:25Z"),
  },
  {
    id: 13,
    role: "assistant",
    content:
      "You're welcome! Let me know if you’d like to go deeper into any topic.",
    timestamp: new Date("2025-05-21T10:00:25Z"),
  },
];
