import React from 'react';
import { Link } from 'react-router-dom';

const topics = [
  { id: 'Límites', title: 'Límites' },
  { id: 'Derivadas', title: 'Derivadas' },
  { id: 'matrices', title: 'Matrices' },
  { id: 'sistema-de-ecuaciones', title: 'Sistema de ecuaciones' },
  { id: 'determinantes', title: 'Determinantes' },
];

const Learning = () => {
  return (
    <div className="w-full p-6">
      <h2 className="text-2xl font-bold mb-6 pb-2 border-b-2 border-gray-200 dark:border-gray-700">
        Temas
      </h2>
      <ul className="flex flex-wrap gap-4">
        {topics.map((topic) => (
          <li
            key={topic.id}
            className="flex-grow"
          >
            <Link
              to={`/home/aprendizaje/${topic.id}`}
              className="block py-3 px-6 w-full dark:bg-[#242424] bg-[#F2F2F2] rounded-full text-center transition-all duration-300 hover:shadow-md hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
            >
              {topic.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Learning;