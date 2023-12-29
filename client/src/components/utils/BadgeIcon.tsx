import React, { useEffect, useState } from 'react';
import '../../style/Settings.css';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';

const BadgeIcon = (props: any) => {

	return (
		<>
		<Tooltip title={props.description}>
			<Button sx={{ m: 1 }}>
				<Avatar className='custom-icon' src={props.src} />
			</Button>
		</Tooltip>
		</>
	)
}


export default BadgeIcon;
