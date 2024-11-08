import React, { useEffect, useState } from 'react';
import { Global } from '../../../helpers/Global';
import UserList from '../../modules/User/UserList';

const People = () => {
    const [users, setUsers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [pageList, setPageList] = useState(1);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);

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
        const req = await fetch(Global.url + 'user/list/' + pageList, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: localStorage.getItem('token'),
            },
        });
        const res = await req.json();

        if (res.users && res.status === 'success') {
            setUsers(res.users);
            setFollowing(res.user_following);
        }

        if (res.status === 'success' && res.page <= res.pages) {
            if (users.length <= 0) {
                setUsers(res.users);
            } else if (users.length <= res.total) {
                setUsers(users.concat(res.users));
            }
            setLoading(false);
            setHasMore(res.users.length > 0 && res.page < res.pages);
            setPageList(prevPageList => prevPageList + 1);
        } else {
            setHasMore(false);
        }
    };

    const handleFollow = async (userId, isFollowing) => {
        try {
          const req = await fetch(Global.url + 'user/' + userId + '/follow', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: localStorage.getItem('token'),
            },
          });
          const res = await req.json();
          if (res.status === 'success') {
            setFollowing(prevFollowing => {
              if (isFollowing) {
                return prevFollowing.filter(id => id !== userId);
              } else {
                const updatedFollowing = new Set([...prevFollowing, userId]);
                return [...updatedFollowing];
              }
            });
      
            setUsers(prevUsers =>
              prevUsers.map(user => {
                if (user._id === userId) {
                  return { ...user, following: !isFollowing };
                }
                return user;
              })
            );
          }
        } catch (error) {
          console.error('Error al seguir/dejar de seguir al usuario:', error);
        }
      };

    return (
        <UserList
            users={users}
            setUsers={setUsers}
            following={following}
            setFollowing={setFollowing}
            hasMore={hasMore}
            setHasMore={setHasMore}
            getUsers={getUsers}
            handleFollow={handleFollow}
        />
    );
};

export default People;