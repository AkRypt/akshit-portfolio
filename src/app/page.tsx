"use client"


import { siteConfig } from "@/config/site"
import Image from "next/image"
import {
  ExternalLink,
  Code,
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
              <Image src="/assets/img/a_logo.png" width={32} height={32} className="h-8" alt="Akshit Logo" />
              <div className="relative">
                <p className="absolute translate-x-0.5 -translate-y-0.5 text-lg blur-[2px] font-bold tracking-[0.2rem] bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-500 text-transparent bg-clip-text">
                  Akshit
                </p>
                <h1 className="text-lg font-bold tracking-[0.2rem] relative">Akshit</h1>
              </div>
            </a>

            {/* Menu Items */}
            <div className="flex items-center">
              {/* <a lang="ja" href="ja/index.html" className="mr-4 text-xl font-bold bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-500 text-transparent bg-clip-text">
                日本語
              </a> */}
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
            <p
              className="absolute translate-x-0.5 md:translate-x-1 -translate-y-0.5 md:-translate-y-1 text-3xl md:text-6xl blur-sm font-bold tracking-[0.5rem] bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-500 text-transparent bg-clip-text">
              Uttiramerur</p>
            <h1 className="text-3xl md:text-6xl font-bold tracking-[0.5rem] relative">Uttiramerur</h1>
          </div>

          {/* Separation Line */}
          <div className="max-w-md h-[1px] bg-borderg my-4 opacity-50"></div>
          {/* Description */}
          <h2 id="description" className="text-md md:text-xl text-gray-200">
            Software Engineer enabling business intelligence through AI agents and tool-augmented LLMs. 
            Full-Stack Developer with startup experience, currently leveraging the power of AI to build intelligent solutions.
            <span className="block mt-2 text-sm text-gray-400">
              💡 <span className="text-pink-400">Try asking my AI assistant</span> about my skills, projects, or experience!
            </span>
          </h2>
          {/* Resume */}
          <a className="relative my-10 max-w-sm" href="/assets/resume/AkshitU_2025_SE_AI.pdf" target="_blank" download="AkshitU_2025_SE_AI.pdf">
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
                <svg viewBox="0 0 128 128" width="28" height="28" fill="white" stroke="white">
                  <g fill="white">
                    <path fillRule="evenodd" clipRule="evenodd"
                      d="M64 5.103c-33.347 0-60.388 27.035-60.388 60.388 0 26.682 17.303 49.317 41.297 57.303 3.017.56 4.125-1.31 4.125-2.905 0-1.44-.056-6.197-.082-11.243-16.8 3.653-20.345-7.125-20.345-7.125-2.747-6.98-6.705-8.836-6.705-8.836-5.48-3.748.413-3.67.413-3.67 6.063.425 9.257 6.223 9.257 6.223 5.386 9.23 14.127 6.562 17.573 5.02.542-3.903 2.107-6.568 3.834-8.076-13.413-1.525-27.514-6.704-27.514-29.843 0-6.593 2.36-11.98 6.223-16.21-.628-1.52-2.695-7.662.584-15.98 0 0 5.07-1.623 16.61 6.19C53.7 35 58.867 34.327 64 34.304c5.13.023 10.3.694 15.127 2.033 11.526-7.813 16.59-6.19 16.59-6.19 3.287 8.317 1.22 14.46.593 15.98 3.872 4.23 6.215 9.617 6.215 16.21 0 23.194-14.127 28.3-27.574 29.796 2.167 1.874 4.097 5.55 4.097 11.183 0 8.08-.07 14.583-.07 16.572 0 1.607 1.088 3.49 4.148 2.897 23.98-7.994 41.263-30.622 41.263-57.294C124.388 32.14 97.35 5.104 64 5.104z">
                    </path>
                    <path
                      d="M26.484 91.806c-.133.3-.605.39-1.035.185-.44-.196-.685-.605-.543-.906.13-.31.603-.395 1.04-.188.44.197.69.61.537.91zm2.446 2.729c-.287.267-.85.143-1.232-.28-.396-.42-.47-.983-.177-1.254.298-.266.844-.14 1.24.28.394.426.472.984.17 1.255zM31.312 98.012c-.37.258-.976.017-1.35-.52-.37-.538-.37-1.183.01-1.44.373-.258.97-.025 1.35.507.368.545.368 1.19-.01 1.452zm3.261 3.361c-.33.365-1.036.267-1.552-.23-.527-.487-.674-1.18-.343-1.544.336-.366 1.045-.264 1.564.23.527.486.686 1.18.333 1.543zm4.5 1.951c-.147.473-.825.688-1.51.486-.683-.207-1.13-.76-.99-1.238.14-.477.823-.7 1.512-.485.683.206 1.13.756.988 1.237zm4.943.361c.017.498-.563.91-1.28.92-.723.017-1.308-.387-1.315-.877 0-.503.568-.91 1.29-.924.717-.013 1.306.387 1.306.88zm4.598-.782c.086.485-.413.984-1.126 1.117-.7.13-1.35-.172-1.44-.653-.086-.498.422-.997 1.122-1.126.714-.123 1.354.17 1.444.663zm0 0">
                    </path>
                  </g>
                </svg>
                <p className="mt-1">GitHub</p>
              </a>
              <a href={siteConfig.links.linkedin} target="_blank" className="flex flex-col p-6 px-14 shadow-sm md:h-[120px] shadow-borderg hover:border-transparent rounded-lg justify-center items-center duration-100 ease-in-out transform hover:shadow-pink-500 hover:shadow-lg hover:scale-[110%]">
                <svg viewBox="0 0 128 128" width="28" height="28" fill="white" stroke="white">
                  <path fill="transparent"
                    d="M116 3H12a8.91 8.91 0 00-9 8.8v104.42a8.91 8.91 0 009 8.78h104a8.93 8.93 0 009-8.81V11.77A8.93 8.93 0 00116 3z">
                  </path>
                  <path fill="#fff"
                    d="M21.06 48.73h18.11V107H21.06zm9.06-29a10.5 10.5 0 11-10.5 10.49 10.5 10.5 0 0110.5-10.49M50.53 48.73h17.36v8h.24c2.42-4.58 8.32-9.41 17.13-9.41C103.6 47.28 107 59.35 107 75v32H88.89V78.65c0-6.75-.12-15.44-9.41-15.44s-10.87 7.36-10.87 15V107H50.53z">
                  </path>
                </svg>
                <p className="mt-1">LinkedIn</p>
              </a>
              <a href={siteConfig.links.twitter} target="_blank" className="flex flex-col col-span-2 h-[60px] shadow-sm shadow-borderg hover:border-transparent rounded-lg justify-center items-center duration-100 ease-in-out transform hover:shadow-pink-500 hover:shadow-lg hover:scale-[110%]">
                <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" width="24" height="24" stroke="white" viewBox="0 0 24 24" xmlSpace="preserve">
                  <path d="M14.095479,10.316482L22.286354,1h-1.940718l-7.115352,8.087682L7.551414,1H1l8.589488,12.231093L1,23h1.940717  l7.509372-8.542861L16.448587,23H23L14.095479,10.316482z M11.436522,13.338465l-0.871624-1.218704l-6.924311-9.68815h2.981339  l5.58978,7.82155l0.867949,1.218704l7.26506,10.166271h-2.981339L11.436522,13.338465z" />
                </svg>
                <p className="mt-1">X.com</p>
              </a>
              <a href={siteConfig.links.kaggle} target="_blank" className="flex flex-col p-6 px-14 shadow-sm md:h-[120px] shadow-borderg hover:border-transparent rounded-lg justify-center items-center duration-100 ease-in-out transform hover:shadow-pink-500 hover:shadow-lg hover:scale-[110%]">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" stroke="white" fill="white" viewBox="0 0 32 32">
                  <path d="M 10.351562 4 C 10.117563 4 10 4.1165625 10 4.3515625 L 10 27.644531 C 10 27.878531 10.116563 27.996094 10.351562 27.996094 L 12.648438 27.996094 C 12.882437 27.996094 13.001953 27.879531 13.001953 27.644531 L 13.001953 22.808594 L 14.810547 21.085938 L 20.048828 27.75 C 20.190828 27.915 20.354922 28 20.544922 28 L 23.716797 28 C 23.882797 28 23.977 27.952422 24 27.857422 L 23.933594 27.498047 L 17.023438 18.910156 L 23.650391 12.498047 C 23.773391 12.370047 23.730438 12 23.398438 12 L 20.117188 12 C 19.951187 12 19.785141 12.085953 19.619141 12.251953 L 13 18.974609 L 13 4.3515625 C 13 4.1165625 12.883437 4 12.648438 4 L 10.351562 4 z" />
                </svg>
                <p className="mt-1">Kaggle</p>
              </a>
              <a href={siteConfig.links.medium} target="_blank" className="flex flex-col p-6 px-14 shadow-sm md:h-[120px] shadow-borderg hover:border-transparent rounded-lg justify-center items-center duration-100 ease-in-out transform hover:shadow-pink-500 hover:shadow-lg hover:scale-[110%]">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" stroke="white" fill="white" viewBox="0 0 50 50">
                  <path d="M15 12A13 13 0 1015 38 13 13 0 1015 12zM35.5 13c-3.59 0-6.5 5.373-6.5 12 0 1.243.102 2.441.292 3.568.253 1.503.662 2.879 1.192 4.065.265.593.56 1.138.881 1.627.642.978 1.388 1.733 2.202 2.201C34.178 36.811 34.827 37 35.5 37s1.322-.189 1.933-.539c.814-.468 1.56-1.223 2.202-2.201.321-.489.616-1.034.881-1.627.53-1.185.939-2.562 1.192-4.065C41.898 27.441 42 26.243 42 25 42 18.373 39.09 13 35.5 13zM45.5 14c-.259 0-.509.173-.743.495-.157.214-.307.494-.448.833-.071.169-.14.353-.206.551-.133.395-.257.846-.37 1.343-.226.995-.409 2.181-.536 3.497-.063.658-.112 1.349-.146 2.065C43.017 23.499 43 24.241 43 25s.017 1.501.051 2.217c.033.716.082 1.407.146 2.065.127 1.316.31 2.501.536 3.497.113.498.237.948.37 1.343.066.198.135.382.206.551.142.339.292.619.448.833C44.991 35.827 45.241 36 45.5 36c1.381 0 2.5-4.925 2.5-11S46.881 14 45.5 14z" />
                </svg>
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
          {siteConfig.projects.map((project) => (
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
                <Image src={project.image} alt={project.title} width={400} height={300} className="w-full h-[50%] md:h-[70%] my-4 object-cover rounded-xl group-hover:hidden" />
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
                <Image width="28" height="28" src="https://img.icons8.com/nolan/64/code--v2.png" alt="code--v2" />
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
                <Image width="28" height="28" src="https://img.icons8.com/nolan/64/console.png" alt="console" />
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
                <Image width="28" height="28" src="https://img.icons8.com/nolan/64/database.png" alt="database" />
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
                <Image width="28" height="28" src="https://img.icons8.com/nolan/64/bot.png" alt="bot" />
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
                <Image width="28" height="28" src="https://img.icons8.com/nolan/64/python.png" alt="python" />
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
                <Image width="28" height="28" src="https://img.icons8.com/nolan/64/curly-brackets.png" alt="curly-brackets" />
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
              {siteConfig.about}
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
              <svg viewBox="0 0 128 128" width="30" height="30" fill="white" stroke="white">
                <g fill="white">
                  <path fillRule="evenodd" clipRule="evenodd"
                    d="M64 5.103c-33.347 0-60.388 27.035-60.388 60.388 0 26.682 17.303 49.317 41.297 57.303 3.017.56 4.125-1.31 4.125-2.905 0-1.44-.056-6.197-.082-11.243-16.8 3.653-20.345-7.125-20.345-7.125-2.747-6.98-6.705-8.836-6.705-8.836-5.48-3.748.413-3.67.413-3.67 6.063.425 9.257 6.223 9.257 6.223 5.386 9.23 14.127 6.562 17.573 5.02.542-3.903 2.107-6.568 3.834-8.076-13.413-1.525-27.514-6.704-27.514-29.843 0-6.593 2.36-11.98 6.223-16.21-.628-1.52-2.695-7.662.584-15.98 0 0 5.07-1.623 16.61 6.19C53.7 35 58.867 34.327 64 34.304c5.13.023 10.3.694 15.127 2.033 11.526-7.813 16.59-6.19 16.59-6.19 3.287 8.317 1.22 14.46.593 15.98 3.872 4.23 6.215 9.617 6.215 16.21 0 23.194-14.127 28.3-27.574 29.796 2.167 1.874 4.097 5.55 4.097 11.183 0 8.08-.07 14.583-.07 16.572 0 1.607 1.088 3.49 4.148 2.897 23.98-7.994 41.263-30.622 41.263-57.294C124.388 32.14 97.35 5.104 64 5.104z">
                  </path>
                  <path
                    d="M26.484 91.806c-.133.3-.605.39-1.035.185-.44-.196-.685-.605-.543-.906.13-.31.603-.395 1.04-.188.44.197.69.61.537.91zm2.446 2.729c-.287.267-.85.143-1.232-.28-.396-.42-.47-.983-.177-1.254.298-.266.844-.14 1.24.28.394.426.472.984.17 1.255zM31.312 98.012c-.37.258-.976.017-1.35-.52-.37-.538-.37-1.183.01-1.44.373-.258.97-.025 1.35.507.368.545.368 1.19-.01 1.452zm3.261 3.361c-.33.365-1.036.267-1.552-.23-.527-.487-.674-1.18-.343-1.544.336-.366 1.045-.264 1.564.23.527.486.686 1.18.333 1.543zm4.5 1.951c-.147.473-.825.688-1.51.486-.683-.207-1.13-.76-.99-1.238.14-.477.823-.7 1.512-.485.683.206 1.13.756.988 1.237zm4.943.361c.017.498-.563.91-1.28.92-.723.017-1.308-.387-1.315-.877 0-.503.568-.91 1.29-.924.717-.013 1.306.387 1.306.88zm4.598-.782c.086.485-.413.984-1.126 1.117-.7.13-1.35-.172-1.44-.653-.086-.498.422-.997 1.122-1.126.714-.123 1.354.17 1.444.663zm0 0">
                  </path>
                </g>
              </svg>
            </a>
            <a href={siteConfig.links.linkedin} target="_blank">
              <svg viewBox="0 0 128 128" width="30" height="30" fill="white" stroke="white">
                <path fill="transparent"
                  d="M116 3H12a8.91 8.91 0 00-9 8.8v104.42a8.91 8.91 0 009 8.78h104a8.93 8.93 0 009-8.81V11.77A8.93 8.93 0 00116 3z">
                </path>
                <path fill="#fff"
                  d="M21.06 48.73h18.11V107H21.06zm9.06-29a10.5 10.5 0 11-10.5 10.49 10.5 10.5 0 0110.5-10.49M50.53 48.73h17.36v8h.24c2.42-4.58 8.32-9.41 17.13-9.41C103.6 47.28 107 59.35 107 75v32H88.89V78.65c0-6.75-.12-15.44-9.41-15.44s-10.87 7.36-10.87 15V107H50.53z">
                </path>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
