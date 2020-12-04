import React, { } from 'react';
import './UserCard.css';

import { constants } from "../../config";

const SupportCard = ({ threadInfo, onClick, isSelected }) => {
    return (
        <>
        <div className={isSelected ? "user-card user-card-selected pl-4 pt-3 pr-2 pb-3" : "user-card pl-4 pt-3 pr-2 pb-3"} onClick={() => {onClick();}}>
            <div className="user-card-date-time">
                {/* 3:11 PM */}
                </div>
            <div className="user-persona">
                <img className="user-image" src="https://thumbs.dreamstime.com/b/default-placeholder-doctor-half-length-portrait-photo-avatar-gray-color-default-placeholder-doctor-half-length-portrait-113622206.jpg" alt="" />
                <div className="user-status online"></div>
            </div>
            <div className="user-info">
                <div className="user-name">
                    {threadInfo?.topic}
                </div>
                <div className="user-subtitle">
                    Forwarded by automated assistance system
                </div>
            </div>
        </div>
        </>
    );
}

export default SupportCard;