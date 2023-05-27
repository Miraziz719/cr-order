import { useEffect } from 'react';
import './App.css';
import { useTelegram } from './hooks/useTelegram';
import Header from './components/Header/Header'
import Button from "./components/Button/Button"


function App() {
  const {tg, onToggleButton} = useTelegram();

  useEffect(() => {
    tg.ready()
  }, [tg])

  return (
    <div className="App">
      <Header />
      <Button onClick={onToggleButton}>Toggle</Button>
    </div>
  );
}

export default App;
