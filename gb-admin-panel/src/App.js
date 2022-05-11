import './App.css';
import AddBin from './components/AddBin/AddBin';
import GetAllBin from './components/GetAllBin/GetAllBin';
import Login from './components/Login/Login';

function App() {
  return (
    <div style={{ display: 'flex' }} className="container">
      {/* <AddBin />
      <GetAllBin /> */}
      <Login />
    </div>
  );
}

export default App;
