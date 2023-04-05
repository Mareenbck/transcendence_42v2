import '../style/Profile.css'
import React, { useContext } from 'react'
import { Navigate, useParams } from "react-router-dom";
import AuthContext from '../store/AuthContext';
import style from '../style/Menu.module.css'
import MyProfile from '../components/user/MyProfile';
import UserProfile from '../components/user/UserProfile';
import ButtonToggle from '../components/utils/ButtonToggle';

const Profile = (props: any) =>  {
	const { id } = useParams();
	const authCtx = useContext(AuthContext);
	const isMyProfile = parseInt(authCtx.userId) === parseInt(id);
	const isLoggedIn = authCtx.isLoggedIn;
//m
	return (
		<>
		<div className={style.mainPos}>
				<div>
					{isMyProfile ? (
						<MyProfile></MyProfile>
					): (
						<UserProfile id={id} ></UserProfile>
						)}
				<ButtonToggle ></ButtonToggle>
				</div>
			{!isLoggedIn && <Navigate to="/" replace={true} />}
		</div>
		</>
	)
}

export default Profile;
