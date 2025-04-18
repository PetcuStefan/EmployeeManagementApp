import { Routes, Route } from "react-router-dom";
import Login from "./Pages/Login/Login";
import Homepage from "./Pages/Homepage/Homepage";
import Companies from "./Pages/Companies/Companies";
import Stats from "./Pages/Stats/Stats";
import SidebarLayout from "./Layouts/SidebarLayout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route element={<SidebarLayout/>}>
      <Route path="/homepage" element={<Homepage />} />
      <Route path="/companies" element={<Companies />} />
      <Route path="/stats" element={<Stats />} />
      </Route>
    </Routes>
  );
}

export default App;

