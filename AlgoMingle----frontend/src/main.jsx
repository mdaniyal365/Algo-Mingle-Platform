import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home.jsx";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import store from "./store/store.js";
import Signin from "./pages/Signin.jsx";
import Loading from "./components/Loading.jsx";
import Register from "./pages/Register.jsx";
import RandomLockInterviewLobby from "./pages/RandomLockInterviewLobby.jsx";
import MockInterviewWithFriend from "./pages/RandomLockInterviewLobby.jsx";
import Lobby from "./pages/Interview/Lobby.jsx";
import Signout from "./pages/Signout.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import { SocketProvider } from "./context/SocketProvider.jsx";
import InterviewSession from "./pages/Interview/InterviewSession.jsx";
import About from "./pages/About.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Signin />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/mock-interview-with-friend",
        element: <MockInterviewWithFriend />,
      },
      {
        path: "/interview/lobby",
        element: <Lobby />,
      },
      {
        path : "/interview/session/:roomId",
        element: <InterviewSession />
      },
      {
        path: "/logout",
        element: <Signout />,
      },
      {
        path: "/forgotpassword",
        element: <ForgotPassword />,
      },
      {
        path: "/reset/password/:forgotToken",
        element: <ResetPassword />,
      },
      {
        path: "/about",
        element: <About/>
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <SocketProvider>
      <Toaster position="bottom-center" reverseOrder={false} />
      <Loading />
      <RouterProvider router={router} />
    </SocketProvider>
  </Provider>
);
