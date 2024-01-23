import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import Frontend from './pages/frontend/Frontend';
import AdminRoute from './pages/admin/AdminRoute';
import Admin from './pages/admin/Admin';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path='/*' element={<Frontend/>} />
                <Route path='/admin/*' element={<AdminRoute />}>
                    <Route path='/admin/*' element={<Admin/>} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;