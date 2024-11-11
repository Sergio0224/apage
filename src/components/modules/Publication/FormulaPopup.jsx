import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalculator, faDeleteLeft } from '@fortawesome/free-solid-svg-icons';
import { useAlgebraicValidator } from '../../../hooks/useAlgebraicValidator';
import SyntaxHighlighter from '../../private/Feed/components/SyntaxHighlighter';
import UseAlgebraicExpression from '../../../hooks/UseAlgebraicExpression';

const FormulaPopup = () => {
  // Estado original del FormulaPopup
  const [showPopup, setShowPopup] = useState(false);
  const [showPowerInputs, setShowPowerInputs] = useState(false);
  const [showFractionInputs, setShowFractionInputs] = useState(false);
  const [numerator, setNumerator] = useState('');
  const [denominator, setDenominator] = useState('');

  const {
    base,
    setBase,
    exponent,
    setExponent,
    inputValue,
    setInputValue
  } = UseAlgebraicExpression();

  // Hook de validación
  const {
    expression,
    setExpression,
    isValid,
    error,
    errorPosition
  } = useAlgebraicValidator();

  // Estado para el modo de visualización
  const [showSyntaxHighlight, setShowSyntaxHighlight] = useState(true);

  const togglePopup = () => {
    setShowPopup(!showPopup);
    setShowPowerInputs(false);
    setShowFractionInputs(false);
    setBase('');
    setExponent('');
    setNumerator('');
    setDenominator('');
  };

  const handleFormulaChange = (value) => {
    if (value !== "^" && value !== "½") {
      setExpression(prev => prev + value);
    } else if (value === "^") {
      setShowPowerInputs(true);
      setShowFractionInputs(false);
    } else if (value === "½") {
      setShowFractionInputs(true);
      setShowPowerInputs(false);
    }
  };

  const handleBaseChange = (value) => {
    setBase(value);
  };

  const handleExponentChange = (value) => {
    setExponent(value);
  };

  const handleNumeratorChange = (value) => {
    setNumerator(value);
  };

  const handleDenominatorChange = (value) => {
    setDenominator(value);
  };

  const handlePowerChange = () => {
    if (base.trim() !== '' && exponent.trim() !== '') {
      setExpression(prev => prev + `${base}^{${exponent}}`);
      setShowPowerInputs(false);
      setBase('');
      setExponent('');
    }
  };

  const handleFractionChange = () => {
    if (numerator.trim() !== '' && denominator.trim() !== '') {
      setExpression(prev => prev + `\\frac{${numerator}}{${denominator}}`);
      setShowFractionInputs(false);
      setNumerator('');
      setDenominator('');
    }
  };

  const handleFormulaDelete = () => {
    setExpression(prev => prev.slice(0, -1));
  };

  const mathSymbols = ['+', '-', '*', '/', '(', ')', '[', ']', '½', '√', '^', 'x', 'y', 'z', "="];

  const renderExpression = (expr) => {
    return `\\[${expr}\\]`;
  };

  return (
    <div>
      <button
        className="flex gap-2 items-center"
        type="button"
        onClick={togglePopup}
      >
        <span className="dark:bg-danube-500 dark:hover:bg-danube-600 border-0 text-white bg-big-stone-600 hover:bg-big-stone-700 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer">
          <FontAwesomeIcon className="w-1/2 h-1/2" icon={faCalculator} />
        </span>
        Añadir Formula
      </button>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black bg-opacity-50"></div>
          <div className="dark:bg-[#242424] bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl relative z-10">
            <h2 className="text-2xl font-bold mb-4">Añadir Formula</h2>

            {/* Panel de Control */}
            <div className="flex justify-end mb-4 space-x-4">
              <button
                type="button"
                className={`px-3 py-1 rounded ${showSyntaxHighlight ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                onClick={() => setShowSyntaxHighlight(!showSyntaxHighlight)}
              >
                {showSyntaxHighlight ? 'Ocultar Sintaxis' : 'Mostrar Sintaxis'}
              </button>
            </div>

            {/* Área de Visualización */}
            <div className="grid grid-cols-1 gap-4 mb-4">
              {/* Renderizado de LaTeX */}
              <div className="mb-4">{renderExpression(expression)}</div>

              {/* Resaltador de Sintaxis */}
              {showSyntaxHighlight && (
                <SyntaxHighlighter expression={expression} />
              )}

              {/* Mensaje de Error */}
              {error && (
                <div className="text-red-500 text-sm mt-2">
                  {error}
                </div>
              )}
            </div>

            {/* Panel de Entrada */}
            <div className="relative">
              {/* Botones de Símbolos Matemáticos */}
              <div className="grid grid-cols-5 gap-2 mb-4">
                {mathSymbols.map((symbol, index) => (
                  <button
                    type="button"
                    key={index}
                    className="dark:bg-[#505050] dark:hover:bg-[#454545] dark:text-[#d1d1d1] bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded"
                    onClick={() => handleFormulaChange(symbol)}
                  >
                    {symbol}
                  </button>
                ))}
              </div>

              {/* Botones Numéricos */}
              <div className="grid grid-cols-5 gap-2 mb-4">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button
                    type="button"
                    key={num}
                    className="dark:bg-[#505050] dark:hover:bg-[#454545] dark:text-[#d1d1d1] bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded"
                    onClick={() => console.log(expression) 
                      +handleFormulaChange(num.toString())}
                  >
                    {num}
                  </button>
                ))}
              </div>

              {/* Inputs para Potencias */}
              {showPowerInputs && (
                <div className="flex justify-center items-center space-x-2 mb-4">
                  <input
                    type="text"
                    value={base}
                    onChange={(e) => handleBaseChange(e.target.value)}
                    className="border rounded-md px-4 py-2"
                    placeholder="Base"
                    onBlur={handlePowerChange}
                  />
                  <input
                    type="text"
                    value={exponent}
                    onChange={(e) => handleExponentChange(e.target.value)}
                    className="border rounded-md px-4 py-2"
                    placeholder="Exponente"
                    onBlur={handlePowerChange}
                  />
                </div>
              )}

              {/* Inputs para Fracciones */}
              {showFractionInputs && (
                <div className="flex justify-center items-center space-x-2 mb-4">
                  <input
                    type="text"
                    value={numerator}
                    onChange={(e) => handleNumeratorChange(e.target.value)}
                    className="border rounded-md px-4 py-2"
                    placeholder="Numerador"
                    onBlur={handleFractionChange}
                  />
                  <div>/</div>
                  <input
                    type="text"
                    value={denominator}
                    onChange={(e) => handleDenominatorChange(e.target.value)}
                    className="border rounded-md px-4 py-2"
                    placeholder="Denominador"
                    onBlur={handleFractionChange}
                  />
                </div>
              )}

              {/* Botón de Borrar */}
              <button
                type="button"
                className="dark:bg-[#505050] dark:hover:bg-[#454545] dark:text-[#d1d1d1] bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded"
                onClick={handleFormulaDelete}
              >
                <FontAwesomeIcon icon={faDeleteLeft} />
              </button>
            </div>

            {/* Botones de Acción */}
            <div className="flex justify-end mt-4">
              <button
                type="button"
                className="bg-stiletto-700 hover:bg-stiletto-800 text-white font-bold py-2 px-4 rounded mr-2"
                onClick={() => {
                  setExpression('');
                  togglePopup();
                }
                }
              >
                Cancelar
              </button>
              <button
                type="button"
                className={`${isValid
                  ? 'bg-sea-green-600 hover:bg-sea-green-700'
                  : 'bg-gray-400 cursor-not-allowed'
                  } text-white font-bold py-2 px-4 rounded`}
                onClick={() => {
                  if (isValid) {
                    setInputValue(`${inputValue} $$${expression}$$`);
                    setExpression('');
                    togglePopup();
                  }
                }}
                disabled={!isValid}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormulaPopup;