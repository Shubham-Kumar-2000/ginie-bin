import './App.css';
import RoutesConfig from "../src/RoutesConfig";
import { NotificationContainer } from 'react-notifications';

function App() {
  return (
    <div className="container">
      <RoutesConfig />
      <NotificationContainer />
    </div>
  );
}

export default App;
