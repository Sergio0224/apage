import { useEffect } from 'react'
import Routing from './routes/Routing'

const App = () => {
  const theme = localStorage.getItem("theme")

  useEffect(() => {
    if (theme === "dark") {
      document.querySelector("html").classList.add("dark");
    } else if (theme === "light") {
      document.querySelector("html").classList.remove("dark");
    } else {
      const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDarkMode) {
        document.querySelector("html").classList.add("dark");
      } else {
        document.querySelector("html").classList.remove("dark");
      }
    }
  }, [theme]);

  return (
    <div className='w-full h-full text-sm sm:text-base bg-vista-white-50 text-bunker-950 font-Poppins dark:text-[#D1D1D1] dark:bg-[#171717]'>
      <Routing />
    </div>
  )
}

export default App