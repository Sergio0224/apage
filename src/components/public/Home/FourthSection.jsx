import React from 'react'
import FrequentQuestions from './FrequentQuestions'

const FourthSection = () => {
    return (
        <div className='py-10 md:pb-20 md:py-0 flex'>
            <div className='w-full flex gap-4 flex-col'>
                <div>
                    <h2 className='py-2 2xl:text-4xl desktop+:text-5xl text-xl sm:text-2xl md:text-3xl lg:text-4xl text-transparent bg-gradient-to-br from-[#346995] to-[#4582b0] bg-clip-text font-bold'>Preguntas frecuentes</h2>
                    <p>Encuentre respuestas a preguntas comunes sobre el uso de nuestra plataforma web colaborativa de álgebra y cálculo.</p>
                </div>
                <FrequentQuestions title="¿Cómo me registro?" content="Para registrarse, haga clic en el botón `Registrarse` en la esquina superior derecha de la página. Complete la información requerida y siga las instrucciones para crear su cuenta."></FrequentQuestions>
                <FrequentQuestions title="¿Cómo publico un problema?" content="Para publicar un problema, vaya a la sección `Nuevo problema` en la página principal. Proporcione una descripción clara y seleccione la categoría relevante. Haga clic en Enviar para publicar su problema."></FrequentQuestions>
                <FrequentQuestions title="¿Cómo puedo interactuar con otros usuarios?" content="Puede interactuar con otros usuarios comentando sus publicaciones, calificando su contenido y participando en debates en la sección de comentarios. Sea respetuoso y constructivo en sus interacciones."></FrequentQuestions>
                <FrequentQuestions title="¿Cómo encuentro categorías específicas?" content="Para buscar categorías específicas, navegue hasta la barra lateral en la página principal. Encontrará una lista de categorías. Haga clic en una categoría para ver contenido relacionado."></FrequentQuestions>
                <FrequentQuestions title="¿Cómo puedo contactar con el soporte?" content="Si necesita más ayuda, puede comunicarse con nuestro equipo de soporte haciendo clic en el botón Contacto a continuación. Estaremos encantados de ayudarle con cualquier pregunta o inquietud."></FrequentQuestions>
            </div>
        </div>
    )
}

export default FourthSection