import React, { useState, useEffect } from 'react';
import { Global } from "../../../../helpers/Global";

const WeeklyChallenge = () => {
  const [completedQuizzes, setCompletedQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Constants
  const WEEKLY_GOAL = 5;

  useEffect(() => {
    fetchCompletedQuizzes();
  }, []);

  const fetchCompletedQuizzes = async () => {
    try {
      const response = await fetch(`${Global.url}quiz/completed-quizzes`, {
        headers: {
          'Authorization': localStorage.getItem('token')
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch completed quizzes');
      }

      const data = await response.json();

      // Filter quizzes completed this week
      const now = new Date();
      const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());

      const thisWeeksQuizzes = data.completedQuizzes.filter(quiz => {
        const completedDate = new Date(quiz.completedAt);
        return completedDate >= startOfWeek;
      });

      setCompletedQuizzes(thisWeeksQuizzes);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const calculateProgress = () => {
    const completed = completedQuizzes.length;
    const percentage = Math.min((completed / WEEKLY_GOAL) * 100, 100);
    return {
      completed,
      percentage
    };
  };

  if (loading) {
    return (
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl animate-pulse">
        <div className="h-4 bg-blue-200 dark:bg-blue-800 rounded w-3/4 mb-3"></div>
        <div className="h-3 bg-blue-200 dark:bg-blue-800 rounded w-full mb-3"></div>
        <div className="h-2 bg-blue-200 dark:bg-blue-800 rounded-full w-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl">
        <p className="text-red-600 dark:text-red-400">Failed to load challenge progress</p>
      </div>
    );
  }

  const { completed, percentage } = calculateProgress();

  return (
    <div className="w-full max-w-sm bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
      <h4 className="font-medium text-blue-600 dark:text-blue-400 mb-2">
        Reto Semanal
      </h4>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
        Completa {WEEKLY_GOAL} ejercicios esta semana
      </p>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className="bg-blue-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        {completed} de {WEEKLY_GOAL} completados
      </p>

      {completed >= WEEKLY_GOAL && (
        <div className="mt-3 text-sm text-green-600 dark:text-green-400 font-medium">
          ¡Felicitaciones! Has completado el reto semanal 🎉
        </div>
      )}
    </div>
  );
};

export default WeeklyChallenge;