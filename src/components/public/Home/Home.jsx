import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb, faSearch, faChartLine, faCog, faSquareRootAlt, faUsers, faCalculator, faQuestion, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Icon3D from "./Icon3D"

const Home = () => {
    
    return (
        <div className="w-full min-h-screen bg-white">
            {/* Navigation */}
            <nav className="w-full px-4 sm:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
                <div className="flex items-center">
                    <span className="text-transparent bg-gradient-to-br from-[#346995] to-[#4582b0] bg-clip-text font-bold text-xl">
                        CollabGebra
                    </span>
                </div>
                <div className="flex gap-4">
                    <Link
                        to="/register"
                        className="px-4 sm:px-6 py-2 bg-big-stone-600 text-white rounded-full hover:bg-big-stone-700 text-sm sm:text-base"
                    >
                        Registrarse
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="px-4 sm:px-8 py-8 sm:py-16 flex flex-col lg:flex-row justify-between items-center gap-8">
                <div className="w-full lg:w-1/2">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-center lg:text-left">
                        Transforma tus habilidades de {" "}
                        <span className="text-transparent bg-gradient-to-br from-[#346995] to-[#4582b0] bg-clip-text">
                            álgebra y cálculo
                        </span>{" "}
                        con CollabGebra
                    </h1>
                    <p className="text-gray-600 mb-8 text-center lg:text-left">
                        Únete a nuestra plataforma web colaborativa de álgebra y cálculo y descubre un mundo de oportunidades de resolución de problemas.
                        Conéctate con otros usuarios, comparte conocimientos y mejora tus habilidades.
                    </p>
                    <div className="flex justify-center lg:justify-start">
                        <Link
                            to="/register"
                            className="px-8 py-3 bg-big-stone-600 text-white rounded-full hover:bg-big-stone-700 w-full sm:w-auto"
                        >
                            Empezar <FontAwesomeIcon icon={faArrowRight}></FontAwesomeIcon>
                        </Link>
                    </div>
                </div>
                <div className="w-full lg:w-1/2 flex justify-center items-center">
                    <Icon3D
                        icon={faSquareRootAlt}
                        size="text-[120px] sm:text-[200px]"
                    />
                </div>
            </section>

            {/* Services Section */}
            <section className="px-4 sm:px-8 py-8 sm:py-16">
                <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
                    Compartir y resolver problemas juntos
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <ServiceCard
                        icon={faSearch}
                        title="Publicar Problemas"
                        color="bg-blue-50"
                        textColor="text-[#346995]"
                        description="Comparte tus dudas matemáticas y recibe ayuda personalizada de nuestra comunidad de expertos"
                    />
                    <ServiceCard
                        icon={faLightbulb}
                        title="Resolver Juntos"
                        color="bg-blue-50"
                        textColor="text-[#346995]"
                        description="Participa en sesiones colaborativas para resolver problemas paso a paso y mejorar tu comprensión"
                    />
                    <ServiceCard
                        icon={faChartLine}
                        title="Seguimiento"
                        color="bg-blue-50"
                        textColor="text-[#346995]"
                        description="Mantén un registro de tu progreso y visualiza tu mejora en diferentes áreas matemáticas"
                    />
                    <ServiceCard
                        icon={faUsers}
                        title="Comunidad"
                        color="bg-blue-50"
                        textColor="text-[#346995]"
                        description="Conéctate con otros estudiantes y profesores apasionados por las matemáticas"
                    />
                </div>
            </section>

            {/* Solutions Section */}
            <section className="px-4 sm:px-8 py-8 sm:py-16 bg-[#FFF5F1]">
                <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
                    <div className="w-full lg:w-1/2 flex justify-center items-center">
                        <Icon3D
                            icon={faQuestion}
                            size="text-[100px] sm:text-[150px]"
                        />
                    </div>
                    <div className="w-full lg:w-1/2 lg:pl-12">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center lg:text-left">
                            Preguntas frecuentes
                        </h2>
                        <div className="space-y-4">
                            <SolutionStep number="1" text="¿Cómo me registro?" />
                            <SolutionStep number="2" text="¿Cómo publico un problema?" />
                            <SolutionStep number="3" text="¿Cómo puedo interactuar con otros usuarios?" />
                            <SolutionStep number="4" text="¿Cómo encuentro categorías específicas?" />
                        </div>
                        <div className="mt-8 flex justify-center lg:justify-start">
                            <Link
                                to="/register"
                                className="px-6 py-2 bg-big-stone-600 text-white rounded-full"
                            >
                                Registrarse
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Agency Section */}
            <section className="px-4 sm:px-8 py-8 sm:py-16">
                <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
                    <div className="w-full lg:w-1/2">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center lg:text-left">
                            Comunidad de Aprendizaje
                        </h2>
                        <p className="text-gray-600 mb-8 text-center lg:text-left">
                            Únete a grupos de estudio especializados, participa en desafíos diarios de álgebra
                            y construye tu red de compañeros de estudio. El aprendizaje es más efectivo cuando
                            lo hacemos juntos.
                        </p>
                        <div className="flex justify-center lg:justify-start">
                            <Link
                                to="/register"
                                className="px-6 py-2 bg-big-stone-600 text-white rounded-full"
                            >
                                Unirse ahora
                            </Link>
                        </div>
                    </div>
                    <div className="w-full lg:w-1/2 flex justify-center items-center lg:pl-12">
                        <Icon3D
                            icon={faUsers}
                            size="text-[100px] sm:text-[150px]"
                        />
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="px-4 sm:px-8 py-8 sm:py-16">
                <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">
                    Descubra nuevo contenido de álgebra y cálculo
                </h2>
                <div className="flex flex-col lg:flex-row gap-6 justify-center items-center">
                    <TestimonialCard
                        name="Matrices"
                        role="Tema básico"
                        content="Las matrices son un conjunto bidimensional de números o símbolos distribuidos rectangularmente. Se organizan en filas y columnas, ocupando..."
                    />
                    <TestimonialCard
                        name="Sistema de Ecuaciones"
                        role="Tema intermedio"
                        content="Un sistema de ecuaciones es un conjunto de dos o más ecuaciones con múltiples incógnitas. Deben resolverse simultáneamente para satisfacer todas las condiciones..."
                    />
                    <TestimonialCard
                        name="Determinantes"
                        role="Tema avanzado"
                        content="El determinante de una matriz cuadrada es un número que se obtiene como resultado de realizar una serie de operaciones con sus elementos..."
                    />
                </div>
            </section>

            {/* CTA Section */}
            <section className="px-4 sm:px-8 py-8 sm:py-12 bg-[#FFF5F1]">
                <div className="text-center">
                    <h2 className="text-xl sm:text-2xl font-bold mb-4">¿Listo para empezar?</h2>
                    <Link
                        to="/register"
                        className="px-6 sm:px-8 py-3 bg-big-stone-600 text-white rounded-full"
                    >
                        Contáctanos ahora
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="px-4 sm:px-8 py-8 sm:py-12 bg-[#FFF5F1] relative">
                <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="text-center sm:text-left">
                        <h3 className="font-bold text-transparent bg-gradient-to-br from-[#346995] to-[#4582b0] bg-clip-text mb-4 text-xl">
                            CollabGebra
                        </h3>
                        <div className="flex gap-4 justify-center sm:justify-start">
                            <Link to="#" className="text-big-stone-600">FB</Link>
                            <Link to="#" className="text-big-stone-600">TW</Link>
                            <Link to="#" className="text-big-stone-600">IN</Link>
                        </div>
                    </div>
                    <div className="text-center sm:text-left">
                        <h4 className="font-bold mb-4">Compañía</h4>
                        <div className="space-y-2">
                            <p><Link to="#" className="text-gray-600">Sobre nosotros</Link></p>
                            <p><Link to="#" className="text-gray-600">Carrera</Link></p>
                            <p><Link to="#" className="text-gray-600">Equipo</Link></p>
                        </div>
                    </div>
                    <div className="text-center sm:text-left">
                        <h4 className="font-bold mb-4">Diseño</h4>
                        <div className="space-y-2">
                            <p><Link to="#" className="text-gray-600">Nuestros Proyectos</Link></p>
                            <p><Link to="#" className="text-gray-600">Sistema de Diseño</Link></p>
                            <p><Link to="#" className="text-gray-600">Precios</Link></p>
                        </div>
                    </div>
                    <div className="text-center sm:text-left">
                        <h4 className="font-bold mb-4">Recursos</h4>
                        <div className="space-y-2">
                            <p><Link to="#" className="text-gray-600">Blog</Link></p>
                            <p><Link to="#" className="text-gray-600">Soporte</Link></p>
                            <p><Link to="#" className="text-gray-600">Newsletter</Link></p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const ServiceCard = ({ icon, title, color, textColor, description }) => (
    <div className={`p-6 rounded-lg ${color} flex flex-col items-center text-center`}>
        <FontAwesomeIcon icon={icon} className={`text-2xl mb-4 ${textColor}`} />
        <h3 className="font-bold mb-2">{title}</h3>
        <p className="text-sm text-gray-600">
            {description}
        </p>
    </div>
);

const SolutionStep = ({ number, text }) => (
    <div className="flex items-center gap-4">
        <div className="w-8 h-8 rounded-full bg-big-stone-600 text-white flex items-center justify-center">
            {number}
        </div>
        <p>{text}</p>
    </div>
);

const TestimonialCard = ({ name, role, content }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm w-full max-w-xs mx-auto">
        <p className="mb-4 text-sm sm:text-base">{content}</p>
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-200"></div>
            <div>
                <h4 className="font-bold text-sm sm:text-base">{name}</h4>
                <p className="text-xs sm:text-sm text-gray-600">{role}</p>
            </div>
        </div>
    </div>
);

export default Home;

/*
<div className="absolute bottom-0 left-0 right-0 h-16 bg-[#FFF5F1]" style={{
                    borderRadius: '50% 50% 0 0 / 100% 100% 0 0',
                    transform: 'translateY(50%)'
                }}></div>
*/