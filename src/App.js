import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import './App.css';
import Nav from './components/nav/Nav';
import Home from './Home';
import Launches from './Launches';
import CoresPage from './CoresPage';
import TimelinePage from './components/timelinePage/TimelinePage';

function App() {
  return (
    <Router>
      <div className="App">
        <Nav />
        
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/launches' component={Launches} />
          <Route path='/cores' component={CoresPage} />
          <Route path='/timeline' component={TimelinePage} />
        </Switch>

      </div>
    </Router>

  );
}

export default App;
