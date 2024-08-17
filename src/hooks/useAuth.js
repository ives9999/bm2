import {useContext} from 'react';
import BMContext from '../context/BMContext';

function useAuth() {
    const {auth} = useContext(BMContext);
    return auth;
    //{id: 1, token: 'abc', ...}
}

export default useAuth
