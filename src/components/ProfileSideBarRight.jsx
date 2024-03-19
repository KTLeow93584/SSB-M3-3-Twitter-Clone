// =========================================
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import Col from 'react-bootstrap/Col';

import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import Spinner from 'react-bootstrap/Spinner';

import { callServerAPI } from '../apis/authApi.jsx';
import { updateFollowingCount } from '../feature/activeUser/activeUserSlice.jsx';

import defaultProfileImage from "../assets/images/user-profile-default.webp";
// =========================================
export default function ProfileSideBarRight() {
    // =======================
    const [usersLoaderVisibility, setUsersLoaderVisibility] = useState(false);
    const [users, setUsers] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        setUsersLoaderVisibility(true);

        callServerAPI("users", "GET", null,
            // On Successful Callback
            (result) => {
                // Debug
                //console.log("[Users Query] Results.", result);
                setUsersLoaderVisibility(false);

                setUsers(result);
            },
            // On Failed Callback
            (error) => {
                setUsersLoaderVisibility(false);

                // Debug
                console.log("Error.", error);
            }
        );
    }, []);
    // =======================
    const onFollowUser = (user_id, index) => {
        callServerAPI("follow", "POST", { user_id: user_id },
            // On Successful Callback
            () => {
                // Debug
                //console.log("Successfully followed user.");

                const newUsers = [...users];
                newUsers[index].followed = true;
                newUsers[index].total_followers++;
                dispatch(updateFollowingCount({ isAdd: true }));
                setUsers(newUsers);
            },
            // On Failed Callback
            (error) => {
                // Debug
                console.log("Failed to follow user.", error);
            }
        );
    };

    const onUnfollowUser = (user_id, index) => {
        callServerAPI("follow", "DELETE", { user_id: user_id },
            // On Successful Callback
            () => {
                // Debug
                //console.log("Successfully un-followed user.");

                const newUsers = [...users];
                newUsers[index].followed = false;
                newUsers[index].total_followers--;
                dispatch(updateFollowingCount({ isAdd: false }));
                setUsers(newUsers);
            },
            // On Failed Callback
            (error) => {
                // Debug
                console.log("Failed to un-follow user.", error);
            }
        );
    };
    // =======================
    return (
        <Col className="col-4 d-none d-md-flex flex-column justify-content-start align-items-start"
            style={{ position: "sticky", top: 0 }}>
            {
                usersLoaderVisibility && (
                    <div className="d-flex w-100 justify-content-center mt-5">
                        <Spinner animation="border" variant="primary" />
                    </div>
                )
            }
            {
                usersLoaderVisibility ? null : (
                    users.length > 0 ? users.map((user, index) => (
                        <Col key={`user-${index}}`}
                            className="col-12 mt-1 mb-4 d-flex align-items-center justify-content-start rounded">
                            <Image src={user.profile_image ? user.profile_image : defaultProfileImage}
                                className="me-3"
                                style={{ minWidth: "32px", minHeight: "32px", maxWidth: "64px", maxHeight: "64px", width: "100%", height: "auto", borderRadius: "50%" }} />
                            <div className="border-3 mb-2">
                                <p className="fs-6 fw-bold m-0 p-0">{user.first_name + " " + user.last_name}</p>
                                <p className="m-0 p-0" style={{ fontSize: "0.7em" }}>@{(user.first_name + user.last_name).replace(" ", "")}</p>
                                <p className="fw-bold m-0 p-0" style={{ fontSize: "0.7em" }}><span className="fw-normal">Followers: </span>{user.total_followers}</p>
                            </div>
                            <div className="ms-auto">
                                <Button variant={user.followed ? "secondary" : "primary"}
                                    onClick={user.followed ? () => onUnfollowUser(user.id, index) : () => onFollowUser(user.id, index)}>
                                    {user.followed ? "Followed" : "Follow"}
                                </Button>
                            </div>
                        </Col>
                    )) : (
                        <div className="d-flex w-100 justify-content-center mt-5">
                            <p className="m-0 p-0 text-center fw-bold" style={{ fontSize: "0.9em" }}>
                                Looks like there isn&apos;t any matching users available at the moment!
                            </p>
                        </div>
                    )
                )
            }
        </Col>
    );
}
// =========================================