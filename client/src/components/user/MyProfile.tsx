import '../../style/Profile.css'
import React, { useContext } from 'react'
import { Navigate } from "react-router-dom";
import AuthContext from '../../store/AuthContext';
import SideBar from '../SideBar';
import ProfileCard from './ProfileCard';
import Card from '../utils/Card';

const MyProfile = () => {
	const authCtx = useContext(AuthContext);
	const isLoggedIn = authCtx.isLoggedIn;

	return (
		<>
		<SideBar/>
		<div className='container-profile'>
			<ProfileCard ></ProfileCard>
			<Card color='blue' title="My Level" icon="level" type="stats"></Card>
			<Card color='red' title="My Rank" icon="rank" type="stats"></Card>
			<div className='card-wrapper'>
				<Card color='yellow' title="Match History" type="match"></Card>
			</div>
			<Card color='green' title="Achievements" type="achiev" authCtx={authCtx}></Card>

		</div>
		{!isLoggedIn && <Navigate to="/" replace={true} />}
		</>
	)
}

export default MyProfile;
