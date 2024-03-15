import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function RequireAuth({ children }) {
    // ===========================
    const userObj = useSelector((state) => state.activeUser);
    const user = userObj.user;
    const token = userObj.token;

    // Debug
    //console.log("[Page Authentication - Only Accessible to Guests] User Profile.", user);

    if (user !== null && user !== undefined && token !== null && token !== undefined)
        return <Navigate to="/profile" replace />;

    return children;
}