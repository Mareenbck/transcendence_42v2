import React, { createContext, useState } from "react";

//creation du context pour auth
//pour stocker les  data user
const defaultValue = {
	token: '',
	userId: '',
	username: '',
	isLoggedIn: false,
	avatar: '',
	login: (token: string, userId: string) => {},
	logout: () => { }
};

const AuthContext = createContext(defaultValue);
//controle de la presence du token dans local storage
const tokenLocalStorage = localStorage.getItem("token");
const userIdLocalStorage = localStorage.getItem("userId");
// const userId42LocalStorage = localStorage.getItem("userId42");
const usernameLocalStorage = localStorage.getItem("username");
const avatarLocalStorage = localStorage.getItem("avatar");

export const AuthContextProvider = (props: any) => {
	const [token, setToken] = useState<string | null>(tokenLocalStorage);
	const [userId, setUserId] = useState<string | null>(userIdLocalStorage);
	// const [userId42, setUserId42] = useState<string | null>(userId42LocalStorage);
	const [username, setUsername] = useState<string | null>(usernameLocalStorage);
	const [avatar, setAvatar] = useState<string | null>(avatarLocalStorage);

	const fetchHandler = async (token: string, userId: string) => {
		try {
			const response = await fetch(`http://localhost:3000/users/profile/${userId}`, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			});
			const data = await response.json();
			setUserId(data.id);
			setUsername(data.username);
			setAvatar(data.avatar);
			localStorage.setItem('username', data.username);
		} catch (error) {
			console.log(error);
		}
	};

	const loginHandler = (token: string, userId: string) => {
		setToken(token);
		// if (!userId42)
		// if (username) setUsername(username);
		fetchHandler(token, userId);
	};

	const logoutHandler = () => {
		setToken("");
		setUserId("");
		setUsername("");
		// setUserId42("");
		setAvatar("");
		localStorage.clear();
	};
	//si presence du token -> logged
	const userIsLoggedIn = !!token;
	console.log("CONTEXT >>userIsLoggedIn---->");
	console.log(userIsLoggedIn);
	const contextValue = {
		token: token,
		userId: userId,
		username: username,
		avatar: avatar,
		isLoggedIn: userIsLoggedIn,
		login: loginHandler,
		logout: logoutHandler,
		fetchHandler: fetchHandler,
	};

	return (
		<AuthContext.Provider value={contextValue} >
			{props.children}
		</AuthContext.Provider>
	)
}

export default AuthContext;
