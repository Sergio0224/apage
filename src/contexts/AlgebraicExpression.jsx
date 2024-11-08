import React, { createContext, useState } from 'react'
import katex from 'katex';
import 'katex/dist/katex.min.css';

export const ExpressionContext = createContext()

export const AlgebraicExpression = ({ children }) => {
    const [expression, setExpression] = useState('');
    const [base, setBase] = useState('');
    const [exponent, setExponent] = useState('');
    const [inputValue, setInputValue] = useState("")

    const renderExpression = (expression) => {
        try {
            return <div dangerouslySetInnerHTML={{ __html: katex.renderToString(expression) }} />;
        } catch (err) {
            return <div>Invalid expression</div>;
        }
    };

    return (
        <ExpressionContext.Provider
            value={
                {
                    expression,
                    setExpression,
                    base,
                    setBase,
                    exponent,
                    setExponent,
                    renderExpression,
                    inputValue,
                    setInputValue
                }
            }>
            {children}
        </ExpressionContext.Provider>
    )
}