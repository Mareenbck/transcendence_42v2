import React, { useCallback, useContext, useEffect } from "react";
import Demand from '../../interfaces/IFriendship'
import { Badge } from '@mui/base/Badge';
import { FriendContext } from "../../store/FriendshipContext";
import useSocket from "../../service/socket";
import AuthContext from "../../store/AuthContext";

const NotificationDemands = () => {
	const [sendMessage, addListener] = useSocket();
	const friendCtx = useContext(FriendContext);
	const authCtx = useContext(AuthContext);

	const addListenerCallback = useCallback((pendingDemands: any[]) => {
		const receiverDemands = pendingDemands.filter(
			(demand: Demand) => demand.receiverId === parseInt(authCtx.userId)
		);
		friendCtx.setPendingDemandsCount(
			receiverDemands.filter((demand: Demand) => demand.status === 'PENDING').length
		);
	}, [authCtx.userId, friendCtx.setPendingDemandsCount]);
	
	useEffect(() => {
		addListener('pendingDemands', addListenerCallback);
	}, [addListener, addListenerCallback]);
	  
	return (
		<>
		<Badge>
		{friendCtx.pendingDemandsCount > 0 && (
			<span className="badge-notification">{friendCtx.pendingDemandsCount}</span>
		)}
		</Badge>
		</>
	)
}

export default NotificationDemands;
