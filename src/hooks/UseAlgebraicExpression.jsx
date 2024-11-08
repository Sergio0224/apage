import React, { useContext } from 'react'
import { ExpressionContext } from "../contexts/AlgebraicExpression"

const UseAlgebraicExpression = () => {
    return useContext(ExpressionContext)
}

export default UseAlgebraicExpression