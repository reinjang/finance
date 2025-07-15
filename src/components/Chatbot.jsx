import React, { useState, useEffect } from 'react';
import { inputQuestions } from './questions';

const OLLAMA_API_URL = 'http://localhost:11434/api/generate';
const MODEL = 'llama3';

async function getFriendlyQuestion(label) {
  const prompt = `Please ask the user for their ${label} in a friendly, conversational way. Only ask the question, do not provide any explanation.`;
  const res = await fetch(OLLAMA_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: MODEL, prompt, stream: false })
  });
  const data = await res.json();
  return data.response.trim();
}

async function extractValueFromAnswer(label, answer) {
  const prompt = `Extract the numeric value for the user's ${label} from the following answer. Only return the number, no explanation. If the answer is not a number, return null. Answer: '${answer}'`;
  const res = await fetch(OLLAMA_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: MODEL, prompt, stream: false })
  });
  const data = await res.json();
  return data.response.trim();
}

export default function Chatbot({ form, setForm, user }) {
  const [step, setStep] = useState(0);
  const [messages, setMessages] = useState([
    { role: 'system', content: 'Hi! I will guide you through a few questions.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [question, setQuestion] = useState('');

  // Ask the next question using the LLM
  useEffect(() => {
    if (step < inputQuestions.length) {
      setLoading(true);
      getFriendlyQuestion(inputQuestions[step].label)
        .then(q => {
          setQuestion(q);
          setMessages(msgs => [...msgs, { role: 'assistant', content: q }]);
        })
        .catch(() => setQuestion(inputQuestions[step].label))
        .finally(() => setLoading(false));
    }
    // eslint-disable-next-line
  }, [step]);

  // Keep local answers in sync with form prop
  useEffect(() => {
    if (step === 0) return;
    inputQuestions.forEach((q, idx) => {
      if (form[q.key] && idx < step) {
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
    const currentLabel = inputQuestions[step]?.label;
    setMessages(msgs => [...msgs, { role: 'user', content: input }]);
    setLoading(true);
    setError('');
    try {
      // Extract value using LLM
      const extracted = await extractValueFromAnswer(currentLabel, input);
      setForm(f => ({ ...f, [currentKey]: extracted }));
      setInput('');
      setStep(s => s + 1);
    } catch (err) {
      setError('Failed to extract value.');
    } finally {
      setLoading(false);
    }
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