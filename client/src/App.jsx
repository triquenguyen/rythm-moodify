import './App.css'

import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Home } from './Home.jsx'; 
import { Gen } from './Gen.jsx'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path='/' element={<Home/>}/>
        <Route path='/gen' element={<Gen/>}/>
      </Routes>
    </BrowserRouter>
  );
}
export default App

