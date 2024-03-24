import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import { Route, Routes, Outlet, useNavigate } from 'react-router-dom';
import useLocalStorage from 'use-local-storage';

import Container from 'react-bootstrap/Container';

import Loader from './components/Loader.jsx';

import GuestAuth from './auths/GuestAuth.jsx';
import UserAuth from './auths/UserAuth.jsx';

import AuthPage from './pages/AuthPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import ViewPost from './pages/ViewPost.jsx';
import EditProfile from './pages/EditProfile.jsx';
import NetErrorPage from './pages/NetErrorPage.jsx';

import './App.css';

import { store, persistor } from './store.jsx';
import { updateDeviceID, callServerAPI, updateSessionToken } from './apis/authApi.jsx';

import { AuthProvider } from './contexts/AuthProvider.jsx';

import { onLoadingStart, onLoadingEnd } from './data/loaders.js';
import { errorNoAuthEventName, errorServerEventName } from './data/error-loggers.js';
// =========================================
export function Layout() {
  return (
    <>
      <Loader />
      <Outlet />
    </>
  );
}
// =========================================
function App() {
  // ================
  const navigate = useNavigate();
  // ================
  const [deviceID, setDeviceID] = useLocalStorage("device-id", null);
  if (!deviceID) {
    const userAgentData = window.navigator.userAgentData;
    const randomString = Math.random().toString(20).substring(2, 14) + Math.random().toString(20).substring(2, 14);

    const deviceID = `${userAgentData.platform}-${userAgentData.brands[0].brand}-${randomString}`;
    setDeviceID(deviceID);
  }
  updateDeviceID(deviceID);
  // ================
  // Verify Access Token at the beginning of the app.
  useEffect(() => {
    const accessToken = localStorage.getItem("session-id", null);

    const onUnauthorizationDetectedCallback = () => {
      updateSessionToken(null);
      navigate("/login");
    };

    const onServerErrorDetectedCallback = () => navigate("/error");

    window.addEventListener(errorNoAuthEventName, onUnauthorizationDetectedCallback);
    window.addEventListener(errorServerEventName, onServerErrorDetectedCallback);

    if (accessToken) {
      updateSessionToken(accessToken);

      onLoadingStart("Global");
      callServerAPI("whoami", "GET", null,
        // On Successful Callback
        (result) => {
          onLoadingEnd("Global");

          // Debug
          //console.log("[Who Am I Verification Successful - Start of App Lifespan] Result.", result);
        },
        // On Failed Callback
        (error) => {
          onLoadingEnd("Global");

          // Debug
          //console.log("[Who Am I Verification Failed - Start of App Lifespan] Error.", error);
        }
      );
    }

    return (() => {
      window.removeEventListener(errorNoAuthEventName, onUnauthorizationDetectedCallback);
      window.removeEventListener(errorServerEventName, onServerErrorDetectedCallback);
    });
  }, [navigate]);
  // ================
  return (
    <Container fluid className="main-container m-0 p-0">
      <AuthProvider>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={
                  <UserAuth>
                    <ProfilePage />
                  </UserAuth>
                } />

                <Route element={
                  <GuestAuth>
                    <AuthPage />
                  </GuestAuth>
                } path="/login" />

                <Route element={
                  <UserAuth>
                    <EditProfile />
                  </UserAuth>
                } path="/profile/edit" />

                <Route element={
                  <UserAuth>
                    <ProfilePage />
                  </UserAuth>
                } path="/profile/:user_id" />

                <Route element={
                  <UserAuth>
                    <ProfilePage />
                  </UserAuth>
                } path="/home" />

                <Route element={
                  <UserAuth>
                    <ViewPost />
                  </UserAuth>
                } path="/user/:user_id/post/:post_id" />

                <Route element={
                  <NetErrorPage />
                } path="/error" />

                <Route path="/*" element={<AuthPage />} />
              </Route>
            </Routes>
          </PersistGate>
        </Provider>
      </AuthProvider>
    </Container>
  );
}

export default App
// =========================================
