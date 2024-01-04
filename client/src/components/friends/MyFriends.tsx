import React, { useContext } from 'react'
import { Navigate } from "react-router-dom";
import AuthContext from '../../store/AuthContext';
import ButtonToggle from '../../components/utils/ButtonToggle';
import Card from '../utils/Card';
import SideBar from '../SideBar';
import '../../style/FriendsPage.css'
import { FriendContext } from '../../store/FriendshipContext';
import FriendsDemands from './FriendsDemands';

const MyFriends = () =>  {
	const authCtx = useContext(AuthContext);
	const isLoggedIn = authCtx.isLoggedIn;
    const friendCtx = useContext(FriendContext);

	return (
		<>
        <SideBar />
        <div className='container-friends'>
            <FriendsDemands token={authCtx.token} authCtx={authCtx} friendCtx={friendCtx}/>
            <Card color='green' title="My Friends" type="showFriends" ></Card> 
        </div>
		{!isLoggedIn && <Navigate to="/" replace={true} />}
		<ButtonToggle />
		</>
	)
}

export default MyFriends;
