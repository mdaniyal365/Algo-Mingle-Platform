import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { login, signout } from "../store/slices/user";
import authService from "../services/AuthService";

const Header = () => {
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.user.userData);
  const dispatch = useDispatch();
  const items = [
    {
      name: "Home",
      slug: "/",
      isActive: true,
    },
    {
      name: "Interview",
      slug: "/mock-interview-with-friend",
      isActive: isLoggedIn,
    },
    {
      name: "Login",
      slug: "/login",
      isActive: !isLoggedIn,
    },
    {
      name: "Register",
      slug: "/register",
      isActive: !isLoggedIn,
    },
    {
      name: "Logout",
      slug: "/logout",
      isActive: isLoggedIn,
    },
    {
      name: "About us",
      slug: "/about",
      isActive: true,
    },
  ];

  
  return (
    <div className="w-full  overflow-hidden h-24  flex   justify-around border-2 bg-[#f5f3f0]">
      <div 
        onClick={(e) => {
          navigate("/");
        }}
      className="flex w-2/6 overflow-hidden justify-center  flex-shrink-1 cursor-pointer ">
        <img src="/logos/logo13.png" alt="" className="mx-2" />
        <img
          src="/logos/logo14.png"
          alt=""
          className="phone:hidden tablet:block"
        />
      </div>
      <div className="flex phone:w-5/6 tablet:w-3/6 h-full text-sm tablet:text-[18px]  font-primaryFont font-bold  text-[#762D16] cursor-pointer">
        <ul className="flex w-full overflow-hidden justify-around  items-center ">
          {items.map((item, index) => {
            if (item.isActive) {
              return (
                <li
                  key={item.name}
                  onClick={(e) => {
                    navigate(item.slug);
                  }}
                  className="p-2 text-center transition-all duration-300 hover:text-xl hover:border border-[#762d16] rounded-md"
                >
                  {item.name}
                </li>
              );
            }
          })}
        </ul>
      </div>
    </div>
  );
};

export default Header;
