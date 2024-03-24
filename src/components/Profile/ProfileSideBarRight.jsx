// =========================================
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';

import { callServerAPI } from '../../apis/authApi.jsx';
import { updateFollowingCount } from '../../feature/viewedUser/viewedUserSlice.jsx';

import SearchBar from '../SearchBar.jsx';
import UserCard from '../UserCard.jsx';
// =========================================
export default function ProfileSideBarRight() {
    // =======================
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const activeUser = useSelector((state) => state.activeUser.user);
    const viewedUser = useSelector((state) => state.viewedUser.user);

    const onNavigateToUserProfilePage = (user_id) => navigate(`/profile/${user_id}`)
    // =======================
    const [usersLoaderVisibility, setUsersLoaderVisibility] = useState(false);
    const [users, setUsers] = useState([]);

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
                //console.log("Error.", error);
            }
        );
    }, []);
    // =======================
    const onFollowUserSuccessful = (index) => {
        const newUsers = [...users];

        newUsers[index].followed = true;
        newUsers[index].total_followers++;

        if (activeUser.user_id === viewedUser.user_id)
            dispatch(updateFollowingCount({ isAdd: true }));
        setUsers(newUsers);
    };

    const onUnfollowUserSuccessful = (index) => {
        const newUsers = [...users];

        newUsers[index].followed = false;
        newUsers[index].total_followers--;

        if (activeUser.user_id === viewedUser.user_id)
            dispatch(updateFollowingCount({ isAdd: false }));
        setUsers(newUsers);
    };
    // =======================
    return (
        <Col className="col-4 d-none d-md-flex flex-column justify-content-start align-items-start"
            style={{ position: "sticky", top: 0 }}>
            <SearchBar />
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
                        <UserCard key={`user-${index}`} user={user} index={index}
                            onNavigateToUserProfilePageCallback={onNavigateToUserProfilePage}
                            onFollowUserSuccessfulCallback={onFollowUserSuccessful}
                            onUnfollowUserSuccessfulCallback={onUnfollowUserSuccessful} />
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