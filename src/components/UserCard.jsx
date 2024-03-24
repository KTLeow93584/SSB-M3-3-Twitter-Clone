// ===========================================
import { useState } from 'react';

import Col from 'react-bootstrap/Col';

import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import Spinner from 'react-bootstrap/Spinner';

import { callServerAPI } from '../apis/authApi.jsx';

import defaultProfileImage from "../assets/images/user-profile-default.webp";
// ===========================================
export default function UserCard({ user, index, onNavigateToUserProfilePageCallback = null,
    onFollowUserSuccessfulCallback = null, onUnfollowUserSuccessfulCallback = null }) {
    const [followLoaderVisibility, setFollowLoaderVisibility] = useState(false);

    const onFollowUser = () => {
        setFollowLoaderVisibility(true);

        callServerAPI("follow", "POST", { user_id: user.user_id },
            // On Successful Callback
            () => {
                // Debug
                //console.log("[Follow User Successful].");

                setFollowLoaderVisibility(false);
                if (onFollowUserSuccessfulCallback)
                    onFollowUserSuccessfulCallback(index);
            },
            // On Failed Callback
            (error) => {
                // Debug
                console.log("[Follow User Failed] Error.", error);

                setFollowLoaderVisibility(false);
            }
        );
    };

    const onUnfollowUser = () => {
        setFollowLoaderVisibility(true);

        callServerAPI("follow", "DELETE", { user_id: user.user_id },
            // On Successful Callback
            () => {
                // Debug
                //console.log("[Unfollow User Successful]");

                setFollowLoaderVisibility(false);
                if (onUnfollowUserSuccessfulCallback)
                    onUnfollowUserSuccessfulCallback(index);
            },
            // On Failed Callback
            (error) => {
                // Debug
                console.log("[Unfollow User Failed] Error.", error);

                setFollowLoaderVisibility(false);
            }
        );
    };

    return (
        <Col className="col-12 mt-1 mb-4 d-flex align-items-center justify-content-start rounded"
            style={{ cursor: "pointer" }}>
            <Image src={user.profile_image ? user.profile_image : defaultProfileImage}
                onClick={() => onNavigateToUserProfilePageCallback(user.user_id)}
                className="me-3"
                style={{ minWidth: "32px", minHeight: "32px", maxWidth: "64px", maxHeight: "64px", width: "100%", height: "auto", borderRadius: "50%" }} />
            <div className="border-3 mb-2"
                onClick={() => onNavigateToUserProfilePageCallback(user.user_id)}>
                <p className="fs-6 fw-bold m-0 p-0">{user.first_name + " " + user.last_name}</p>
                <p className="m-0 p-0" style={{ fontSize: "0.7em" }}>@{(user.first_name + user.last_name).replace(" ", "")}</p>
                <p className="fw-bold m-0 p-0" style={{ fontSize: "0.7em" }}><span className="fw-normal">Followers: </span>{user.total_followers}</p>
            </div>
            <div className="ms-auto">
                {
                    followLoaderVisibility ? (
                        <Spinner animation="border" variant="primary" className="me-3" />
                    ) : (
                        <Button variant={user.followed ? "secondary" : "primary"}
                            onClick={user.followed ? () => onUnfollowUser() : () => onFollowUser()}>
                            {user.followed ? "Followed" : "Follow"}
                        </Button>
                    )
                }
            </div>
        </Col>
    );
}
// ===========================================