import React, { FormEvent, useContext, useEffect, useState } from "react";
import { FriendContext } from "../../store/FriendshipContext";
import Friend from '../../interfaces/IFriendship'
import { AvatarGroup } from '@mui/material';
import MyAvatar from "../user/Avatar";
import { Link } from "react-router-dom";
import useSocket from "../../service/socket";
import AuthContext from "../../store/AuthContext";

const ShowFriends = () => {
	const friendCtx = useContext(FriendContext);
	const [updatedFriends, setUpdatedFriends] = useState<Friend[]>([]);
	const authCtx = useContext(AuthContext);
	const [sendMessage, addListener] = useSocket();
	const [hoveredFriendId, setHoveredFriendId] = useState<any>();

	const handleRemoveFriend = async (event: FormEvent, friendId: number) => {
		event.preventDefault();
		friendCtx.removeFriend(friendId, authCtx.userId, authCtx.token);
	}

	const handleMouseOver = (friendId: number) => {
		setHoveredFriendId(friendId);
	}

	const handleMouseOut = () => {
		setHoveredFriendId(null);
	}

	useEffect(() => {
		addListener('removeFriend', (updatedFriends: Friend[]) => {
			friendCtx.setFriends(updatedFriends);
		  setUpdatedFriends(updatedFriends);
		});
	  }, []);

	useEffect(() => {
		if (friendCtx.friends) {
			setUpdatedFriends(friendCtx.friends);
		}
	}, [friendCtx.friends, friendCtx.acceptedDemands]);

	return (
		<div className="container-showfriends">
		<AvatarGroup>
			{updatedFriends.map((friend: Friend) => (
				<li key={friend.id} onMouseOver={() => handleMouseOver(friend.id)} onMouseOut={handleMouseOut}>
					<div className="icon-friends">
						<div className={hoveredFriendId === friend.id ? 'avatar-hovered' : ''}>
							<MyAvatar id={friend.id} avatar={friend.avatar} ftAvatar={friend.ftAvatar} />
						</div>
							<button className="button-remove" onClick={(event) => handleRemoveFriend(event, friend.id)}><i className="fa-solid fa-xmark"></i></button>
							<Link to={`/users/profile/${friend.id}`}>{friend.username}</Link>
					</div>
				</li>
			))}
		</AvatarGroup>
		</div>
	)
}

export default ShowFriends;
