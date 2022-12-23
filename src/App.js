import './App.css';
import { FormComponent } from './components/FormComponent';

function App() {
  return (
    <div className="bg-light d-flex flex-column min-vh-100 justify-content-center align-items-center">
     <header className="App-header">
        <p>
          Оплата по QR коду
        </p>
      </header>
      
      <FormComponent></FormComponent>
    </div>
  );
}

export default App;
