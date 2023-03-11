import React, { useMemo, useState, useRef } from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../Pages/Dashboard";
import Shows from "../Pages/Shows";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        {/* <Route path="/agenda" element={<Agenda />} />
        <Route path="/actions" element={<Actions />} />
        */}
        <Route path="/spectacles" element={<Shows />} />
        {/* <Route path="/creation-spectacle" element={<CreateShow />} />
        <Route path="/spectacle/:id/gallerie" element={<ShowGallery />} />  */}
      </Routes>
    </div>
  );
};

export default App;
