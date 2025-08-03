"use client"

import { motion } from "framer-motion"
import { siteConfig } from "@/config/site"
import { 
  Github, 
  Linkedin, 
  Twitter, 
  ExternalLink,
  Code,
  Database,
  Bot,
  Languages,
  School,
  Globe,
  Heart
} from "lucide-react"

export default function Home() {
  return (
    <div className="pt-[10%] md:pt-[8%] min-h-screen relative bg-[url('/assets/img/port_bg.png')] bg-contain bg-opacity-40">
      {/* Navigation */}
      <nav className="px-2 md:px-10 fixed top-0 w-full z-50">
        <div className="relative">
          {/* Gradient Bottom Border */}
          <div className="mx-6 rounded-lg absolute inset-0.5 bg-gradient-to-r from-grad-start via-purple-500 to-grad-end blur"></div>
          {/* Navbar Contents */}
          <div className="flex flex-wrap items-center justify-between p-2 md:py-4 md:px-8 min-w-screen relative bg-gradient-to-r from-gray-950 via-black to-gray-950">
            {/* Logo and Name */}
            <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
              <img src="/assets/img/a_logo.png" className="h-8" alt="Akshit Logo" />
              <div className="relative">
                <p className="absolute translate-x-0.5 -translate-y-0.5 text-lg blur-[2px] font-bold tracking-[0.2rem] bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-500 text-transparent bg-clip-text">
                  Akshit
                </p>
                <h1 className="text-lg font-bold tracking-[0.2rem] relative">Akshit</h1>
              </div>
            </a>

            {/* Menu Items */}
            <div className="flex items-center">
              <a lang="ja" href="ja/index.html" className="mr-4 text-xl font-bold bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-500 text-transparent bg-clip-text">
                日本語
              </a>
              <div className="hidden w-full md:block md:w-auto" id="navbar-default">
                <ul className="font-medium flex flex-col justify-center items-center p-4 md:p-0 mt-4 rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0">
                  <li>
                    <a href="#" className="px-2 py-1 rounded-lg hover:bg-white">
                      <span className="font-bold bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-500 text-transparent bg-clip-text">
                        Home
                      </span>
                    </a>
                    <div className="md:hidden w-full h-0.5 my-2 bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-500 rounded-full"></div>
                  </li>
                  <li>
                    <a href="#projects" className="px-2 py-1 rounded-lg hover:bg-white">
                      <span className="font-bold bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-500 text-transparent bg-clip-text">
                        Projects
                      </span>
                    </a>
                    <div className="md:hidden w-full h-0.5 my-2 bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-500 rounded-full"></div>
          </li>
                  <li>
                    <a href="#tech" className="px-2 py-1 rounded-lg hover:bg-white">
                      <span className="font-bold bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-500 text-transparent bg-clip-text">
                        Tools
                      </span>
                    </a>
                    <div className="md:hidden w-full h-0.5 my-2 bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-500 rounded-full"></div>
          </li>
                  <li>
                    <a href="#about" className="px-2 py-1 rounded-lg hover:bg-white">
                      <span className="font-bold bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-500 text-transparent bg-clip-text">
                        About
                      </span>
                    </a>
                    <div className="md:hidden w-full h-0.5 my-2 bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-500 rounded-full"></div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="flex flex-col px-4 md:px-20 pt-10 md:flex-row overflow-hidden justify-between">
        {/* Intro */}
        <div className="flex flex-col md:mr-10 md:w-[40%]">
          {/* Name */}
          <h2 className="text-2xl">Hi, I&apos;m</h2>
          <div className="relative">
            <p className="absolute translate-x-0.5 md:translate-x-1 -translate-y-0.5 md:-translate-y-1 text-3xl md:text-6xl blur-[2px] font-bold tracking-[0.2rem] bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-500 text-transparent bg-clip-text">
              Akshit Dayal
            </p>
            <h1 className="text-3xl md:text-6xl font-bold tracking-[0.2rem] animate-blink relative">Akshit Dayal</h1>
          </div>
          <div className="relative">
            <p className="absolute translate-x-0.5 md:translate-x-1 -translate-y-0.5 md:-translate-y-1 text-3xl md:text-6xl blur-sm font-bold tracking-[0.5rem] bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-500 text-transparent bg-clip-text">
              Uttiramerur
            </p>
            <h1 className="text-3xl md:text-6xl font-bold tracking-[0.5rem] relative">Uttiramerur</h1>
          </div>

          {/* Separation Line */}
          <div className="max-w-md h-[1px] bg-borderg my-4 opacity-50"></div>
          {/* Description */}
          <h2 id="description" className="text-md md:text-xl text-gray-200">
            A Full-Stack Developer who has worked with multiple startups 
            and currently leveraging the power of AI to build beautiful things
          </h2>
          {/* Resume */}
          <a className="relative my-10 max-w-sm" href="/assets/AkshitU_SE.pdf" target="_blank" download="AkshitU_SE.pdf">
            <div className="rounded-lg absolute -inset-0.5 max-w-md bg-gradient-to-br from-grad-start to-grad-end blur animate-tilt"></div>
            <div className="rounded-xl p-3 max-w-md bg-backg relative text-center hover:bg-white z-20">
              <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent text-2xl font-bold">
                Download Resume
              </span>
            </div>
          </a>
        </div>

        {/* Contact Info */}
        <div className="flex md:mr-[8%] mt-8 md:mt-0 mb-10 px-4 py-2 md:p-2 md:h-[25vw] md:w-[25vw] aspect-square justify-center items-center relative">
          {/* Spinning circle background */}
          <div className="flex justify-center w-full h-full absolute">
            <div className="flex justify-center items-center w-full h-full relative">
              <div className="w-[110%] h-[110%] shadow-lg shadow-pink-500 bg-transparent rounded-full absolute animate-spin_right"></div>
              <div className="w-[108%] h-[108%] shadow-lg shadow-violet-500 bg-transparent rounded-full absolute animate-spin_left"></div>
              <div className="w-[106%] h-[106%] shadow-lg shadow-cyan-500 bg-transparent rounded-full absolute animate-spin_right_fast"></div>
            </div>
          </div>

          <div className="relative md:m-8">
            <div className="grid grid-cols-2 gap-6">
              <a href={siteConfig.links.github} target="_blank" className="flex flex-col p-6 px-14 shadow-sm md:h-[120px] shadow-borderg hover:border-transparent rounded-lg justify-center items-center duration-100 ease-in-out transform hover:shadow-pink-500 hover:shadow-lg hover:scale-[110%]">
                <Github className="w-7 h-7" />
                <p className="mt-1">GitHub</p>
              </a>
              <a href={siteConfig.links.linkedin} target="_blank" className="flex flex-col p-6 px-14 shadow-sm md:h-[120px] shadow-borderg hover:border-transparent rounded-lg justify-center items-center duration-100 ease-in-out transform hover:shadow-pink-500 hover:shadow-lg hover:scale-[110%]">
                <Linkedin className="w-7 h-7" />
                <p className="mt-1">LinkedIn</p>
              </a>
              <a href={siteConfig.links.twitter} target="_blank" className="flex flex-col col-span-2 h-[60px] shadow-sm shadow-borderg hover:border-transparent rounded-lg justify-center items-center duration-100 ease-in-out transform hover:shadow-pink-500 hover:shadow-lg hover:scale-[110%]">
                <Twitter className="w-6 h-6" />
                <p className="mt-1">X.com</p>
              </a>
              <a href={siteConfig.links.kaggle} target="_blank" className="flex flex-col p-6 px-14 shadow-sm md:h-[120px] shadow-borderg hover:border-transparent rounded-lg justify-center items-center duration-100 ease-in-out transform hover:shadow-pink-500 hover:shadow-lg hover:scale-[110%]">
                <Database className="w-7 h-7" />
                <p className="mt-1">Kaggle</p>
              </a>
              <a href={siteConfig.links.medium} target="_blank" className="flex flex-col p-6 px-14 shadow-sm md:h-[120px] shadow-borderg hover:border-transparent rounded-lg justify-center items-center duration-100 ease-in-out transform hover:shadow-pink-500 hover:shadow-lg hover:scale-[110%]">
                <Globe className="w-7 h-7" />
                <p className="mt-1">Medium</p>
              </a>
            </div>
            <p className="text-lg mt-4 text-center font-sans tracking-[0.1rem]">{siteConfig.links.email}</p>
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div id="projects" className="mb-[100px]"></div>
      <div className="w-full px-2 md:px-20">
        {/* Section Title */}
        <div className="max-w-max">
          <h2 className="max-w-max text-3xl font-bold">Projects</h2>
          <div className="h-1 mt-1 w-full bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-500"></div>
        </div>

        {/* Projects Grid */}
        <div id="projContainer" className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-10">
          {siteConfig.projects.map((project, index) => (
            <a key={project.title} href={project.url} id={project.title} target="_blank" className="w-full h-[38vh] md:h-[64vh] bg-transparent overflow-hidden flex flex-col justify-center items-center rounded-lg relative">
              <div className="bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-500 w-[70%] h-[140%] absolute blur animate-spin_right_slow"></div>
              <div className="w-[98%] h-[98%] bg-gradient-to-br from-black via-gray-900 group to-black p-2 md:p-4 md:px-6 rounded-lg relative overflow-hidden hover:from-white hover:to-white">
                <p className="text-sm md:text-2xl font-bold bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-500 bg-clip-text text-transparent">
                  {project.title}
                </p>
                <div className="w-full h-[50%] md:h-[70%] my-4 p-4 rounded-xl bg-gradient-to-br from-black via-gray-900 to-black hidden group-hover:block">
                  <p className="text-sm md:text-lg font-semibold bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-500 bg-clip-text text-transparent">
                    {project.tools}
                  </p>
                </div>
                <img src={project.image} alt={project.title} className="w-full h-[50%] md:h-[70%] my-4 object-cover rounded-xl group-hover:hidden" />
                <p className="text-[75%] md:text-lg mb-4 font-bold bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-500 bg-clip-text text-transparent">
                  {project.desc}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* More on GitHub */}
      <div className="flex justify-center items-center md:mt-10">
        <a href={siteConfig.links.github} target="_blank" className="w-[90%] h-[60px] md:h-[100px] mt-10 md:mt-0 overflow-hidden flex justify-center items-center rounded-lg relative">
          <div className="w-[200%] bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-500 rounded-full aspect-square absolute animate-spin_right_fast"></div>
          <div className="flex justify-center items-center w-[98%] h-[96%] bg-gradient-to-br from-black via-gray-900 to-black p-4 rounded-lg relative hover:bg-white">
            <p className="mr-4 text-lg md:text-2xl text-center font-bold bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-500 bg-clip-text text-transparent">
              More on my
              <span className="animate-blink"> GitHub</span>
            </p>
            <ExternalLink className="w-8 h-8 text-gray-400" />
          </div>
        </a>
      </div>

      {/* Technologies Section */}
      <div id="tech" className="mb-[100px]"></div>
      <div className="px-10 md:px-20 mt-[100px]">
        {/* Section Title */}
        <div className="max-w-max">
          <h2 className="max-w-max text-3xl font-bold">Tools & Technologies</h2>
          <div className="h-1 mt-1 w-full bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-500"></div>
        </div>

        <div className="flex flex-col md:flex-row justify-center md:space-x-10 mt-10">
          {/* Front End */}
          <div className="relative w-full md:w-[30%] h-[100%]">
            <div className="absolute inset-0 rounded-lg -translate-x-1 translate-y-1 bg-gradient-to-br from-pink-500 via-cyan-500 to-violet-500"></div>
            <div className="relative bg-backg rounded-lg p-4">
              <div className="flex items-center justify-center mx-4">
                <div className="h-1 mr-4 w-[10%] bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-500 rounded-lg"></div>
                <Code className="w-7 h-7" />
                <p className="ml-2 text-2xl">Front End</p>
                <div className="h-1 ml-4 w-[10%] bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-500 rounded-lg"></div>
              </div>
              <p className="mt-2">{siteConfig.skills.frontend.join(", ")}</p>
            </div>
          </div>

          {/* Back End */}
          <div className="relative w-full md:w-[30%] h-[100%] mt-10 md:mt-0">
            <div className="absolute inset-0 rounded-lg -translate-x-1 translate-y-1 bg-gradient-to-br from-pink-500 via-cyan-500 to-violet-500"></div>
            <div className="relative bg-backg rounded-lg p-4">
              <div className="flex items-center justify-center mx-4">
                <div className="h-1 mr-4 w-[10%] bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-500 rounded-lg"></div>
                <Database className="w-7 h-7" />
                <p className="ml-2 text-2xl">Back End</p>
                <div className="h-1 ml-4 w-[10%] bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-500 rounded-lg"></div>
              </div>
              <p className="mt-2">{siteConfig.skills.backend.join(", ")}</p>
            </div>
          </div>

          {/* Databases */}
          <div className="relative w-full md:w-[30%] h-[100%] mt-10 md:mt-0">
            <div className="absolute inset-0 rounded-lg -translate-x-1 translate-y-1 bg-gradient-to-br from-pink-500 via-cyan-500 to-violet-500"></div>
            <div className="relative bg-backg rounded-lg p-4">
              <div className="flex items-center justify-center mx-4">
                <div className="h-1 mr-4 w-[10%] bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-500 rounded-lg"></div>
                <Database className="w-7 h-7" />
                <p className="ml-2 text-2xl">DB/Cloud</p>
                <div className="h-1 ml-4 w-[10%] bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-500 rounded-lg"></div>
              </div>
              <p className="mt-2">{siteConfig.skills.database.join(", ")}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-center md:space-x-10 mt-10">
          {/* Artificial Intelligence */}
          <div className="relative w-full md:w-[30%] h-[100%]">
            <div className="absolute inset-0 rounded-lg -translate-x-1 translate-y-1 bg-gradient-to-br from-pink-500 via-cyan-500 to-violet-500"></div>
            <div className="relative bg-backg rounded-lg p-4">
              <div className="flex items-center justify-center mx-4">
                <div className="h-1 mr-4 w-[10%] bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-500 rounded-lg"></div>
                <Bot className="w-7 h-7" />
                <p className="ml-2 text-2xl">AI/ML/NLP</p>
                <div className="h-1 ml-4 w-[10%] bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-500 rounded-lg"></div>
              </div>
              <p className="mt-2">{siteConfig.skills.ai.join(", ")}</p>
            </div>
          </div>

          {/* Languages */}
          <div className="relative w-full md:w-[30%] h-[100%] mt-10 md:mt-0">
            <div className="absolute inset-0 rounded-lg -translate-x-1 translate-y-1 bg-gradient-to-br from-pink-500 via-cyan-500 to-violet-500"></div>
            <div className="relative bg-backg rounded-lg p-4">
              <div className="flex items-center justify-center mx-4">
                <div className="h-1 mr-4 w-[10%] bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-500 rounded-lg"></div>
                <Languages className="w-7 h-7" />
                <p className="ml-2 text-2xl">Languages</p>
                <div className="h-1 ml-4 w-[10%] bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-500 rounded-lg"></div>
              </div>
              <p className="mt-2">{siteConfig.skills.languages.join(", ")}</p>
            </div>
          </div>

          {/* Computer Science */}
          <div className="relative w-full md:w-[30%] h-[100%] mt-10 md:mt-0">
            <div className="absolute inset-0 rounded-lg -translate-x-1 translate-y-1 bg-gradient-to-br from-pink-500 via-cyan-500 to-violet-500"></div>
            <div className="relative bg-backg rounded-lg p-4">
              <div className="flex items-center justify-center mx-4">
                <div className="h-1 mr-2 w-[10%] bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-500 rounded-lg"></div>
                <Code className="w-7 h-7" />
                <p className="ml-2 text-xl">Computer Science</p>
                <div className="h-1 ml-2 w-[10%] bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-500 rounded-lg"></div>
              </div>
              <p className="mt-2">{siteConfig.skills.cs.join(", ")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* About me Section */}
      <div id="about" className="mb-[100px]"></div>
      <div className="px-10 md:px-20 md:mt-[20px]">
        {/* Section Title */}
        <div className="max-w-max">
          <h2 className="max-w-max text-3xl font-bold">About Me</h2>
          <div className="h-1 mt-1 w-full bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-500"></div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mt-0 md:mt-10">
          {/* Right Side */}
          <div className="w-full mt-6 md:mt-0">
            <p className="text-gray-700 dark:text-gray-300">
              I am a passionate technology enthusiast with a love for creating solutions that help in making this world a ✨ better place ✨. My expertise lies in creating web and mobile apps at startups, which makes me familiar with having to wear different hats and learning various tools quickly. I enjoy constantly improving my skills to stay ahead in the ever-evolving tech industry.
            </p>
            <div className="flex mt-6">
              <School className="w-6 h-6" />
              <p className="ml-4 px-4 rounded-xl border-2 border-red-500">{siteConfig.education.school}</p>
            </div>
            <div className="flex mt-6">
              <Code className="w-6 h-6" />
              <p className="ml-4 px-4 rounded-xl border-2 border-blue-500">{siteConfig.education.degree}</p>
            </div>
            <div className="flex mt-6">
              <Globe className="w-6 h-6" />
              <p className="ml-4 px-4 rounded-xl border-2 border-indigo-500">{siteConfig.languages.join(", ")}</p>
            </div>
            <div className="flex mt-6">
              <Heart className="w-6 h-6" />
              <p className="ml-4 px-4 rounded-xl border-2 border-purple-500">{siteConfig.interests.join(", ")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full relative mt-[100px]">
        {/* Gradient Bottom Border */}
        <div className="rounded-lg absolute inset-0.5 bg-gradient-to-r from-grad-start via-purple-500 to-grad-end blur"></div>
        <div className="flex py-10 px-4 md:px-10 justify-between items-center w-full relative bg-gradient-to-r from-gray-950 via-black to-gray-950">
          <p>Made by Akshit 👾</p>

          {/* Icons */}
          <div className="flex justify-center items-center space-x-4">
            <a href={siteConfig.links.github} target="_blank">
              <Github className="w-8 h-8" />
            </a>
            <a href={siteConfig.links.linkedin} target="_blank">
              <Linkedin className="w-8 h-8" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
