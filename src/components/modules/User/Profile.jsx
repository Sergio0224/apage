import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '../../../hooks/useAuth'
import { GetProfile } from '../../../helpers/GetProfile'
import { useEffect } from 'react'
import { Global } from '../../../helpers/Global'
import { useLocation } from "react-router-dom"
import SkeletonLoader from '../../private/Feed/SkeletonLoader'
import InfiniteScroll from 'react-infinite-scroll-component'
import Paragraph from '../Publication/Paragraph'
import Skeleton from 'react-loading-skeleton'

const Profile = () => {

  const location = useLocation()
  const params = useParams()
  const [counters, setCounters] = useState({})
  const [user, setUser] = useState({})
  const [pageList, setPageList] = useState(1)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [followingState, setFollowingState] = useState({});
  const { auth } = useAuth()

  useEffect(() => {
    const fetchData = async () => {
      try {
        await GetProfile(params.userId, setUser);
        await getCounters();
        await getPublications();
        await getFollowing();
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const getFollowing = async () => {
    const req = await fetch(Global.url + "follow/following/" + auth._id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("token")
      }
    });
    const res = await req.json();

    if (res.status === "success" && res.following) {
      const followingUsers = res.following;
      setFollowingState((prevState) => ({
        ...prevState,
        [params.userId]: followingUsers.includes(params.userId),
      }));
    } else {
      setFollowingState((prevState) => ({
        ...prevState,
        [params.userId]: false,
      }));
    }
  };

  const follow = async () => {
    const req = await fetch(Global.url + "follow/save", {
      method: "POST",
      body: JSON.stringify({ followed: params.userId }),
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("token")
      }
    });
    const res = await req.json();
    if (res.status === "success") {
      setFollowingState((prevState) => ({
        ...prevState,
        [params.userId]: true,
      }));
    }
  };

  const unfollow = async () => {
    const req = await fetch(Global.url + "follow/unfollow/" + params.userId, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("token")
      }
    });
    const res = await req.json();
    if (res.status === "success") {
      setFollowingState((prevState) => ({
        ...prevState,
        [params.userId]: false,
      }));
    }
  };

  const getCounters = async () => {
    const req = await fetch(Global.url + "user/counters/" + params.userId, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("token")
      }
    })
    const res = await req.json()

    if (res) {
      setCounters(res)
    }
  }

  const getPublications = async () => {

    const req = await fetch(Global.url + "publication/user/" + params.userId + "/" + pageList, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("token")
      }
    })

    const res = await req.json()
    if (res.status === "success" && res.page <= res.pages) {
      if (posts.length <= 0) {
        setPosts(res.publications);
      } else if (posts.length <= res.total) {
        setPosts(posts.concat(res.publications));
      }
      setLoading(false);
      setHasMore(res.publications.length > 0 && res.page < res.pages);
      setPageList(prevPageList => prevPageList + 1);
    } else {
      setHasMore(false);
      setLoading(false);
    }
  }

  const styleButton = (link) => {
    return (location.pathname === link) ? "dark:bg-[#505050] bg-[#dcdcdc] py-3 px-4 rounded-3xl transition duration-200 ease-in-out" : ""
  }

  return (
    <div className='w-full h-full flex flex-col gap-4'>
      <div className='w-full flex flex-col lg:flex-row gap-10'>
        {
          (loading) ?
            <>
              <div className='flex items-center gap-4'>
                <span><Skeleton className='w-14 h-14' circle={true} /></span>
                <span><Skeleton className='w-20 h-5' /></span>
                <Skeleton className='w-20 h-10 rounded-md' />
              </div>
              <div className='w-full lg:w-1/2'>
                <Skeleton className='rounded-full w-full min-h-16' />
              </div>
            </>
            :
            <>
              <div className='flex items-center gap-4'>
                <img src={user.image} alt="user-image" className='w-16 h-16 rounded-full' />
                <h2>{user.nick}</h2>
                {(params.userId !== auth._id) && (
                  <button
                    className='flex px-3 py-2 justify-center items-center text-white dark:bg-danube-500 dark:hover:bg-danube-600 bg-big-stone-600 hover:bg-big-stone-700 rounded-md transition duration-200 ease-in-out'
                    onClick={followingState[params.userId] ? unfollow : follow}
                  >
                    {followingState[params.userId] ? 'Dejar de Seguir' : 'Seguir'}
                  </button>)}
              </div>
              <div className='dark:bg-[#242424] bg-[#F2F2F2] rounded-full flex items-center gap-8 w-full lg:w-1/2 min-h-16 justify-center'>
                <Link to={""} className={styleButton("/home/profile/" + params.userId)}>Publicaciones <span className='bg-black text-white py-1 px-2 rounded-2xl'>{counters.publications}</span></Link>
                <Link to="seguidores" className={styleButton("/home/profile/" + params.userId + "/seguidores")}>Seguidores <span className='bg-black text-white py-1 px-2 rounded-2xl'>{counters.followed}</span></Link>
                <Link to="siguiendo" className={styleButton("/home/profile/" + params.userId + "/siguiendo")}>Seguidos <span className='bg-black text-white py-1 px-2 rounded-2xl'>{counters.following}</span></Link>
              </div>
            </>
        }
      </div>
      <div>
        {auth._id ? <Outlet /> : <Navigate to="/" />}
        {
          (location.pathname === "/home/profile/" + params.userId) &&
          <InfiniteScroll className='gap-8 flex flex-col' id='infiniteScroll' dataLength={posts.length} scrollableTarget="infiniteScroll"
            next={getPublications}
            hasMore={hasMore}
            loader={<SkeletonLoader></SkeletonLoader>}>
            {
              (loading) ? <div className='gap-8 flex flex-col'><SkeletonLoader /><SkeletonLoader /><SkeletonLoader /><SkeletonLoader /></div>
                : (
                  (posts && posts.length > 0) ?
                    posts.map((data) => {
                      return (
                        <div className='border px-4 py-6 w-full flex flex-col gap-3' key={data._id}>
                          <div className='flex items-center gap-2'>
                            <img src={data.user.image} alt="" className='w-16 h-16 rounded-full' />
                            <Link to={`profile/${data.user._id}`}><h6>@{data.user.nick}</h6></Link>
                          </div>
                          <div>
                            <Paragraph content={data.text} />
                          </div>
                        </div>
                      )
                    })
                    : <p className='text-center py-4'>No hay publicaciones para mostrar</p>
                )
            }
          </InfiniteScroll>
        }
      </div>
    </div>
  )
}

export default Profile