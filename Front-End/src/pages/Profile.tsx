import '../style/Profile.css'
import React, { useContext, useEffect, useState } from 'react'
import { Navigate, useParams } from "react-router-dom";
import AuthContext from '../store/AuthContext';
import SideBar from '../components/auth/SideBar';
import style from '../style/Menu.module.css'

const Profile = () =>  {
	const authCtx = useContext(AuthContext);
	const [demands, setDemands] = useState<any[]>([]);
	const prendingDemands = demands.filter(demand => demand.status === 'PENDING');

	const currentUserId = authCtx.userId;
	const isLoggedIn = authCtx.isLoggedIn;
	const { id } = useParams();
	const ftAvatar = authCtx.ftAvatar;
	const username = localStorage.getItem('username');
	const [avatar, setAvatar] = useState<string | null>(null);

	// const demandFriend =

	useEffect(() => {
		setAvatar(authCtx.avatar);
	}, [authCtx.avatar]);

	useEffect(() => {
		if (!avatar) {
			authCtx.fetchAvatar(id);
		} else {
			authCtx.updateAvatar(avatar);
		}
	}, [id]);

	useEffect(() => {
		const url = "http://localhost:3000/friendship/received";
		const fetchDemands = async () => {
			const response = await fetch(
				url,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${authCtx.token}`
					},
					body: JSON.stringify({id: currentUserId}),
				}
			)
			const data = await response.json();
			setDemands(data);
		}
		fetchDemands();
	}, [])

	return (
		<>
		<div className={style.mainPos}>
			<SideBar title="Settings" />
			<div className="contain-set">

		{/* <img src={avatarUrl} alt={avatar ? "avatar" : "ftAvatar"} /> */}
		<div className='head'>
			<div className='profile-card'>
				{avatar ? <img src={avatar} alt={"avatar"} /> : <img src={ftAvatar} alt={"ftAvatar"} />}
				{isLoggedIn && <h5>{username} </h5>}
			</div>
			<div className='friends-card'>
				<div className="title">
					<div className="status-friends"></div>
					<h5>My Friends</h5>
				</div>
			</div>
			<div className='friends-card'>
				<div className="title">
					<div className="status-rank"></div>
					<h5>My Rank</h5>
				</div>
				<div className='flex'>
					<div className='rank'>
						<div className='font'>
							<i className="fa-solid fa-bolt"></i>
						</div>
					</div>
					<h2>#12</h2>
				</div>
			</div>
		</div>
		<div className='body'>
			<div className='level'>
				<h5>Level</h5>
			</div>
			<div className='history'>
				<h5>Match History</h5>
			</div>
			<div className='victory'>
				<h5>Victory</h5>
			</div>
		</div>
		<div>
			<h2 className="title">Demands :</h2>
			<ul>
				{prendingDemands.map(demand => (
					<li key={demand.id} className='friend'>
						{demand.requester.avatar ? <img className='avatar-img' src={demand.requester.avatar} alt={"avatar"} /> : <img className='avatar-img' src={demand.requester.ftAvatar} alt={"ftAvatar"} />}
						<span className='friend-username'>{demand.requester.username}</span>
						<div className='accept'>
							<i className="fa-regular fa-circle-check"></i>
						</div>
						<div className='deny'>
							<i className="fa-solid fa-xmark"></i>
						</div>
					</li>
				))}
			</ul>
		</div>

		{!isLoggedIn && <Navigate to="/" replace={true} />}
		{/* {isLoggedIn && <p>Votre Token: {authCtx.token} </p>} */}
		{/* {isLoggedIn && <p>Votre userid : {authCtx.userId} </p>} */}
		{/* {isLoggedIn && <button onClick={authCtx.logout}>LOGOUT </button>} */}
			</div>
		</div>
		</>
	)
}

export default Profile;
