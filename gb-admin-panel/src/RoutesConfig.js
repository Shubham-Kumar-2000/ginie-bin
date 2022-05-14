import { useContext } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthContext } from './components/AuthContext/AuthContext';
import Dashboard from './components/Dashboard/Dashboard';
import Home from './components/Home/Home';

const RoutesConfig = () => {
    const [token] = useContext(AuthContext);

    return <Routes>
        <Route path="" element={<Home />}></Route>
        <Route path="dashboard" element={token ? <Dashboard /> : <Navigate replace to="/" />}></Route>
    </Routes>

}

export default RoutesConfig;
