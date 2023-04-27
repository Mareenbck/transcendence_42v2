import React, { createContext, useContext, useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import Demand from '../interfaces/IFriendship'
import Friend from '../interfaces/IFriendship'
import useSocket from "../service/socket";

const defaultValue = {
	demands: [] as Demand[],
	friends: [] as Friend[],
	fetchAvatar: async (userId: number) => {},
	createDemand: async (receiverId: number, token: string, currentId: string) => { },
	getDemands: async (token: string, currentId: string) => { },
	getFriends: async (token: string, currentId: string) => { },
	removeFriend: (friendId: number, currentId: string, token: string) => { },
	updateDemand: (demandId: number, res: string, token: string) => { },
};

export const FriendContext = createContext(defaultValue);

export const FriendContextProvider = (props: any) => {
	const [sendMessage, addListener] = useSocket();
	const [demands, setDemands] = useState<Demand[]>([]);
	const [friends, setFriends] = useState<Friend[]>([]);
	const [avatarCache, setAvatarCache] = useState<Map<number, string>>(new Map());

	const authCtx = useContext(AuthContext);

	useEffect (() => {
		if (authCtx.isLoggedIn) {
			getFriends(authCtx.token, authCtx.userId);
		}
	}, []);

	useEffect (() => {
		if (authCtx.isLoggedIn) {
			getDemands(authCtx.token, authCtx.userId);
		}
	}, []);

	const createDemand = async (receiverId: number, token: string, currentId: string) => {
		try {
			const response = await fetch(`http://localhost:3000/friendship/create`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ requesterId: currentId, receiverId: receiverId }),
			});
			const data = await response.json();
			if (!response.ok) {
				console.log("POST error on /friendship/create");
				return "error";
			}
			console.log("CREATE DEMAND")
		} catch (error) {
			console.log("error", error);
		}

	}

	const getDemands = async (token: string, currentId: string) => {
		const response = await fetch(
			"http://localhost:3000/friendship/received", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					// Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({ id: currentId }),
			}
		)
		const data = await response.json();
		const updatedDemands: any[] = await Promise.all(data.map(async (demand: Demand) => {
			const avatarUrl = avatarCache.get(demand.requester.id) ?? await fetchAvatar(demand.requester.id);
			if (!avatarUrl) {
				return demand;
			}
			return { ...demand, requester: {...demand.requester, avatar: avatarUrl }};
		}));
		setDemands(updatedDemands);
	}

	const getFriends = async (token: string, currentId: string) => {
		const response = await fetch(
			"http://localhost:3000/friendship/friends", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					// Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({ id: currentId }),
			}
		)
		const data = await response.json();

		// For each friend in the data array, fetch their avatar
		const updatedFriends = await Promise.all(data.map(async (friend: Friend) => {
			const avatarUrl = avatarCache.get(friend.id) ?? await fetchAvatar(friend.id);
			return { ...friend, avatar: avatarUrl };
		}));
		setFriends(updatedFriends);
	}

	const fetchAvatar = async (userId: number) => {
		try {
			const response = await fetch(`http://localhost:3000/friendship/${userId}/avatar`, {
				method: 'GET',
			});
			if (response.ok) {
				if (response.status === 204) {
					return null
				}
				const blob = await response.blob();
				const avatarUrl = URL.createObjectURL(blob);
				avatarCache.set(userId, avatarUrl);
				setAvatarCache(new Map(avatarCache)); // trigger re-render to update state
				return avatarUrl;
			}
		} catch (error) {
			console.log("error", error);
		}
	}

	const removeFriend = async (friendId: number, currentId: string, token: string) => {
		try {
			const response = await fetch(`http://localhost:3000/friendship/delete`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ friendId: friendId, currentId: currentId }),
			});
			const data = await response.json();
			if (!response.ok) {
				console.log("POST error on /friendship/delete");
				return "error";
			}
		} catch (error) {
			console.log("error", error);
		}
	}

	const updateDemand = async (demandId: number, res: string, token: string) => {
		try {
			const response = await fetch(`http://localhost:3000/friendship/update`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ demandId: demandId, response: res }),
			});
			await response.json();
			sendMessage('updateDemands', { demandId: demandId, response: res })
			if (!response.ok) {
				console.log("POST error on /friendship/validate");
				return "error";
			}
		} catch (error) {
			console.log("error", error);
		}
	}

	const contextValue = {
		demands,
		friends,
		fetchAvatar,
		createDemand,
		getDemands,
		getFriends,
		removeFriend,
		updateDemand,
	};

	return (
		<FriendContext.Provider value={contextValue} >
			{props.children}
		</FriendContext.Provider>
	)
}
