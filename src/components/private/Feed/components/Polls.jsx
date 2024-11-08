import React from 'react';

export const PollDisplay = ({ poll, onVote, userId }) => {
  const hasVoted = poll.voters.includes(userId);
  const totalVotes = poll.totalVotes || 0;

  const calculatePercentage = (votes) => {
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium dark:text-white mb-4">{poll.question}</h3>
      <div className="space-y-3">
        {poll.options.map((option, index) => {
          const percentage = calculatePercentage(option.votes);

          return (
            <div key={option._id} className="relative">
              <button
                onClick={() => !hasVoted && onVote(index)}
                disabled={hasVoted}
                className={`w-full p-3 rounded-lg text-left relative overflow-hidden ${hasVoted
                    ? 'bg-gray-100 dark:bg-[#2a2a2a]'
                    : 'hover:bg-blue-50 dark:hover:bg-blue-900/20'
                  }`}
              >
                {/* Progress bar background */}
                {hasVoted && (
                  <div
                    className="absolute left-0 top-0 h-full bg-blue-100 dark:bg-blue-900/20 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                )}

                {/* Content */}
                <div className="relative flex justify-between items-center">
                  <span className="dark:text-white">{option.text}</span>
                  {hasVoted && (
                    <span className="text-blue-500 font-medium">{percentage}%</span>
                  )}
                </div>
              </button>
            </div>
          );
        })}
      </div>

      <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
        {totalVotes} {totalVotes === 1 ? 'voto' : 'votos'} •
        {hasVoted ? ' Has votado' : ' Haz clic para votar'}
      </div>
    </div>
  );
};

export const PollCreator = ({ onSubmit }) => {
  const [question, setQuestion] = React.useState('');
  const [options, setOptions] = React.useState(['', '']);
  const [duration, setDuration] = React.useState(1);

  const handleAddOption = () => {
    if (options.length < 4) {
      setOptions([...options, '']);
    }
  };

  const handleRemoveOption = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      question,
      options: options.map(text => ({ text, votes: 0 })),
      duration,
      voters: [],
      totalVotes: 0
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Escribe tu pregunta"
        className="w-full p-3 rounded-lg border dark:border-[#3a3a3a] dark:bg-[#2a2a2a] dark:text-white"
        required
      />

      <div className="space-y-3">
        {options.map((option, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={option}
              onChange={(e) => {
                const newOptions = [...options];
                newOptions[index] = e.target.value;
                setOptions(newOptions);
              }}
              placeholder={`Opción ${index + 1}`}
              className="flex-1 p-3 rounded-lg border dark:border-[#3a3a3a] dark:bg-[#2a2a2a] dark:text-white"
              required
            />
            {options.length > 2 && (
              <button
                type="button"
                onClick={() => handleRemoveOption(index)}
                className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      {options.length < 4 && (
        <button
          type="button"
          onClick={handleAddOption}
          className="w-full p-3 rounded-lg border border-dashed border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
        >
          + Añadir opción
        </button>
      )}

      <select
        value={duration}
        onChange={(e) => setDuration(Number(e.target.value))}
        className="w-full p-3 rounded-lg border dark:border-[#3a3a3a] dark:bg-[#2a2a2a] dark:text-white"
      >
        <option value={1}>1 día</option>
        <option value={3}>3 días</option>
        <option value={7}>7 días</option>
      </select>

      <button
        type="submit"
        className="w-full p-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
      >
        Crear encuesta
      </button>
    </form>
  );
};