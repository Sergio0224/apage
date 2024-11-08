import React from 'react'
import { Link } from 'react-router-dom'
import picOne from "../../../assets/images/picOne.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCube } from '@fortawesome/free-solid-svg-icons'

const SecondSection = () => {
  return (
    <div className='mt-6 lg:mt-8 h-screen flex flex-col items-start justify-start lg:justify-normal lg:gap-2 lg:flex-row text-start sm:text-center md:text-start'>
      <div className='w-full lg:w-1/2 flex gap-4 flex-col'>
        <div className='flex gap-2 flex-col'>
          <h2 className='2xl:text-4xl desktop+:text-5xl text-xl sm:text-2xl md:text-3xl lg:text-4xl text-transparent bg-gradient-to-br from-[#346995] to-[#4582b0] bg-clip-text font-bold'>Compartir y resolver problemas juntos</h2>
          <p className='desktop+:text-xl 2xl:text-xl'>
            Publique nuevos problemas o contenido de álgebra y cálculo en nuestra plataforma
            y colabore con otros usuarios para encontrar soluciones.
            ¡Únase a nuestra comunidad de solucionadores de problemas hoy!
          </p>
        </div>
        <div className='flex gap-4 flex-col sm:flex-row desktop+:text-xl 2xl:text-xl'>
          <div>
            <FontAwesomeIcon icon={faCube} />
            <h3 className='text-transparent bg-gradient-to-br from-[#346995] to-[#4582b0] bg-clip-text font-bold'>Post</h3>
            <p>Comparte tus problemas de álgebra y cálculo y obtén ayuda de nuestra comunidad de expertos</p>
          </div>
          <div>
            <FontAwesomeIcon icon={faCube} />
            <h3 className='text-transparent bg-gradient-to-br from-[#346995] to-[#4582b0] bg-clip-text font-bold'>Colaborar</h3>
            <p>Trabaja junto con otros usuarios para resolver problemas de álgebra y cálculo desafiantes y mejorar tus habilidades.</p>
          </div>
        </div>
        <Link to="/register" className='p-2 border w-full text-center sm:w-40 text-white dark:bg-[] bg-big-stone-600 hover:bg-big-stone-700 rounded-md transition duration-200 ease-in-out'>Registrarse</Link>

      </div>
      <div className='w-1/2'>
        <img src={picOne} alt="" className='h-full w-full overflow-hidden hidden lg:block' />
      </div>
    </div>
  )
}

export default SecondSection