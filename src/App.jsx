import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import { BrowserRouter, Route, Routes, Outlet } from 'react-router-dom';

import Loader from './components/Loader.jsx';

import GuestAuth from './auths/GuestAuth.jsx';
import UserAuth from './auths/UserAuth.jsx';

import AuthPage from './pages/AuthPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import EditProfile from './pages/EditProfile.jsx';
import ViewUsers from './pages/ViewUsers.jsx';

import './App.css';

import { store, persistor } from './store.jsx';
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
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<AuthPage />} />

                <Route element={
                  <GuestAuth>
                    <AuthPage />
                  </GuestAuth>
                } path="/login" />

                <Route element={
                  <UserAuth>
                    <EditProfile />
                  </UserAuth>
                } path="/edit" />

                <Route element={
                  <UserAuth>
                    <ProfilePage />
                  </UserAuth>
                } path="/profile" />

                <Route element={
                  <UserAuth>
                    <ViewUsers />
                  </UserAuth>
                } path="/users" />

                <Route element={
                  <UserAuth>
                    <EditProfile />
                  </UserAuth>
                } path="/editProfile" />

                <Route path="/*" element={<AuthPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </PersistGate>
      </Provider>
    </>
  );
}

export default App
// =========================================
