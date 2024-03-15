import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { updateSessionToken, getSessionToken } from "../apis/authApi.jsx";

export default function RequireAuth({ children }) {
    // ===========================
    const userObj = useSelector((state) => state.activeUser);
    const user = userObj.user;
    const token = userObj.token;

    // Debug
    //console.log("[Page Authentication - User Required] User Profile.", userObj);

    if (!user || !token)
        return <Navigate to="/login" replace />;

    if (!getSessionToken())
        updateSessionToken(token);

    return children;
}