export const links = {
  email: "akshitdayal99@gmail.com",
  github: "https://github.com/akrypt",
  linkedin: "https://www.linkedin.com/in/akshit-u",
  x: "https://www.x.com/AkshitDayal8",
  resume: "/assets/resume/AkshitU_2026_AI_SE.pdf",
}

export const hero = {
  kicker: "Akshit Dayal — Software Engineer, New York",
  lines: ["Ideas don't count", "until they ship."],
  sub: "I work with leadership to decide what's worth building, then direct AI to build it fast and to a standard I'd sign my name to. Customer features, internal tools, and AI assistants wired into the systems a business already runs on.",
}

export const stats = [
  { value: "+19%", label: "sales lift from a customer feature I designed and built" },
  { value: "6+ yrs", label: "shipping production software, from startups to a national retailer" },
  { value: "CIO", label: "my direct partner on the company's flagship projects" },
]

export type CaseFile = {
  index: string
  kanji: string
  reading: string
  title: string
  ask: string
  move: string
  result: string
  accent: "pink" | "cyan" | "amber" | "violet"
}

export const cases: CaseFile[] = [
  {
    index: "01",
    kanji: "売上",
    reading: "uriage · revenue",
    title: "Features that sell",
    ask: "Leadership wanted shoppers to buy with more confidence, without adding friction to the store.",
    move: "Partnered with the CIO to design a new shopping experience and built it end to end as the only engineer, from first prototype to launch.",
    result: "Sales up 19% after launch.",
    accent: "pink",
  },
  {
    index: "02",
    kanji: "人工知能",
    reading: "jinkō chinō · AI",
    title: "Assistants that know the business",
    ask: "Teams needed real answers from inventory, sales and product data, without waiting on an analyst.",
    move: "Designed a company-wide AI assistant on top of the existing data warehouse, with our own integration layer and orchestration. I set the direction for the company's internal and customer-facing AI tools.",
    result: "Anyone in the company can ask the business a question and get a straight answer.",
    accent: "violet",
  },
  {
    index: "03",
    kanji: "接続",
    reading: "setsuzoku · connection",
    title: "Old systems, new life",
    ask: "A legacy platform the business depended on, but couldn't move fast on.",
    move: "Rebuilt it on a modern stack in the cloud, connected it to the tools teams already use, and gave non-engineers the controls to run their own content.",
    result: "A platform the business can build on, and teams that don't wait on engineering.",
    accent: "cyan",
  },
]

export const opsNote = "I also own what I build after it ships: infrastructure, monitoring, and the data that tells us whether it worked."

export const method = {
  headline: ["I drive the AI.", "The quality is on me."],
  rules: [
    {
      title: "Start with the business.",
      body: "Before any code, I get clear with leadership on what we need and how we'll know it worked.",
    },
    {
      title: "Direct AI like a team.",
      body: "I break the work into sharp specs and put AI on the volume: scaffolding, tests, integrations. That's how one engineer ships what usually takes a team.",
    },
    {
      title: "Review every line.",
      body: "Nothing ships because a model wrote it. Architecture, edge cases and code quality get my full attention.",
    },
    {
      title: "Done means it moved a number.",
      body: "Deployed isn't done. It's done when the thing it was built to change has changed.",
    },
  ],
}

export const timeline = [
  {
    when: "2024 — now",
    where: "FULLBEAUTY Brands",
    role: "Full-Stack Developer · New York",
    what: "Work directly with leadership on customer features and company-wide AI tools. Sole engineer on a launch that lifted sales 19%.",
  },
  {
    when: "2023 — 2024",
    where: "Sri Infotech",
    role: "Full-Stack Developer · Remote, NJ",
    what: "Led the team that shipped an employee portal on Azure, React and Node. Designed its microservices and APIs.",
  },
  {
    when: "2022 — 2023",
    where: "New Jersey Institute of Technology",
    role: "M.S. Computer Science · GPA 3.8",
    what: "Machine learning, deep learning, cloud computing, data structures and algorithms.",
  },
  {
    when: "2021",
    where: "BuzyGo",
    role: "Software Development Engineer · Hyderabad",
    what: "Led the customer e-commerce portal. Put tests in front of every release and post-release defects dropped 30%.",
  },
  {
    when: "2020",
    where: "Xlenz",
    role: "Software Engineer · Hyderabad",
    what: "Built the cross-platform app for an augmented-reality startup, reporting straight to the CEO.",
  },
]

export const projects = [
  {
    title: "organAIze",
    line: "Tell it what your day looks like. Get back a schedule that actually fits.",
    tools: ["Next.js", "Hugging Face", "TypeScript"],
    image: "/assets/portfolio/organaize/organaize.png",
    url: "https://organaize.vercel.app/",
  },
  {
    title: "Ishaare!",
    line: "Heads Up, rebuilt for Indian game nights. Made because my friends needed it.",
    tools: ["Next.js", "Supabase", "Tailwind"],
    image: "/assets/portfolio/ishaare/ishaare.png",
    url: "https://ishaaregame.vercel.app/",
  },
  {
    title: "Handpose",
    line: "A hand-sign detection model running live in the browser, straight off your webcam.",
    tools: ["TensorFlow", "React", "Python"],
    image: "/assets/portfolio/handpose/hand.jpg",
    url: "https://akrypt.github.io/handpose",
  },
]

export const toolbox = [
  ["TypeScript", "Next.js", "React", "NestJS", "Node", "Python", "Java", "Angular", "React Native", "Flutter", "GraphQL", "Redux"],
  ["AWS", "Snowflake", "PostgreSQL", "MongoDB", "DynamoDB", "Supabase", "GCP", "MCP", "LLM orchestration", "CI/CD", "Jest", "Microservices"],
]

export const sections = [
  { id: "top", kanji: "始", label: "Start" },
  { id: "work", kanji: "仕事", label: "Work" },
  { id: "method", kanji: "方法", label: "Method" },
  { id: "path", kanji: "経歴", label: "Path" },
  { id: "projects", kanji: "作品", label: "Projects" },
  { id: "contact", kanji: "連絡", label: "Contact" },
]
