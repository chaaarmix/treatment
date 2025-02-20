import ScrollRestoration from "./components/ScrollRestoration";
import {BrowserRouter} from "react-router-dom";
import AppRouter from "./components/AppRouter";
import UserProvider from "./components/UserProvider";
import './styles/App.css';

function App() {
  return (
      <UserProvider>
        <BrowserRouter>
          <ScrollRestoration/>
          <AppRouter/>
        </BrowserRouter>
      </UserProvider>
  );
}

export default App;