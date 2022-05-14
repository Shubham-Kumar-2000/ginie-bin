import './App.css';
import RoutesConfig from "../src/RoutesConfig";
import { NotificationContainer } from 'react-notifications';
import AuthContextProvider from './components/AuthContext/AuthContext';
import Header from './components/Header/Header';
import { BrowserRouter as Router } from 'react-router-dom';

function App() {

  return (
    <div className="container">
      <Router>
        <AuthContextProvider>
          <Header />
          <RoutesConfig />
          <NotificationContainer />
        </AuthContextProvider>
      </Router>
    </div>
  );
}

export default App;
