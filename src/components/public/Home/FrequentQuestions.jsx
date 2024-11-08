import React from 'react'

const FrequentQuestions = ({ title, content }) => {
    return (
        <details className='dark:text-danube-500 text-big-stone-600 p-3 dark:bg-[#242424] bg-[#F2F2F2]' name="Frequent__Question">
            <summary className='cursor-pointer before:content-["+"] before:mr-4 list-none'>{title}</summary>
            <div className='p-4 text-black'>
                {content}
            </div>
        </details>

    )
}

export default FrequentQuestions

FrequentQuestions.defaultProps = {
    title: "Pregunta frecuente",
    content: "Aqui encontraras la respuesta a la pregunta"
}