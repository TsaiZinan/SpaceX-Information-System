import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import './App.css';
import Nav from './components/nav/Nav';
import Home from './Home';
import Launches from './Launches';

function App() {
  return (
    <Router>
      <div className="App">
        <Nav />
        <Route path='/' component={Home} />
        <Route path='/launches' component={Launches} />
      </div>
    </Router>

  );
}

export default App;
