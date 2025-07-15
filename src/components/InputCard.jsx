import React, { useState, useEffect } from "react";
import Chatbot from './Chatbot';
import { inputQuestions } from './questions';
import PocketBase from 'pocketbase';

const pb = new PocketBase('https://clarifi.nl/pb');

function formatNumber(value) {
  if (value === undefined || value === null || value === "") return "";
  const num = Number(value.toString().replace(/\./g, ""));
  if (isNaN(num)) return "";
  return num.toLocaleString('de-DE');
}

function parseNumber(str) {
  if (!str) return "";
  return str.replace(/\./g, "");
}

export default function InputCard({ form, setForm, onSubmit }) {
  const [chatbotMode, setChatbotMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const user = pb.authStore.model;

  // Fetch data from PocketBase if logged in
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    pb.collection('inputs').getFirstListItem(`user = "${user.id}"`).then(record => {
      const newForm = {};
      inputQuestions.forEach(q => {
        newForm[q.key] = record[q.key] || '';
      });
      setForm(newForm);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user, setForm]);

  // Save to PocketBase on change if logged in
  useEffect(() => {
    if (!user) return;
    if (loading) return;
    // Save/update record for this user
    const save = async () => {
      try {
        // Try to get existing record
        let record;
        try {
          record = await pb.collection('inputs').getFirstListItem(`user = "${user.id}"`);
        } catch {
          record = null;
        }
        const data = {};
        inputQuestions.forEach(q => {
          data[q.key] = form[q.key] || '';
        });
        data.user = user.id;
        if (record) {
          await pb.collection('inputs').update(record.id, data);
        } else {
          await pb.collection('inputs').create(data);
        }
      } catch (e) {
        // Ignore save errors for now
      }
    };
    save();
  }, [form, user, loading]);

  // Pass setForm to Chatbot so it can update the same state
  return (
    <div className="card p-3 pb-2 mb-2 text-base relative">
      {/* Toggle button in top right */}
      <button
        className="absolute top-2 right-2 primary-action text-xs px-3 py-1"
        onClick={() => setChatbotMode(m => !m)}
      >
        {chatbotMode ? 'Manual input' : 'Chatbot'}
      </button>
      <h2 className="text-base font-bold mb-2 pr-20">Financial Input</h2>
      {loading && <div className="text-gray-400 text-center py-2">Loading your data...</div>}
      {error && <div className="text-red-500 text-center py-2">{error}</div>}
      {!loading && (chatbotMode ? (
        <Chatbot form={form} setForm={setForm} user={user} />
      ) : (
        <div className="space-y-2">
          {inputQuestions.map(q => (
            <div key={q.key}>
              <label className="text-base font-semibold mb-1">{q.label}</label>
              <input
                type="text"
                inputMode="numeric"
                className="text-base px-3 py-2 mb-2"
                value={formatNumber(form[q.key])}
                onChange={e => {
                  const raw = parseNumber(e.target.value);
                  setForm(f => ({ ...f, [q.key]: raw }));
                }}
                placeholder={`Enter your ${q.label.toLowerCase().replace(/:$/, '')}`}
                required
              />
            </div>
          ))}
          <button
            className="primary-action w-full text-base mt-2"
            onClick={onSubmit}
            type="button"
          >
            Calculate
          </button>
        </div>
      ))}
    </div>
  );
}