import './App.css';
import React, { useContext, useEffect, useState } from "react";
import Signup from './components/auth/Signup'
import { Route, Routes} from 'react-router-dom';
import Game from './components/game/Game';
import Chat from './components/chat/Chat'
import Home from './pages/Home'
import Profile from './pages/Profile';
import Callback42 from './components/auth/Callback42';
import Friends from './components/friends/FriendsDrawer';
import Login from './components/auth/Login';
import Menu from './pages/Menu';
import TwoFaForm from './components/auth/TwoFA';
import Setting from './pages/Setting';
import Scores from'./components/scores/Scores';
import NotFound from './pages/404';
import PopupChallenge from './components/modal/PopupChallengeApp';
import MyFriends from './components/friends/MyFriends';

function App() {

	return (
		<>
		<PopupChallenge/>
		<Routes>
			<Route path='/' element={<Home />} />
			<Route path='/game' element={<Game />} />
			<Route path='/chat/message' element={<Chat />} />
			<Route path='/friends' element={<Friends />} />
			<Route path='/myfriends' element={<MyFriends />} />
			<Route path='/auth/signin' element={<Login />} />
			<Route path='/auth/2fa' element={<TwoFaForm />} />
			<Route path='/auth/signup' element={<Signup />} />
			<Route path="/auth/42/callback" element={<Callback42 />} />
			<Route path='/menu' element={<Menu />} />
			<Route path='/settings' element={<Setting />} />
			<Route path='/leaderboard' element={<Scores />} />
			<Route path='/*' element={<NotFound />} />
			<Route path={`/users/profile/:id`} element={<Profile />} />
		</Routes>
		</>
	);
}

export default App;
