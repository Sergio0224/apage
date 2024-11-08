import React from 'react'
import { Link } from 'react-router-dom'

const FirstSection = () => {
    return (
        <div className='h-screen flex justify-center items-center bg-cover bg-no-repeat bg-center bg-fixed bg-homeBg'>
            <div className='w-full sm:w-1/2 flex gap-4 flex-col items-center text-center'>
                <h1 className='2xl:text-4xl desktop+:text-5xl text-xl sm:text-2xl md:text-3xl lg:text-4xl text-black font-bold'>Transforma tus habilidades de álgebra y cálculo con <span className='text-transparent bg-gradient-to-br from-[#346995] to-[#4582b0] bg-clip-text'>CollabGebra</span></h1>
                <p>
                    Únete a nuestra plataforma web colaborativa de álgebra y cálculo y descubre un mundo de oportunidades de resolución de problemas.
                    Conéctate con otros usuarios, comparte conocimientos y mejora tus habilidades.
                </p>
                <div className='flex flex-col justify-center w-full sm:flex-row gap-4 sm:gap-6'>
                    <Link to="/login" className='p-2 w-full text-center sm:w-40 text-white dark:bg-danube-500 dark:hover:bg-danube-600 bg-big-stone-600 hover:bg-big-stone-700 rounded-md transition duration-200 ease-in-out'>Iniciar sesión</Link>
                    <Link to="/register" className='p-2 w-full text-center sm:w-40 text-white dark:bg-danube-500 dark:hover:bg-danube-600 bg-big-stone-600 hover:bg-big-stone-700 rounded-md transition duration-200 ease-in-out'>Registrarse</Link>
                </div>
            </div>
        </div>
    )
}

export default FirstSection