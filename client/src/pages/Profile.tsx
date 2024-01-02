import '../style/Profile.css'
import React, { useContext, useEffect } from 'react'
import { Navigate, useParams } from "react-router-dom";
import AuthContext from '../store/AuthContext';
import style from '../style/Menu.module.css'
import MyProfile from '../components/user/MyProfile';
import UserProfile from '../components/user/UserProfile';
import ButtonToggle from '../components/utils/ButtonToggle';

const Profile = () =>  {
	const { id } = useParams();
	const authCtx = useContext(AuthContext);
	const isLoggedIn = authCtx.isLoggedIn;
	const [isMyProfile, setIsMyProfile] = React.useState<boolean>();

	useEffect(() => {
		if (id && parseInt(id) === parseInt(authCtx.userId)) {
			setIsMyProfile(true)
		} else {
			setIsMyProfile(false)
		}
	}, [id])

	return (
		<>
		{isMyProfile ? (
			<MyProfile ></MyProfile>
		): (
			<UserProfile id={id} ></UserProfile>
		)}
		<ButtonToggle ></ButtonToggle>
		{!isLoggedIn && <Navigate to="/" replace={true} />}
		</>
	)
}

export default Profile;
