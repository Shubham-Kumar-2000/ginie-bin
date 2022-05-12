import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./components/Login/Login";
import Dashboard from './components/Dashboard/Dashboard';

const RoutesConfig = () => {
    return <Router>
        <Routes>
            <Route path="" element={<Login />}></Route>
            <Route path="dashboard" element={<Dashboard />}></Route>
        </Routes>
    </Router>

}

export default RoutesConfig;
