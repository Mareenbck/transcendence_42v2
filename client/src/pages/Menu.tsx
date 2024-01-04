import React from "react";
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../store/AuthContext";
import SideBar from '../components/SideBar'
import '../style/Menu.css'
import ButtonToggle from "../components/utils/ButtonToggle";
import Card from "../components/utils/Card";

const Menu = () => {
	const authCtx = useContext(AuthContext);
	const isLoggedIn = authCtx.isLoggedIn;

	return (
		<>
		<SideBar />
		<div className="container-menu">
			<Card color='blue' title="Challenge your friend" body="play" type="menu"></Card>
			<Card color='red' title="Watch a match" body="watch" type="menu" ></Card>
			<Card color='green' title="Chat with your friend" body="chat" type="menu"></Card>
		</div>
		{!isLoggedIn && <Navigate to="/" replace={true} />}
		<ButtonToggle />
		</>
		)
	}

	export default Menu
