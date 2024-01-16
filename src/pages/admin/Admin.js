import { Routes, Route } from 'react-router-dom';
import Index from '../admin/Index'

function Admin() {
    return (
        <Routes>
            <Route path="/" element={ <Index /> } />
        </Routes>

    )
}

export default Admin
