import React, { useEffect } from 'react';
import './App.css';
import { useTelegram } from './hooks/useTelegram';
import ProductList from "./components/ProductList/ProductList"
import Header from "./components/Header/Header"
import { Route, Routes } from 'react-router-dom';
import { useLocation } from "react-router-dom";

function App() {
  const {tg} = useTelegram();

  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const token = queryParams.get('token')

  useEffect(() => {
    tg.ready()
  }, [tg])

  return (
    <div className="App">
      {token && <Header />}
      <Routes>
        <Route index element={<ProductList />}/>
      </Routes>
    </div> 
  );
}

export default App;
