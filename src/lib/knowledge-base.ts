export interface KnowledgeBase {
  personal: PersonalInfo;
  professional: ProfessionalInfo;
  skills: SkillsInfo;
  projects: ProjectInfo[];
  personality: PersonalityTraits;
  education: EducationInfo;
  interests: InterestInfo;
  contact: ContactInfo;
  achievements: AchievementInfo[];
  workStyle: WorkStyleInfo;
}

export interface PersonalInfo {
  name: string;
  fullName: string;
  location: string;
  age?: number;
  languages: string[];
  background: string;
}

export interface ProfessionalInfo {
  title: string;
  experience: string;
  focus: string[];
  workHistory: WorkExperience[];
  currentRole: string;
}

export interface SkillsInfo {
  technical: string[];
  soft: string[];
  tools: string[];
  frameworks: string[];
  databases: string[];
  cloud: string[];
  ai: string[];
}

export interface ProjectInfo {
  title: string;
  description: string;
  tools: string[];
  url: string;
  image: string;
  highlights: string[];
}

export interface PersonalityTraits {
  core: string[];
  workStyle: string[];
  communication: string[];
  problemSolving: string[];
  leadership: string[];
}

export interface EducationInfo {
  degree: string;
  institution: string;
  field: string;
  highlights: string[];
}

export interface InterestInfo {
  hobbies: string[];
  passions: string[];
  goals: string[];
  learning: string[];
}

export interface ContactInfo {
  email: string;
  github: string;
  linkedin: string;
  twitter: string;
  resume: string;
}

export interface AchievementInfo {
  title: string;
  description: string;
  impact: string;
  year?: number;
}

export interface WorkExperience {
  role: string;
  company: string;
  duration: string;
  highlights: string[];
}

export interface WorkStyleInfo {
  approach: string[];
  strengths: string[];
  collaboration: string[];
  innovation: string[];
}

