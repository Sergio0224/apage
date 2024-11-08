import React from 'react';

const SyntaxHighlighter = ({ expression }) => {
  const highlightToken = (token) => {
    // Números
    if (/^\d+$/.test(token)) {
      return <span className="text-green-600">{token}</span>;
    }
    // Operadores
    if (/^[+\-*/^]$/.test(token)) {
      return <span className="text-blue-600">{token}</span>;
    }
    // Variables
    if (/^[xyz]$/.test(token)) {
      return <span className="text-purple-600">{token}</span>;
    }
    // Paréntesis
    if (/^[()]$/.test(token)) {
      return <span className="text-yellow-600">{token}</span>;
    }
    // Fracciones
    if (token.startsWith('\\frac')) {
      return <span className="text-pink-600">{token}</span>;
    }
    // Otros caracteres
    return token;
  };

  const tokenize = (expr) => {
    const tokens = [];
    let current = '';
    let i = 0;

    while (i < expr.length) {
      const char = expr[i];
      
      // Manejar fracciones
      if (char === '\\' && expr.slice(i, i + 5) === '\\frac') {
        if (current) tokens.push(current);
        tokens.push('\\frac');
        current = '';
        i += 5;
        continue;
      }

      // Manejar operadores y paréntesis
      if (/[+\-*/^()]/.test(char)) {
        if (current) tokens.push(current);
        tokens.push(char);
        current = '';
      } else {
        current += char;
      }

      i++;
    }

    if (current) tokens.push(current);
    return tokens;
  };

  return (
    <div className="font-mono p-4 bg-gray-50 rounded-lg">
      {tokenize(expression).map((token, index) => (
        <React.Fragment key={index}>
          {highlightToken(token)}
        </React.Fragment>
      ))}
    </div>
  );
};

export default SyntaxHighlighter;