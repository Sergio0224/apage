import { useState, useEffect } from 'react';

// Constantes para caracteres válidos
const VALID_NUMBERS = '0123456789';
const VALID_OPERATORS = '+-*/=';
const VALID_VARIABLES = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const VALID_GROUPING = '()[]{}';

// Estados del Autómata
export const States = {
  START: 'START',
  LATEX_START: 'LATEX_START',
  LATEX_END: 'LATEX_END',
  NUMBER: 'NUMBER',
  OPERATOR: 'OPERATOR',
  VARIABLE: 'VARIABLE',
  OPEN_GROUP: 'OPEN_GROUP',
  CLOSE_GROUP: 'CLOSE_GROUP',
  FRAC_START: 'FRAC_START',
  FRAC_FIRST_OPEN: 'FRAC_FIRST_OPEN',
  FRAC_FIRST_CONTENT: 'FRAC_FIRST_CONTENT',
  FRAC_FIRST_CLOSE: 'FRAC_FIRST_CLOSE',
  FRAC_SECOND_OPEN: 'FRAC_SECOND_OPEN',
  FRAC_SECOND_CONTENT: 'FRAC_SECOND_CONTENT',
  FRAC_SECOND_CLOSE: 'FRAC_SECOND_CLOSE',
  POWER_START: 'POWER_START',
  POWER_OPEN: 'POWER_OPEN',
  POWER_CONTENT: 'POWER_CONTENT',
  POWER_CLOSE: 'POWER_CLOSE',
  ERROR: 'ERROR'
};

