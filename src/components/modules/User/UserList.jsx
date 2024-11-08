import React, { useEffect, useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import { Global } from '../../../helpers/Global';
import SkeletonLoader from './SkeletonLoader';
import InfiniteScroll from 'react-infinite-scroll-component';

const UserList = ({ users, setUsers, following, setFollowing, hasMore, setHasMore, getUsers, textError }) => {
    const { auth } = useAuth();
    const [followingState, setFollowingState] = useState({});

    useEffect(() => {
        setFollowingState(
            users.reduce((acc, user) => {
                acc[user._id] = following.includes(user._id);
                return acc;
            }, {})
        );
    }, [users, following]);

    const follow = async (userId) => {
        const req = await fetch(Global.url + "follow/save", {
            method: "POST",
            body: JSON.stringify({ followed: userId }),
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        });
        const res = await req.json();
        if (res.status === "success") {
            setFollowing([...following, userId]);
            setFollowingState((prevState) => ({
                ...prevState,
                [userId]: true,
            }));
        }
    };

    const unfollow = async (userId) => {
        const req = await fetch(Global.url + "follow/unfollow/" + userId, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        });
        const res = await req.json();
        if (res.status === "success") {
            let filterFollowings = following.filter(id => userId !== id);
            setFollowing(filterFollowings);
            setFollowingState((prevState) => ({
                ...prevState,
                [userId]: false,
            }));
        }
    };

    return (
        <InfiniteScroll id='infiniteScroll' dataLength={users.length} scrollableTarget="infiniteScroll" next={getUsers} hasMore={hasMore} loader={<SkeletonLoader></SkeletonLoader>}>
            <div className='w-full h-full flex flex-col gap-4'>
                {(users.length > 0) ? users.map((e) => {
                    const isFollowing = followingState[e._id];
                    const handleFollowClick = () => {
                        if (isFollowing) {
                            unfollow(e._id);
                        } else {
                            follow(e._id);
                        }
                    };

                    return (
                        <article key={e._id} className='w-full flex border px-4 py-6 items-center gap-4'>
                            <img src={e.image} alt="" className='w-16 h-16 rounded-full' />
                            <div className='w-full flex justify-between'>
                                <div className='flex flex-col justify-center'>
                                    <h6>{e.nick}</h6>
                                </div>
                                {(e._id !== auth._id) ? (
                                    <button
                                        className='flex px-3 py-2 justify-center items-center text-white dark:bg-danube-500 dark:hover:bg-danube-600 bg-big-stone-600 hover:bg-big-stone-700 rounded-md transition duration-200 ease-in-out'
                                        onClick={handleFollowClick}
                                    >
                                        {isFollowing ? 'Dejar de Seguir' : 'Seguir'}
                                    </button>
                                ) : (
                                    ""
                                )}
                            </div>
                        </article>
                    );
                }) : (
                    <p className='text-center py-4'>{textError}</p>
                )}
            </div>
        </InfiniteScroll>
    );
};

export default UserList;