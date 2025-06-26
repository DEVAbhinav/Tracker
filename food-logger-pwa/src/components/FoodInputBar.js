import React, { useRef } from 'react';

const FoodInputBar = ({ value, onChange, onSubmit, placeholder = 'Enter food...', style }) => {
  const inputRef = useRef(null);

  // Speech-to-text handler
  const handleSpeech = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser.');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onChange(transcript);
      if (inputRef.current) inputRef.current.focus();
    };
    recognition.onerror = (event) => {
      alert('Speech recognition error: ' + event.error);
    };
    recognition.start();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSubmit && onSubmit();
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, ...style }}>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        style={{ flex: 1, padding: 8, fontSize: 16 }}
        aria-label="Food input"
      />
      <button
        type="button"
        onClick={handleSpeech}
        aria-label="Speak"
        style={{ padding: '8px 12px', fontSize: 16 }}
      >
        🎤
      </button>
      <button
        type="button"
        onClick={onSubmit}
        aria-label="Submit"
        style={{ padding: '8px 12px', fontSize: 16 }}
      >
        ➤
      </button>
    </div>
  );
};

export default FoodInputBar;
