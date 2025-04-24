import { Routes, Route } from "react-router-dom";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Login from "./Pages/Login/Login";
import Homepage from "./Pages/Homepage/Homepage";
import Companies from "./Pages/Companies/Companies";
import Stats from "./Pages/Stats/Stats";
import SidebarLayout from "./Layouts/SidebarLayout";
import CompanyDetails from "./Pages/CompanyDetails/CompanyDetails";
import HierarchicalStructure from "./Pages/HierarchicalStructure/HierarchicalStructure";

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<SidebarLayout />}>
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/company/:id" element={<CompanyDetails />} />
          <Route path="/hierarchicalStructure/:departmentId" element={<HierarchicalStructure />} />
        </Route>
      </Routes>
    </DndProvider>
  );
}

export default App;
