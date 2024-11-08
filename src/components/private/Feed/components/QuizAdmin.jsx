import React, { useState } from 'react';
import { Global } from "../../../../helpers/Global"

const QuizAdmin = () => {
  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    category: 'daily',
    difficulty: 'Básico',
    timeLimit: '',
    points: 0,
    questions: []
  });

  const [currentQuestion, setCurrentQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleQuizDataChange = (e) => {
    const { name, value } = e.target;
    setQuizData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQuestionChange = (e) => {
    const { name, value } = e.target;
    setCurrentQuestion(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion(prev => ({
      ...prev,
      options: newOptions
    }));
  };

  const addQuestion = () => {
    if (!currentQuestion.question || currentQuestion.options.some(opt => !opt)) {
      setError('Por favor completa todos los campos de la pregunta');
      return;
    }

    setQuizData(prev => ({
      ...prev,
      questions: [...prev.questions, currentQuestion]
    }));

    setCurrentQuestion({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0
    });

    setError('');
  };

  const removeQuestion = (index) => {
    setQuizData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (quizData.questions.length === 0) {
      setError('El quiz debe tener al menos una pregunta');
      return;
    }

    try {
      const response = await fetch(Global.url + 'quiz/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${localStorage.getItem('token')}`
        },
        body: JSON.stringify(quizData)
      });

      const data = await response.json();

      if (data.status === "success") {
        setSuccess('Quiz creado exitosamente');
        setQuizData({
          title: '',
          description: '',
          category: 'daily',
          difficulty: 'Básico',
          timeLimit: '',
          points: 0,
          questions: []
        });
      } else {
        setError('Error al crear el quiz');
      }
    } catch (error) {
      setError('Error al conectar con el servidor');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Crear Nuevo Quiz</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          ⚠️ {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          ✓ {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información básica del quiz */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Información del Quiz</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Título
              </label>
              <input
                type="text"
                name="title"
                value={quizData.title}
                onChange={handleQuizDataChange}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Categoría
              </label>
              <select
                name="category"
                value={quizData.category}
                onChange={handleQuizDataChange}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="daily">Diario</option>
                <option value="weekly">Semanal</option>
                <option value="competitive">Competitivo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Dificultad
              </label>
              <select
                name="difficulty"
                value={quizData.difficulty}
                onChange={handleQuizDataChange}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="Básico">Básico</option>
                <option value="Intermedio">Intermedio</option>
                <option value="Avanzado">Avanzado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tiempo Límite
              </label>
              <input
                type="text"
                name="timeLimit"
                value={quizData.timeLimit}
                onChange={handleQuizDataChange}
                placeholder="ej: 30 min"
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Puntos
              </label>
              <input
                type="number"
                name="points"
                value={quizData.points}
                onChange={handleQuizDataChange}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Descripción
              </label>
              <textarea
                name="description"
                value={quizData.description}
                onChange={handleQuizDataChange}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                rows="3"
                required
              />
            </div>
          </div>
        </div>

        {/* Agregar preguntas */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Agregar Pregunta</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Pregunta
              </label>
              <input
                type="text"
                name="question"
                value={currentQuestion.question}
                onChange={handleQuestionChange}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Opciones
              </label>
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="flex-1 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder={`Opción ${index + 1}`}
                  />
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={currentQuestion.correctAnswer === index}
                    onChange={() => setCurrentQuestion(prev => ({ ...prev, correctAnswer: index }))}
                    className="w-4 h-4"
                  />
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addQuestion}
              className="w-full p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              + Agregar Pregunta
            </button>
          </div>
        </div>

        {/* Lista de preguntas */}
        {quizData.questions.length > 0 && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">
              Preguntas ({quizData.questions.length})
            </h2>

            <div className="space-y-4">
              {quizData.questions.map((q, index) => (
                <div key={index} className="p-4 border rounded-lg dark:border-gray-600">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium dark:text-white">{q.question}</p>
                      <ul className="mt-2 space-y-1">
                        {q.options.map((opt, i) => (
                          <li
                            key={i}
                            className={`text-sm ${i === q.correctAnswer ? 'text-green-500' : 'text-gray-600 dark:text-gray-400'}`}
                          >
                            {opt} {i === q.correctAnswer && '✓'}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeQuestion(index)}
                      className="text-red-500 hover:text-red-600 px-2"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Guardar Quiz
        </button>
      </form>
    </div>
  );
};

export default QuizAdmin;