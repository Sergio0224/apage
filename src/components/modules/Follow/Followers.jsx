import React, { useEffect, useState } from 'react';
import UserList from '../User/UserList';
import { Global } from '../../../helpers/Global';
import { useParams } from 'react-router-dom';

const Followers = () => {
    const [users, setUsers] = useState([]);
    const [following, setFollowing] = useState([]);
    const params = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                await getUsers();
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const getUsers = async () => {
        const userId = params.userId;
        const req = await fetch(Global.url + "follow/followers/" + userId + "/1", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        });
        const res = await req.json();
        let newArrayFollowing = [];
        res.follows.forEach(follow => {
            newArrayFollowing = [...newArrayFollowing, follow.user];
        });
        res.users = newArrayFollowing;
        if (res.users && res.status == "success") {
            setUsers(res.users);
            setFollowing(res.user_following);
        }
    };

    return (
        <UserList
            users={users}
            setUsers={setUsers}
            following={following}
            setFollowing={setFollowing}
            textError={"No hay seguidores para mostrar"}
        />
    );
};

export default Followers;