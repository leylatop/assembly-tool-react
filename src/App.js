import './App.less';
import React, {useState} from 'react'
import {VisualEditor} from './packages'
import './App.less'

function App() {
  const [count, setCount] = useState(0)
  return (
    <div className="App">
      <h1>这是首页</h1>
      <VisualEditor />
    </div>
  );
}

export default App;
