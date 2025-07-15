import React, { useState, useEffect } from 'react';
import { inputQuestions } from './questions';

export default function Chatbot({ form, setForm, user }) {
  const [step, setStep] = useState(0);
  const [messages, setMessages] = useState([
    { role: 'system', content: 'Hi! I will guide you through a few questions.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Ask the next question when step changes
  useEffect(() => {
    if (step < inputQuestions.length) {
      setMessages(msgs => [...msgs, { role: 'assistant', content: inputQuestions[step].label }]);
    }
  }, [step]);

  // Keep local answers in sync with form prop
  useEffect(() => {
    if (step === 0) return;
    // If form was updated externally, update messages
    inputQuestions.forEach((q, idx) => {
      if (form[q.key] && idx < step) {
        // Already answered, ensure message is present
        const already = messages.find(m => m.role === 'user' && m.content === form[q.key]);
        if (!already) {
          setMessages(msgs => [...msgs, { role: 'user', content: form[q.key] }]);
        }
      }
    });
    // eslint-disable-next-line
  }, [form]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const currentKey = inputQuestions[step]?.key;
    setMessages(msgs => [...msgs, { role: 'user', content: input }]);
    setForm(f => ({ ...f, [currentKey]: input }));
    setInput('');
    setLoading(true);
    setError('');
    setTimeout(() => {
      setLoading(false);
      setStep(s => s + 1);
    }, 400); // Simulate a short delay
  };

  const allAnswered = step >= inputQuestions.length;

  return (
    <div className="flex flex-col h-full min-h-[200px]">
      <div className="flex-1 overflow-y-auto mb-2 bg-white/60 rounded p-2 border border-gray-200" style={{ maxHeight: 260 }}>
        {messages.map((msg, i) => (
          <div key={i} className={msg.role === 'user' ? 'text-right' : 'text-left'}>
            <span className={msg.role === 'user' ? 'text-blue-600' : 'text-green-700 font-semibold'}>
              {msg.role === 'user' ? 'You: ' : 'Bot: '}
            </span>
            <span>{msg.content}</span>
          </div>
        ))}
        {loading && <div className="text-gray-400">Bot is typing...</div>}
        {allAnswered && (
          <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
            <div className="font-semibold mb-1 text-green-700">All questions answered!</div>
            <ul className="text-base text-green-900">
              {inputQuestions.map(q => (
                <li key={q.key}><span className="font-semibold">{q.label}</span> {form[q.key]}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {!allAnswered && (
        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            className="flex-1 border rounded px-2 py-1 text-base"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your answer..."
            disabled={loading}
            autoFocus
          />
          <button className="primary-action px-4 py-1 text-base" type="submit" disabled={loading || !input.trim()}>
            Send
          </button>
        </form>
      )}
      {error && <div className="text-red-500 mt-1">{error}</div>}
    </div>
  );
} 