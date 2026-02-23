import { useState } from 'react';

export default function TestReact() {
  const [count, setCount] = useState(0);

  return (
    <div
      style={{
        padding: '1rem',
        border: '1px solid #61dafb',
        borderRadius: '8px',
        margin: '1rem 0',
      }}
    >
      <h3>React Component</h3>
      <p>Count: {count}</p>
      <button
        type='button'
        onClick={() => setCount(count + 1)}
        style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
      >
        Increment
      </button>
    </div>
  );
}
