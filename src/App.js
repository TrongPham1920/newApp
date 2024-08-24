// App.js
import React from "react";
import { Route, Routes } from "react-router-dom";
import Main from "./components/layout/Main";
import Admin from "./features/admin/view/index.jsx";
import FindProduct from "./features/find/view/index.jsx";
import HomePage from "./features/home/view/index";
import Login from "./features/login/view/index";
import Register from "./features/register/view/index";
import { useAuth } from "./global/AuthenticationContext";
import Detail from "./features/detail/view/index";
import Card from "./features/card/view/index";

function App() {
  const { isAuthenticated, profile } = useAuth();
  return (
    <div className="App">
      {/* {!!isAuthenticated() ? (
        <Router>
          <Main>
            <Routes>
              {profile.isAdmin?.() &&
                AdminRouter.map((route) => {
                  return (
                    <Route
                      path={route.path}
                      exact
                      element={<route.element />}
                    />
                  );
                })}
              {profile.isReceptionist?.() &&
                ReceptionistRouter.map((route) => {
                  return (
                    <Route
                      path={route.path}
                      exact
                      element={<route.element />}
                    />
                  );
                })}
            </Routes>
          </Main>
        </Router>
      ) : (
        <Main>
          <Routes>
            {GuestRouter.map((route) => {
              return (
                <Route path={route.path} exact element={<route.element />} />
              );
            })}
          </Routes>
        </Main>
      )} */}
      <Main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="admin" element={<Admin />} />
          <Route path="find" element={<FindProduct />} />
          <Route path="detail" element={<Detail />} />
          <Route path="cart" element={<Card />} />
        </Routes>
      </Main>
    </div>
  );
}

export default App;
