import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faClock, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { Global } from "../../../../helpers/Global";

const MathChallenges = () => {
  const [selectedCategory, setSelectedCategory] = useState('daily');
  const [challenges, setChallenges] = useState({
    daily: [],
    weekly: []
  });
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizProgress, setQuizProgress] = useState(null);

  // Fetch challenges from backend
  const fetchChallenges = async () => {
    try {
      const response = await fetch(`${Global.url}quiz/get-quizzes?category=${selectedCategory}`, {
        headers: {
          'Authorization': `${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();

      if (data.status === "success") {
        setChallenges(prev => ({
          ...prev,
          [selectedCategory]: data.quizzes
        }));
      }
    } catch (error) {
      console.error('Error fetching challenges:', error);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, [selectedCategory]);

  // Timer logic
  useEffect(() => {
    let timer;
    if (selectedQuiz && timeLeft > 0 && !quizCompleted) {
      timer = setInterval(async () => {
        setTimeLeft(prev => {
          const newTime = prev - 1;

          // Actualizar progreso en el servidor cada 5 segundos
          if (newTime % 5 === 0) {
            updateProgress(newTime);
          }

          if (newTime <= 0) {
            submitQuiz();
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [selectedQuiz, timeLeft, quizCompleted]);

  const updateProgress = async (currentTime) => {
    try {
      await fetch(`${Global.url}quiz/progress/${selectedQuiz._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          currentQuestion,
          timeRemaining: currentTime,
          answers
        })
      });
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const fetchQuizProgress = async (quizId) => {
    try {
      const response = await fetch(`${Global.url}quiz/progress/${quizId}`, {
        headers: {
          'Authorization': `${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();

      if (data.status === "success") {
        return data.progress;
      }
      return null;
    } catch (error) {
      console.error('Error fetching progress:', error);
      return null;
    }
  };

  const handleStartQuiz = async (challenge) => {
    // Verificar si ya hay progreso
    const progress = await fetchQuizProgress(challenge._id);

    if (progress) {
      if (progress.completed) {
        alert('Ya has completado este quiz anteriormente.');
        return;
      }

      // Restaurar progreso
      setSelectedQuiz(challenge);
      setCurrentQuestion(progress.currentQuestion);
      setAnswers(progress.answers.map(a => a.answer));
      setTimeLeft(progress.timeRemaining);
      setQuizProgress(progress);
    } else {
      // Iniciar nuevo quiz
      setSelectedQuiz(challenge);
      setCurrentQuestion(0);
      setAnswers([]);
      setQuizCompleted(false);
      setScore(0);
      setTimeLeft(parseInt(challenge.timeLimit) * 60); // Convertir minutos a segundos
      setQuizProgress(null);
    }
  };

  const submitQuiz = async () => {
    try {
      const response = await fetch(`${Global.url}quiz/submit/${selectedQuiz._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ answers })
      });

      const data = await response.json();
      if (data.status === "success") {
        setScore(data.score);
        setQuizCompleted(true);
        // Actualizar la lista de quizzes para reflejar el nuevo estado
        fetchChallenges();
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  const handleAnswerSelection = async (questionIndex, answerIndex) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answerIndex;
    setAnswers(newAnswers);

    // Actualizar progreso en el servidor con la nueva respuesta
    try {
      await fetch(`${Global.url}quiz/progress/${selectedQuiz._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          currentQuestion: questionIndex,
          timeRemaining: timeLeft,
          answer: answerIndex
        })
      });
    } catch (error) {
      console.error('Error updating answer:', error);
    }

    if (questionIndex === selectedQuiz.questions.length - 1) {
      await submitQuiz();
    } else {
      setCurrentQuestion(questionIndex + 1);
    }
  };

  // Renderizar el quiz actual
  if (selectedQuiz) {
    if (quizCompleted) {
      return (
        <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-[#242424] rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4 dark:text-white">¡Quiz Completado!</h2>
          <p className="text-lg mb-4 dark:text-gray-300">Tu puntuación: {score} puntos</p>
          <button
            onClick={() => setSelectedQuiz(null)}
            className="px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
          >
            Volver a los retos
          </button>
        </div>
      );
    }

    const currentQ = selectedQuiz.questions[currentQuestion];
    const progressPercentage = (currentQuestion / selectedQuiz.questions.length) * 100;

    return (
      <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-[#242424] rounded-xl shadow-lg">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold dark:text-white">{selectedQuiz.title}</h2>
            <div className="text-lg font-medium dark:text-white">
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
          </div>

          {/* Barra de progreso del quiz */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          <p className="text-gray-600 dark:text-gray-400">
            Pregunta {currentQuestion + 1} de {selectedQuiz.questions.length}
          </p>
        </div>

        <div className="mb-8">
          <h3 className="text-lg mb-4 dark:text-white">{currentQ.question}</h3>
          <div className="space-y-3">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelection(currentQuestion, index)}
                className="w-full p-4 text-left rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors dark:text-white"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Renderizar lista de retos
  return (
    <div className="flex w-full min-h-screen ">
      <div className="flex-1 max-w-5xl mx-auto px-4 py-6">
        {/* Filtros de categoría */}
        <div className="flex space-x-4 mb-6">
          {['daily', 'weekly'].map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-xl text-sm font-medium transition-colors ${selectedCategory === category
                ? 'bg-blue-500 text-white'
                : 'bg-white dark:bg-[#242424] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2a2a2a]'
                }`}
            >
              {category === 'daily' ? 'Retos Diarios' : 'Retos Semanales'}
            </button>
          ))}
        </div>

        {/* Grid de retos */}
        <div className="grid gap-6 md:grid-cols-2">
          {challenges[selectedCategory]?.map((challenge) => (
            <div key={challenge._id} className="bg-white dark:bg-[#242424] rounded-xl shadow-lg flex flex-col">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium dark:text-white">{challenge.title}</h3>
                  <span className="px-3 py-1 rounded-full text-sm font-medium">
                    {challenge.difficulty}
                  </span>
                </div>

                <div className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-400">{challenge.description}</p>

                  {/* Estado del quiz - ahora con altura fija */}
                  <div className="h-10 flex items-center">
                    {challenge.completed && (
                      <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 p-2 rounded-lg w-full">
                        Quiz completado
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faUsers} className="w-4 h-4 mr-2" />
                        {challenge.participants}
                      </div>
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faClock} className="w-4 h-4 mr-2" />
                        {challenge.timeLimit} min
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faTrophy} className="w-4 h-4 mr-2 text-yellow-500" />
                      <span className="font-medium">{challenge.points} pts</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 dark:bg-[#2a2a2a] border-t dark:border-[#3a3a3a]">
                <button
                  onClick={() => handleStartQuiz(challenge)}
                  disabled={challenge.completed}
                  className={`w-full px-4 py-2 rounded-xl transition-colors ${challenge.completed
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                >
                  {challenge.completed ? 'Quiz Completado' : 'Comenzar Quiz'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MathChallenges;