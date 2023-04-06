import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import '../../style/Settings.css';
import Avatar from '@mui/material/Avatar';

const customStylesL = `
	.custom-avatar.avatar-l {
		width: 80px;
		height: 80px;
		border: 2.97px solid #FFFFFF;
		filter: drop-shadow(4.97px 3.97px 0px #000000);
		margin-right: 25px;
	}
`;

const customStylesM = `
	.custom-avatar.avatar-m {
		width: 65px;
		height: 65px;
		border: 2.97px solid #FFFFFF;
		filter: drop-shadow(4.97px 3.97px 0px #000000);
		margin-right: 25px;
	}
`;

const customStyleS = `
	.custom-avatar.avatar-s {
		width: 40px;
		height: 40px;
		border: 2.97px solid #FFFFFF;
		filter: drop-shadow(4.97px 3.97px 0px #000000);
		margin-right: 25px;
	}
`;

const customStyleXS = `
	.custom-avatar.avatar-xs {
		width: 30px;
		height: 30px;
		border: 1px solid #FFFFFF;
		filter: drop-shadow(3px 2px 0px #000000);
		margin-right: 10px;
	}
`;

const MyAvatar = (props: any) => {
	const authCtx = props.authCtx;
	const [style, setStyle] = useState('');
	const [content, setContent] = useState<any>(null);
	const [avatar, setAvatar] = useState<any>(props.avatar);

	useEffect(() => {
		const fetchAvatar = async () => {
			try {
			  const response = await fetch(`http://localhost:3000/friendship/${props.id}/avatar`, {
				method: 'GET',
			  });
			  if (response.ok) {
				if (response.status === 204) {
				  return null
				}
				const blob = await response.blob();
				setAvatar(URL.createObjectURL(blob));
			  }
			} catch (error) {
			  return console.log("error", error);
			}
		  }
		if (!avatar && !props.ftAvatar) {
			fetchAvatar()
		}
	}, [props.id]);

	useEffect(() => {
		if (props.style === "m") {
			setStyle(customStylesM);
		} else if (props.style === 'xs') {
			setStyle(customStyleXS);
		} else if (props.style === 's') {
			setStyle(customStyleS);
		} else if (props.style === 'l') {
			setStyle(customStylesL);
		}
	}, [props.style]);

	useEffect(() => {
		const avatarClass = `custom-avatar avatar-${props.style}`;
		if (authCtx.userId === props.id) {
			setContent(authCtx.avatar ? <Avatar className={avatarClass} src={authCtx.avatar} /> : <Avatar className={avatarClass} src={authCtx.ftAvatar} />)
		} else {
			setContent(avatar ? <Avatar className={avatarClass} src={avatar} /> : <Avatar className={avatarClass} src={props.ftAvatar} />)
		}
	}, []);

	return (
		<>
			<style>{style}</style>
			{content}
		</>
	)
}


export default MyAvatar;
