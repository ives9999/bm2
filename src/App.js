import Admin from './pages/admin/Admin';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import Frontend from './pages/frontend/Frontend';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path='/*' element={<Frontend/>} />
                <Route path='/admin/*' element={<Admin/>} />
            </Routes>
        </Router>
    );
}

export default App;