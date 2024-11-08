import { faArrowRight, faBook } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { Link } from 'react-router-dom'

const CardFourthSection = ({ title, content }) => {
    return (
        <div className='justify-between flex flex-col w-full md:w-1/4 px-2 py-4 h-1/2 rounded-lg dark:bg-[#242424] bg-[#F2F2F2] overflow-hidden'>
            <div>
                <h3 className='text-transparent bg-gradient-to-br from-[#346995] to-[#4582b0] bg-clip-text font-bold'>{title}</h3>
                <p>{content}</p>
            </div>
            <Link to="/register" className='flex justify-center items-center gap-2'>Leer Mas <FontAwesomeIcon className='dark:text-danube-500 text-big-stone-600' icon={faArrowRight} /></Link>
        </div>
    )
}

export default CardFourthSection

CardFourthSection.defaultProps = {
    title: "Contenido de Algebra",
    content: "Aqui encontraras contenido de algebra"
}