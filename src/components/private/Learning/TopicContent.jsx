import React from 'react';
import { useParams } from 'react-router-dom';

const topicContents = {
  'matrices': 'Una matriz es una estructura de datos rectangular formada por filas y columnas, donde cada elemento se identifica por su posición en la matriz. Las matrices se utilizan en diversas áreas de las matemáticas, la ciencia y la ingeniería para representar y manipular datos de manera eficiente. Permiten realizar operaciones como suma, multiplicación, transposición, inversión, entre otras.',
  'sistema-de-ecuaciones': 'Un sistema de ecuaciones es un conjunto de dos o más ecuaciones con dos o más incógnitas. Resolver un sistema de ecuaciones implica encontrar los valores de las incógnitas que satisfacen todas las ecuaciones simultáneamente. Los sistemas de ecuaciones se utilizan ampliamente en diversas áreas, como física, ingeniería, economía y otras disciplinas científicas, para modelar y resolver problemas complejos.',
  'determinantes': 'Un determinante es un valor escalar que se puede calcular a partir de los elementos de una matriz cuadrada. Los determinantes se utilizan para determinar si una matriz es invertible, para resolver sistemas de ecuaciones lineales y para realizar varios cálculos en álgebra lineal y geometría analítica. El determinante de una matriz proporciona información sobre las propiedades de la matriz, como su rango y su singularidad.',
  'Límites': `El límite de una función es un concepto fundamental en el Cálculo que describe el comportamiento de una función cuando su variable independiente se acerca a un valor específico. Más formalmente, el límite de una función f(x) cuando x se acerca a un valor particular a, denotado como: \n \n lim[x→a] f(x) = L \n \n significa que los valores de f(x) se pueden hacer tan cercanos como se desee a L, tomando valores de x lo suficientemente cercanos a a (pero diferentes de a).`,
  "Derivadas": "La derivada de una función en un punto dado mide la tasa de cambio instantánea de esa función en ese punto. Es una medida de la pendiente de la recta tangente a la gráfica de la función en ese punto. La derivada de una función f(x) en un punto x=a se denota como f'(a) o df/dx evaluada en x=a.\n\nFormalmente, la derivada de f(x) en x=a se define como:\n\nf'(a) = lim[h→0] (f(a+h) - f(a))/h\n\nsiempre que este límite exista. Este límite representa la pendiente de la recta tangente a la curva en el punto (a, f(a)).\n\nLas derivadas son fundamentales en el Cálculo, ya que permiten estudiar las propiedades de las funciones, encontrar máximos y mínimos, puntos de inflexión, analizar el comportamiento de una función, entre otras aplicaciones importantes."
};

const topicImages = {
  'Límites': ["https://www.fisicalab.com/sites/all/files/contenidos/matematicas/2311_calcular_limites_punto/concepto_limite.gif"],
  "Derivadas": ["https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Recta_tangente_y_derivada.svg/300px-Recta_tangente_y_derivada.svg.png"],
  "matrices": ["https://gamedevtraum.com/wp-content/uploads/es/matematica/algebra/que-es-una-matriz-en-matematica-definicion-y-ejemplos/ejemplo-de-una-matriz-b-de-3-por-3.webp"],
  "sistema-de-ecuaciones": ["https://uruguayeduca.anep.edu.uy/sites/default/files/styles/wide/public/2017-10/2017-10-18%2017_40_05-Configuraci%C3%B3n.png?itok=NB8mp1hI"],
  "determinantes": ["https://panel.resueltoos.com/media/regla-de-sarrus-resueltoos_1697127424.webp"],
};

const TopicContent = () => {
  const { topicId } = useParams();
  const topicContent = topicContents[topicId];
  const images = topicImages[topicId] || [];

  return (
    <div className="max-w-3xl mx-auto p-8">
      {topicContent ? (
        <div className="flex flex-col gap-6">
          <h1 className="text-3xl font-bold text-center text-[#2c3e50] dark:text-[#ecf0f1] mb-6">{topicId}</h1>
          <div>
            {topicContent.split('\n').map((linea, index) => (
              <React.Fragment key={index}>
                <p className="text-[#34495e] dark:text-[#bdc3c7] text-lg mb-4">
                  {linea.includes('lim') ? (
                    <div className="bg-[#ecf0f1] dark:bg-[#2c3e50] p-4 rounded-lg border-l-4 border-[#3498db] dark:border-[#3498db] my-4">
                      <span className="italic font-bold text-[#e74c3c] dark:text-[#e74c3c]">{linea}</span>
                    </div>
                  ) : (
                    linea
                  )}
                </p>
                {index < topicContent.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </div>
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Imagen ${index + 1}`}
              className="w-full max-w-md mx-auto rounded-lg shadow-md"
            />
          ))}
        </div>
      ) : (
        <p className="text-xl text-center text-[#34495e] dark:text-[#bdc3c7]">Tema no encontrado</p>
      )}
    </div>
  );
};

export default TopicContent;