const getNextState = (currentState, char, nextChars = '') => {
  switch (currentState) {
    case States.START:
      if (char === '\\') {
        if (nextChars.startsWith('\\[')) return States.LATEX_START;
        if (nextChars.startsWith('\\frac')) return States.FRAC_START;
      }
      if (VALID_NUMBERS.includes(char)) return States.NUMBER;
      if (VALID_VARIABLES.includes(char)) return States.VARIABLE;
      if ('(['.includes(char)) return States.OPEN_GROUP;
      return States.ERROR;

    case States.LATEX_START:
      if (char === '\\' && nextChars.startsWith('\\frac')) return States.FRAC_START;
      if (VALID_NUMBERS.includes(char)) return States.NUMBER;
      if (VALID_VARIABLES.includes(char)) return States.VARIABLE;
      if ('([{'.includes(char)) return States.OPEN_GROUP;
      return States.ERROR;

    case States.NUMBER:
      if (VALID_NUMBERS.includes(char)) return States.NUMBER;
      if (VALID_OPERATORS.includes(char)) return States.OPERATOR;
      if (VALID_VARIABLES.includes(char)) return States.VARIABLE;
      if (')]}'.includes(char)) return States.CLOSE_GROUP;
      if (char === '^') return States.POWER_START;
      if (char === '\\') {
        if (nextChars.startsWith('\\frac')) return States.FRAC_START;
        if (nextChars.startsWith('\\]')) return States.LATEX_END;
      }
      return States.ERROR;

    case States.VARIABLE:
      if (VALID_OPERATORS.includes(char)) return States.OPERATOR;
      if (VALID_VARIABLES.includes(char)) return States.VARIABLE;
      if (VALID_NUMBERS.includes(char)) return States.NUMBER;
      if (')]}'.includes(char)) return States.CLOSE_GROUP;
      if (char === '^') return States.POWER_START;
      if (char === '\\') {
        if (nextChars.startsWith('\\frac')) return States.FRAC_START;
        if (nextChars.startsWith('\\]')) return States.LATEX_END;
      }
      return States.ERROR;

    case States.OPERATOR:
      if (VALID_NUMBERS.includes(char)) return States.NUMBER;
      if (VALID_VARIABLES.includes(char)) return States.VARIABLE;
      if ('([{'.includes(char)) return States.OPEN_GROUP;
      if (char === '\\' && nextChars.startsWith('\\frac')) return States.FRAC_START;
      return States.ERROR;

    case States.OPEN_GROUP:
      if (VALID_NUMBERS.includes(char)) return States.NUMBER;
      if (VALID_VARIABLES.includes(char)) return States.VARIABLE;
      if ('([{'.includes(char)) return States.OPEN_GROUP;
      if (char === '\\' && nextChars.startsWith('\\frac')) return States.FRAC_START;
      return States.ERROR;

    case States.CLOSE_GROUP:
      if (VALID_OPERATORS.includes(char)) return States.OPERATOR;
      if (')]}'.includes(char)) return States.CLOSE_GROUP;
      if (char === '^') return States.POWER_START;
      if (char === '\\') {
        if (nextChars.startsWith('\\]')) return States.LATEX_END;
        if (nextChars.startsWith('\\frac')) return States.FRAC_START;
      }
      return States.ERROR;

    case States.FRAC_START:
      if (char === '{') return States.FRAC_FIRST_OPEN;
      return currentState;

    case States.FRAC_FIRST_OPEN:
      if (VALID_NUMBERS.includes(char)) return States.FRAC_FIRST_CONTENT;
      if (VALID_VARIABLES.includes(char)) return States.FRAC_FIRST_CONTENT;
      if ('([{'.includes(char)) return States.OPEN_GROUP;
      return States.ERROR;

    case States.FRAC_FIRST_CONTENT:
      if (char === '}') return States.FRAC_FIRST_CLOSE;
      if (VALID_NUMBERS.includes(char)) return States.FRAC_FIRST_CONTENT;
      if (VALID_VARIABLES.includes(char)) return States.FRAC_FIRST_CONTENT;
      if (VALID_OPERATORS.includes(char)) return States.OPERATOR;
      if ('([{'.includes(char)) return States.OPEN_GROUP;
      return States.ERROR;

    case States.FRAC_FIRST_CLOSE:
      if (char === '{') return States.FRAC_SECOND_OPEN;
      return States.ERROR;

    case States.FRAC_SECOND_OPEN:
      if (VALID_NUMBERS.includes(char)) return States.FRAC_SECOND_CONTENT;
      if (VALID_VARIABLES.includes(char)) return States.FRAC_SECOND_CONTENT;
      if ('([{'.includes(char)) return States.OPEN_GROUP;
      return States.ERROR;

    case States.FRAC_SECOND_CONTENT:
      if (char === '}') return States.FRAC_SECOND_CLOSE;
      if (VALID_NUMBERS.includes(char)) return States.FRAC_SECOND_CONTENT;
      if (VALID_VARIABLES.includes(char)) return States.FRAC_SECOND_CONTENT;
      if (VALID_OPERATORS.includes(char)) return States.OPERATOR;
      if ('([{'.includes(char)) return States.OPEN_GROUP;
      return States.ERROR;

    case States.FRAC_SECOND_CLOSE:
      if (char === '\\' && nextChars.startsWith('\\]')) return States.LATEX_END;
      if (VALID_OPERATORS.includes(char)) return States.OPERATOR;
      if (')]}'.includes(char)) return States.CLOSE_GROUP;
      if (char === '^') return States.POWER_START;
      return States.ERROR;

    case States.POWER_START:
      if (char === '{') return States.POWER_OPEN;
      if (VALID_NUMBERS.includes(char)) return States.POWER_CONTENT;
      if (VALID_VARIABLES.includes(char)) return States.POWER_CONTENT;
      return States.ERROR;

    case States.POWER_OPEN:
      if (VALID_NUMBERS.includes(char)) return States.POWER_CONTENT;
      if (VALID_VARIABLES.includes(char)) return States.POWER_CONTENT;
      if ('([{'.includes(char)) return States.OPEN_GROUP;
      return States.ERROR;

    case States.POWER_CONTENT:
      if (char === '}') return States.POWER_CLOSE;
      if (VALID_NUMBERS.includes(char)) return States.POWER_CONTENT;
      if (VALID_VARIABLES.includes(char)) return States.POWER_CONTENT;
      if (VALID_OPERATORS.includes(char)) return States.OPERATOR;
      if ('([{'.includes(char)) return States.OPEN_GROUP;
      return States.ERROR;

    case States.POWER_CLOSE:
      if (VALID_OPERATORS.includes(char)) return States.OPERATOR;
      if (')]}'.includes(char)) return States.CLOSE_GROUP;
      if (char === '\\' && nextChars.startsWith('\\]')) return States.LATEX_END;
      return States.ERROR;

    case States.LATEX_END:
      return States.ERROR;

    default:
      return States.ERROR;
  }
};

