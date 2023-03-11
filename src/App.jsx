import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./Containers/Index";
import Login from "./Pages/Login";
import "./sass/style.scss";
import { Provider } from "react-redux";
import { store } from "./redux/store";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/*" element={<Index />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
