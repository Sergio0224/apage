import React from 'react';
import { Global } from '../../../helpers/Global';
import ReactMarkdown from 'react-markdown';
import ReactTimeAgo from 'react-time-ago';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

const Comment = ({ comment }) => {
    const isGeneratedByAI = comment.user._id === "672e2f2739660583248bab18";

    const renderers = {
        math: ({ value }) => <span>{value}</span>,
        inlineMath: ({ value }) => <span>{value}</span>,
    };

    return (
        <li className="flex gap-4 py-4 items-start text-gray-700 dark:text-gray-300">
            <div className="relative flex-shrink-0">
                <img
                    src={`${comment.user.image}`}
                    alt="Avatar"
                    className={`w-10 h-10 rounded-full object-cover ${isGeneratedByAI ? "bg-green-100 dark:bg-green-900" : ""}`}
                />
                {isGeneratedByAI && (
                    <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 text-white">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                    </div>
                )}
            </div>
            <div className="flex flex-col gap-1 flex-grow">
                <div className='flex items-center gap-2 flex-wrap'>
                    <span className="font-semibold">{comment.user.name}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        <ReactTimeAgo date={new Date(comment.created_at)} locale='es' />
                    </span>
                    {isGeneratedByAI && (
                        <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs font-medium px-2 py-0.5 rounded">
                            IA
                        </span>
                    )}
                </div>
                <ReactMarkdown
                    className="text-sm text-left"
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    components={renderers}
                >
                    {comment.text}
                </ReactMarkdown>
            </div>
        </li>
    );
};

export default Comment;