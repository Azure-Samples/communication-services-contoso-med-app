import React, { } from 'react';
import './UserCard.css';
import profilePicture from '../../assets/images/user-profile.png'

import { constants } from "../../config";

const UserCard = ({ docInfo, userInfo, onClick, isSelected }) => {
    return (
        <>
        <div className={isSelected ? "user-card user-card-selected pl-4 pt-3 pr-2 pb-3" : "user-card pl-4 pt-3 pr-2 pb-3"} onClick={() => {onClick();}}>
            <div className="user-card-date-time">
                {/* 3:11 PM */}
                </div>
            <div className="user-persona">
                <img className="user-image" src={docInfo?.pictureUrl !== undefined ? constants.endpoint + '/images/' + docInfo?.pictureUrl : profilePicture} alt="" />
                <div className="user-status online"></div>
            </div>
            <div className="user-info">
                <div className="user-name">
                    {docInfo ? 'Dr. ' + docInfo?.name : ''} {userInfo?.name}
                </div>
                <div className="user-subtitle">
                    {docInfo?.speciality}
                </div>
                <div className="user-subtitle">
                    {docInfo?.location}
                </div>
            </div>
        </div>
        </>
    );
}

export default UserCard;