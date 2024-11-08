import React from 'react'
import { Link } from 'react-router-dom'
import image from "../../assets/images/404image.png"

const Error_404 = () => {
  return (
    <div className='flex-col sm:flex-row text-base sm:text-2xl text-center h-screen px-8 flex justify-between items-center bg-[#346995] bg-homeBg bg-cover bg-no-repeat bg-center'>
      <div className='w-full h-full flex justify-center items-center'>
        <img src={image} alt="404-image" className='h-80 w-64  md:w-80 md:h-96' />
      </div>
      <div className='w-full h-full flex justify-center flex-col items-center gap-4'>
        <h2 className='font-bold'>¡Ups! Parece que te has perdido</h2>
        <p>Lo sentimos, pero la página que estás buscando no se ha encontrado.</p>
        <Link to="/" className='border-b-2 dark:border-danube-500 dark:hover:border-danube-600 border-big-stone-600 hover:border-big-stone-700'>Volver al inicio</Link>
      </div>
    </div>
  )
}

export default Error_404