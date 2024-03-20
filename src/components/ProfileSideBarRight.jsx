// =========================================
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';

import { callServerAPI } from '../apis/authApi.jsx';
import { updateFollowingCount } from '../feature/activeUser/activeUserSlice.jsx';

import SearchBar from './SearchBar.jsx';
import UserCard from './UserCard.jsx';
// =========================================
export default function ProfileSideBarRight() {
    // =======================
    const dispatch = useDispatch();
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
        dispatch(updateFollowingCount({ isAdd: true }));
        setUsers(newUsers);
    };

    const onUnfollowUserSuccessful = (index) => {
        const newUsers = [...users];

        newUsers[index].followed = false;
        newUsers[index].total_followers--;
        dispatch(updateFollowingCount({ isAdd: false }));
        setUsers(newUsers);
    };
    // =======================
    return (
        <Col className="col-4 d-none d-md-flex flex-column justify-content-start align-items-start"
            style={{ position: "sticky", top: 0 }}>
            <SearchBar minWidth={100} />
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