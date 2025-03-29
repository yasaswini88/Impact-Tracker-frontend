// App.js
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import './App.css';
import ReactBigCalendar from './components/ReactBigCalendar';
import Dashboard from './components/Dashboard';
import MyAppBar from './components/AppBar';

import Home from "./components/Home";
import SalesAdminDashboard from "./components/SalesAdminDashboard";
import SalesAdminDashboard2 from "./components/SalesAdminDashboard2";
import Layout from "./components/Layout";
import Plans from "./components/Plans";
import Features from "./components/Features";
import CallCampaigns from "./components/CallCampaigns";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <MyAppBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard/:businessId" element={<Dashboard />} />
          <Route path="/business-calendar/:businessId" element={<ReactBigCalendar />} />
          <Route element={<Layout />}>
          <Route path="/plans" element={<Plans />} />
          <Route path="/features" element={<Features />} />
          <Route path="/call-campaigns" element={<CallCampaigns />} />
        </Route>
          <Route path="/sales-admin-dashboard" element={<SalesAdminDashboard />} />
          {/* <Route path="/sales-admin-dashboard2" element={<SalesAdminDashboard2 />} /> */}

        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