const validateGroupingSymbols = (expr) => {
  const stack = [];
  const openBrackets = '([{';
  const closeBrackets = ')]}';
  let latexMode = false;

  for (let i = 0; i < expr.length; i++) {
    const char = expr[i];
    
    // Manejar modo LaTeX
    if (expr.slice(i).startsWith('\\[')) {
      latexMode = true;
      i++; // Saltar el siguiente carácter
      continue;
    }
    if (expr.slice(i).startsWith('\\]')) {
      latexMode = false;
      i++; // Saltar el siguiente carácter
      continue;
    }
    
    // Manejar fracciones
    if (expr.slice(i).startsWith('\\frac')) {
      i += 4; // Saltar 'frac'
      continue;
    }

    if (openBrackets.includes(char)) {
      stack.push({ char, pos: i });
    } else if (closeBrackets.includes(char)) {
      if (stack.length === 0) {
        return { isValid: false, position: i };
      }
      const last = stack.pop();
      const openIndex = openBrackets.indexOf(last.char);
      const closeIndex = closeBrackets.indexOf(char);
      if (openIndex !== closeIndex) {
        return { isValid: false, position: i };
      }
    }
  }

  if (stack.length > 0) {
    return { isValid: false, position: stack[stack.length - 1].pos };
  }

  if (latexMode) {
    return { isValid: false, position: expr.length - 1 };
  }

  return { isValid: true, position: -1 };
};

export const useAlgebraicValidator = () => {
  const [expression, setExpression] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState('');
  const [errorPosition, setErrorPosition] = useState(-1);

  const validateExpression = (expr) => {
    setErrorPosition(-1);

    if (!expr.trim()) {
      setError('La expresión no puede estar vacía');
      setIsValid(false);
      return;
    }

    // Validar símbolos de agrupación
    const groupingValidation = validateGroupingSymbols(expr);
    if (!groupingValidation.isValid) {
      setError('Error en los símbolos de agrupación (paréntesis, corchetes o llaves)');
      setErrorPosition(groupingValidation.position);
      setIsValid(false);
      return;
    }

    let currentState = States.START;
    let i = 0;

    while (i < expr.length) {
      const char = expr[i];
      const remainingChars = expr.slice(i);

      // Ignorar espacios
      if (char === ' ') {
        i++;
        continue;
      }

      // Manejar inicio de LaTeX
      if (char === '\\' && remainingChars.startsWith('\\[')) {
        currentState = States.LATEX_START;
        i += 2;
        continue;
      }

      // Manejar fin de LaTeX
      if (char === '\\' && remainingChars.startsWith('\\]')) {
        currentState = States.LATEX_END;
        i += 2;
        continue;
      }

      // Manejar fracciones
      if (char === '\\' && remainingChars.startsWith('\\frac')) {
        currentState = States.FRAC_START;
        i += 5; // Saltar "\\frac"
        continue;
      }

      currentState = getNextState(currentState, char, remainingChars);

      if (currentState === States.ERROR) {
        setError(`Secuencia de caracteres inválida cerca de la posición ${i + 1}`);
        setErrorPosition(i);
        setIsValid(false);
        return;
      }

      i++;
    }

    const validFinalStates = [
      States.NUMBER,
      States.VARIABLE,
      States.CLOSE_GROUP,
      States.POWER_CLOSE,
      States.POWER_CONTENT,
      States.FRAC_SECOND_CLOSE,
      States.LATEX_END
    ];

    if (!validFinalStates.includes(currentState)) {
      setError('La expresión termina con un token inválido');
      setErrorPosition(expr.length - 1);
      setIsValid(false);
      return;
    }

    setError('');
    setErrorPosition(-1);
    setIsValid(true);
  };

  useEffect(() => {
    validateExpression(expression);
  }, [expression]);

  return {
    expression,
    setExpression,
    isValid,
    error,
    errorPosition,
  };
};