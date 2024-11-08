import React from 'react';
import { States } from '../../../../hooks/useAlgebraicValidator';

const AutomatonVisualizer = ({ currentState, expression, errorPosition }) => {
  // Colores para diferentes estados
  const stateColors = {
    [States.START]: 'bg-gray-200',
    [States.NUMBER]: 'bg-green-200',
    [States.OPERATOR]: 'bg-blue-200',
    [States.VARIABLE]: 'bg-purple-200',
    [States.OPEN_PAREN]: 'bg-yellow-200',
    [States.CLOSE_PAREN]: 'bg-yellow-200',
    [States.FRACTION]: 'bg-pink-200',
    [States.ERROR]: 'bg-red-200',
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="font-medium">Estado del Autómata</h3>
      
      {/* Visualización del estado actual */}
      <div className="flex items-center space-x-2">
        <span className="text-sm">Estado actual:</span>
        <span className={`px-3 py-1 rounded ${stateColors[currentState]}`}>
          {currentState}
        </span>
      </div>

      {/* Visualización de la expresión con resaltado */}
      <div className="font-mono text-sm">
        {expression.split('').map((char, index) => (
          <span
            key={index}
            className={`${
              index === errorPosition ? 'bg-red-200' : ''
            } ${
              char === ' ' ? 'mx-1' : ''
            }`}
          >
            {char}
          </span>
        ))}
      </div>

      {/* Leyenda de estados */}
      <div className="grid grid-cols-2 gap-2 text-sm">
        {Object.entries(States).map(([state, value]) => (
          <div
            key={state}
            className={`flex items-center space-x-2 p-2 rounded ${stateColors[value]}`}
          >
            <span>{state}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AutomatonVisualizer;