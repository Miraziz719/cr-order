import React, { useEffect } from 'react';
import './App.css';
import { useTelegram } from './hooks/useTelegram';
import ProductList from "./components/ProductList/ProductList"
import { Route, Routes } from 'react-router-dom';


function App() {
  const {tg} = useTelegram();

  useEffect(() => {
    tg.ready()
  }, [tg])

  return (
    <div className="App">
      <Routes>
        <Route index element={<ProductList />}/>
      </Routes>
    </div> 
  );
}

export default App;