export const akshitKnowledgeBase: KnowledgeBase = {
  personal: {
    name: "Akshit",
    fullName: "Akshit Dayal",
    location: "Uttiramerur",
    languages: ["English", "Japanese", "Hindi", "Telugu"],
    background: "A passionate technology enthusiast with a love for creating solutions that help make this world a better place. Full-stack developer with startup experience and AI integration expertise."
  },

  professional: {
    title: "Full-Stack Developer & AI Enthusiast",
    experience: "Worked with multiple startups and currently leveraging the power of AI to build beautiful things",
    focus: ["AI Integration", "Web Development", "Mobile Apps", "Startup Experience", "Full-Stack Development"],
    workHistory: [
      {
        role: "Full-Stack Developer",
        company: "Various Startups",
        duration: "Multiple roles",
        highlights: [
          "Built web and mobile applications from scratch",
          "Wore multiple hats in fast-paced startup environments",
          "Learned various tools and technologies quickly",
          "Integrated AI capabilities into applications"
        ]
      }
    ],
    currentRole: "Full-Stack Developer focusing on AI integration"
  },

  skills: {
    technical: [
      "JavaScript", "TypeScript", "Python", "Java", "HTML", "CSS",
      "React", "Next.js", "Angular", "Node.js", "Android Development"
    ],
    soft: [
      "Problem Solving", "Quick Learning", "Adaptability", "Communication",
      "Team Collaboration", "Self-Management", "Leadership"
    ],
    tools: [
      "Git", "VS Code", "Android Studio", "Firebase", "Vercel",
      "Supabase", "HuggingFace", "TensorFlow"
    ],
    frameworks: [
      "Next.js", "React", "Angular", "Tailwind CSS", "Bootstrap"
    ],
    databases: [
      "Firebase", "Supabase", "NoSQL", "SQL"
    ],
    cloud: [
      "Vercel", "Firebase", "Cloud Computing"
    ],
    ai: [
      "Machine Learning", "TensorFlow", "Scikit-Learn", "HuggingFace",
      "Prompt Engineering", "AI Integration"
    ]
  },

  projects: [
    {
      title: "organAIze",
      description: "Optimize your daily routine with AI",
      tools: ["Next.js", "HuggingFace", "Prompt Engineering", "Tailwind", "TypeScript"],
      url: "https://organaize.vercel.app/",
      image: "assets/portfolio/organaize/organaize.png",
      highlights: [
        "AI-powered daily routine optimization",
        "Advanced prompt engineering",
        "Modern Next.js architecture",
        "Beautiful UI with Tailwind CSS"
      ]
    },
    {
      title: "Ishaare!",
      description: "Heads Up game but for Indians",
      tools: ["Next.js", "Supabase", "Tailwind", "TypeScript", "Vercel"],
      url: "https://ishaaregame.vercel.app/",
      image: "assets/portfolio/ishaare/ishaare.png",
      highlights: [
        "Cultural adaptation of popular game",
        "Real-time multiplayer functionality",
        "Modern web technologies",
        "Scalable architecture"
      ]
    },
    {
      title: "Real Among Us",
      description: "Play with friends while performing tasks in real life",
      tools: ["Angular", "Firebase", "NoSQL", "Tailwind", "HTML", "CSS"],
      url: "https://akrypt.github.io/amongus_real",
      image: "assets/portfolio/amongus/login.png",
      highlights: [
        "Real-world game adaptation",
        "Real-time synchronization",
        "Mobile-responsive design",
        "Innovative gameplay mechanics"
      ]
    },
    {
      title: "Handpose",
      description: "Classifies your hand gestures",
      tools: ["Machine Learning", "Tensorflow", "Scikit-Learn", "Python"],
      url: "https://github.com/AkRypt/handpose",
      image: "assets/portfolio/handpose/hand.jpg",
      highlights: [
        "Computer vision implementation",
        "Machine learning model training",
        "Real-time gesture recognition",
        "Python-based AI solution"
      ]
    },
    {
      title: "Venue Reservation",
      description: "System to reserve venues for events and prevent collisions",
      tools: ["Android Studio", "Firebase", "Java", "XML", "Android"],
      url: "https://github.com/AkRypt/VenueBookingAppHITAM",
      image: "assets/portfolio/venue/login_sq.jpeg",
      highlights: [
        "Full Android application",
        "Real-time booking system",
        "Conflict prevention logic",
        "User-friendly interface"
      ]
    },
    {
      title: "Toastmasters",
      description: "Facilitate toastmasters meetings with this useful app",
      tools: ["Android Studio", "Firebase", "Java", "XML", "Android"],
      url: "https://github.com/AkRypt/HITAMToastmastersApp",
      image: "assets/portfolio/tm/splashscreen.jpeg",
      highlights: [
        "Meeting facilitation tools",
        "Timer and tracking features",
        "Professional development focus",
        "Community-oriented design"
      ]
    }
  ],

  personality: {
    core: [
      "Passionate about technology and innovation",
      "Self-starter with founder mentality",
      "Quick learner and adaptable",
      "Problem-solver with analytical thinking",
      "Confident but not cocky",
      "Kind and collaborative"
    ],
    workStyle: [
      "Architect-level thinking",
      "No need for micromanagement",
      "Takes ownership of projects",
      "Learns new technologies quickly",
      "Wears multiple hats effectively",
      "Focuses on scalable solutions"
    ],
    communication: [
      "Clear and concise",
      "Technical and non-technical audiences",
      "Collaborative approach",
      "Active listener"
    ],
    problemSolving: [
      "Analytical approach",
      "Creative solutions",
      "Systematic thinking",
      "Quick iteration"
    ],
    leadership: [
      "Natural leader",
      "Mentors others",
      "Takes initiative",
      "Builds consensus"
    ]
  },

  education: {
    degree: "Master of Science in Computer Science",
    institution: "New Jersey Institute of Technology",
    field: "Computer Science",
    highlights: [
      "Data Structures and Algorithms",
      "Cloud Computing",
      "Object Oriented Programming",
      "Clean Architecture",
      "Advanced software engineering principles"
    ]
  },

  interests: {
    hobbies: ["Dance", "Toastmasters", "Video Games", "Psychology"],
    passions: [
      "Technology innovation",
      "AI and machine learning",
      "Building solutions that help people",
      "Continuous learning and improvement"
    ],
    goals: [
      "Create impactful technology solutions",
      "Lead innovative projects",
      "Contribute to making the world better",
      "Stay ahead in evolving tech industry"
    ],
    learning: [
      "Always exploring new technologies",
      "Staying updated with AI advancements",
      "Learning from startup experiences",
      "Improving technical and soft skills"
    ]
  },

  contact: {
    email: "akshit.dayal@example.com", // Update with actual email
    github: "https://www.github.com/akrypt",
    linkedin: "https://www.linkedin.com/in/akshit-u",
    twitter: "https://www.x.com/AkshitDayal8",
    resume: "assets/AkshitU_SE.pdf"
  },

  achievements: [
    {
      title: "AI Integration Expert",
      description: "Successfully integrated AI capabilities into multiple projects",
      impact: "Demonstrated cutting-edge technology implementation"
    },
    {
      title: "Startup Experience",
      description: "Worked with multiple startups, adapting to fast-paced environments",
      impact: "Proven ability to handle diverse challenges and wear multiple hats"
    },
    {
      title: "Full-Stack Development",
      description: "Built complete web and mobile applications from scratch",
      impact: "End-to-end development capabilities"
    },
    {
      title: "Multilingual Developer",
      description: "Fluent in English, Japanese, Hindi, and Telugu",
      impact: "Global communication and collaboration capabilities"
    }
  ],

  workStyle: {
    approach: [
      "Architect-level thinking from the start",
      "Scalable and maintainable solutions",
      "Quick prototyping and iteration",
      "Focus on user experience and impact"
    ],
    strengths: [
      "Rapid learning of new technologies",
      "Self-directed and autonomous work",
      "Strong problem-solving abilities",
      "Excellent communication skills"
    ],
    collaboration: [
      "Works well in teams",
      "Mentors and helps others grow",
      "Takes initiative on projects",
      "Builds consensus and drives results"
    ],
    innovation: [
      "Always exploring cutting-edge technologies",
      "Creative problem-solving approach",
      "Willing to take calculated risks",
      "Focuses on practical, impactful solutions"
    ]
  }
};

// Helper function to get specific information
export function getKnowledgeSection(section: keyof KnowledgeBase) {
  return akshitKnowledgeBase[section];
}

// Helper function to search knowledge base
export function searchKnowledge(query: string): unknown {
  const queryLower = query.toLowerCase();
  
  // Search through different sections
  const results = [];
  
  // Search in personal info
  if (queryLower.includes('name') || queryLower.includes('who')) {
    results.push(akshitKnowledgeBase.personal);
  }
  
  // Search in skills
  if (queryLower.includes('skill') || queryLower.includes('technology') || queryLower.includes('tech')) {
    results.push(akshitKnowledgeBase.skills);
  }
  
  // Search in projects
  if (queryLower.includes('project') || queryLower.includes('work') || queryLower.includes('build')) {
    results.push(akshitKnowledgeBase.projects);
  }
  
  // Search in personality
  if (queryLower.includes('personality') || queryLower.includes('character') || queryLower.includes('style')) {
    results.push(akshitKnowledgeBase.personality);
  }
  
  return results;
} 