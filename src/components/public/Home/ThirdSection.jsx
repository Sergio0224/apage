import React from 'react'
import { Link } from 'react-router-dom'
import CardFourthSection from './CardFourthSection'

const ThirdSection = () => {
  return (
    <div className='h-full md:h-screen pt-10 flex gap-6 flex-col text-center'>
      <div>
        <h2 className='py-2 2xl:text-4xl desktop+:text-5xl text-xl sm:text-2xl md:text-3xl lg:text-4xl text-transparent bg-gradient-to-br from-[#346995] to-[#4582b0] bg-clip-text font-bold'>Descubra nuevo contenido de álgebra y cálculo</h2>
        <p>Manténgase actualizado con las últimas publicaciones.</p>
      </div>
      <div className='h-full flex gap-2 flex-col md:flex-row lg:gap-0 md:justify-between'>
        <CardFourthSection title="Matrices" content="Las matrices son un conjunto bidimensional de números o símbolos distribuidos rectangularmente. Se organizan en filas y columnas, ocupando..." />
        <CardFourthSection title="Sistema de Ecuaciones" content="Un sistema de ecuaciones es un conjunto de dos o más ecuaciones con múltiples incógnitas. Deben resolverse simultáneamente para satisfacer todas las condiciones..." />
        <CardFourthSection title="Determinantes" content="El determinante de una matriz cuadrada es un número que se obtiene como resultado de realizar una serie de operaciones con sus elementos..." />
      </div>
    </div>
  )
}

export default ThirdSection