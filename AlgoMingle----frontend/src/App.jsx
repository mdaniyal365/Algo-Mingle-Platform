import { Outlet, useLocation } from "react-router";
import Header from "./components/Header";
import authService from "./services/AuthService";
import Footer from "./components/Footer";
import { useEffect, useState } from "react";
import { login, signout } from "./store/slices/user";
import { useDispatch } from "react-redux";
import { disableLoading, enableLoading } from "./store/slices/loadingSlice";


function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  const [user , setUser] = useState(null);
  const [fetchingCompleted , setFetchingCompleted] = useState(false);
  useEffect(() => {
    console.log("Fetching completed " , fetchingCompleted);
  }, [fetchingCompleted])
  useEffect(() => {
    if (
      localStorage.getItem("user") !== undefined &&
      localStorage.getItem("user") !== null
    ) {
      dispatch(enableLoading())
      const user = JSON.parse(localStorage.getItem("user"));
      console.log("Data Retrieved", user);
      setUser(user);
      dispatch(login(user));
      authService
        .getCurrentUser(user?.token)
        .then((res) => {
          if (res) {
            dispatch(disableLoading());
            setFetchingCompleted(true);
          } else {
            dispatch(signout());
            dispatch(disableLoading());
            console.log("Oops !!! Token is invalid");
            localStorage.setItem("user", null);
            setFetchingCompleted(true);
          }
        })
        .catch((err) => {
          dispatch(signout());
          disableLoading(disableLoading());
          setFetchingCompleted(true);
          console.log("Oops !!! Token is invalid");
          localStorage.setItem("user", null);
        });
    }else{
      setFetchingCompleted(true);
    }
  }, []);


  return (
    <>
    {
      !location.pathname.includes("/interview/") ? (<Header />):(null)
    }
      {
        fetchingCompleted && <Outlet />
      }
      
      {
      !location.pathname.includes("/interview/") ? (<Footer />):(null)
      }
    </>
  );
}

export default App;
