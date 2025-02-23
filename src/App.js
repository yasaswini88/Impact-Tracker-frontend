// App.js
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import './App.css';
import ReactBigCalendar from './components/ReactBigCalendar';
import Dashboard from './components/Dashboard';
import MyAppBar from './components/AppBar';
import Home from "./components/Home";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <MyAppBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard/:businessId" element={<Dashboard />} />
          <Route path="/business-calendar/:businessId" element={<ReactBigCalendar />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
