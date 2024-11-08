import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import UseAlgebraicExpression from '../../../hooks/UseAlgebraicExpression';

const Paragraph = ({ content }) => {

  const { renderExpression } = UseAlgebraicExpression();

  const renderers = {
    math: ({ value }) => <span>{renderExpression(value)}</span>,
    inlineMath: ({ value }) => <span>{renderExpression(value)}</span>,
  };

  return (
    <div className="py-6">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={renderers}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default Paragraph;