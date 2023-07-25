import './App.css';
import { UserProvider } from './context/userContext';
import Pages from './pages/Pages';

function App() {
  return (
    <>
      <UserProvider>
        <Pages />
      </UserProvider>
    </>
  );
}

export default App;
