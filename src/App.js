import logo from './logo.svg';
import './App.css';
import {Pathfind} from './components/Pathfind';
import { useEffect, useState } from 'react';
import Market from './components/Market';
import {BrowserRouter as Router, Routes, Route, useNavigate} from "react-router-dom";

function App() {
  let [Products, setProducts] = useState(new Array());

  const addProds = (args) =>{
    setProducts(args);
  }

 
     
  return (
    <div>
      <div className='headerBar'></div>
      <Market addProd = {addProds}/>
      <Pathfind products = {Products} />
      <h1><br></br></h1>
      <div className='footerBar'></div>
    </div>
  );
}




export default App;
