import React, { useContext, useState, useEffect } from "react";
import '../style/Sidebar.css'
import { Link, useLocation } from "react-router-dom";
import AuthContext from "../store/AuthContext";
import MyAccountMenu from "./AccountMenu";
import NotificationDemands from "./friends/NotificationDemands";


const Sidebar = () => {
    const authCtx = useContext(AuthContext);
    const [activeLink, setActiveLink] = useState('');
    const location = useLocation();
    const [username, setUsername] = useState(authCtx.username)

    const links = [
        { name: "Game", path: "/game",  icon: "fa-solid fa-table-tennis-paddle-ball"},
        { name: "Chat", path: "/chat/message", icon: "fa-solid fa-comments" },
        { name: "Leaderboard", path: "/leaderboard", icon: "fa-solid fa-ranking-star" },
        { name: "My Friends", path: "/myfriends", icon: "fa-solid fa-user-group" },
      ];

      useEffect(() => {
        setActiveLink(location.pathname);
      }, [location.pathname]);

      useEffect(() => {
        setUsername(authCtx.username);
      }, [authCtx.username]);

      const handleLinkClick = (path: string) => {
        setActiveLink(path);
      };

    return (
        <div className="sidebar">
            <div className="title">
                <MyAccountMenu authCtx={authCtx}></MyAccountMenu>
                <h4>{username}</h4>
            </div>
            <div className="links">
                <ul>
                    {links.map((link) => (
                        <li key={link.path}>
                            <Link to={link.path} onClick={() => handleLinkClick(link.path)} className={activeLink === link.path ? "active" : ""}> 
                            <div className="hexa">
                                <span className="bi bi-hexagon-fill"><i className={link.icon}></i></span>
                                <span className="bi bi-hexagon" id="bord"></span>
                            </div>
                                {link.name}
                            </Link>

                            {link.name === "My Friends" ? 
                                <NotificationDemands />
                                : null}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default Sidebar;
