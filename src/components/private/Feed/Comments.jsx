import React, { useEffect, useRef, useState } from 'react';
import { Global } from '../../../helpers/Global';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import socket from '../../../helpers/Socket';
import Comment from './Comment';
import ReactDOMServer from 'react-dom/server';

const Comments = ({ pubId }) => {
    const [comments, setComments] = useState([]);
    const [likes, setLikes] = useState();
    const inputComment = useRef();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(Global.url + "publication/" + pubId + "/comments/get", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": localStorage.getItem("token")
                    }
                });
                const data = await res.json();
                setComments(data.comments);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchData();

        socket.on("nuevo-comentario-recibido", (data) => {
            if (data && data.comment && data.comment._id) {
                setComments((prevComments) => {
                    const existingComment = prevComments.find(
                        (comment) => comment._id === data.comment._id
                    );
                    if (existingComment) {
                        return prevComments;
                    } else {
                        return [...prevComments, data.comment];
                    }
                });
            } else {
                console.error('Datos del comentario no válidos:', data);
            }
        });

        return () => {
            socket.off("nuevo-comentario-recibido")
        };
    }, []);

    const viewComments = () => {
        const commentsElement = (
            <div>
                <ul>
                    {comments.map((comment) => (
                        <Comment key={comment._id} comment={comment} />
                    ))}
                </ul>
            </div>
        );

        const commentsHTML = ReactDOMServer.renderToString(commentsElement);

        Swal.fire({
            title: 'Comentarios',
            html: commentsHTML,
            showConfirmButton: false,
            showCloseButton: true,
            customClass: {
                popup: "dark:bg-[#242424] w-[90%] md:w-1/2",
                title: "dark:text-[#D1D1D1]"
            }
        });
    }

    const setComment = async (comment) => {
        const req = await fetch(Global.url + "publication/" + pubId + "/comments/create", {
            method: "POST",
            body: JSON.stringify({ text: comment, publicationId: pubId }),
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        });
        const res = await req.json();
        if (res) {
            setComments(comments.concat(res.comment));
            inputComment.current.value = "";

            if (socket) {
                socket.emit("nuevo-comentario", res.comment);
            }
        }
    }

    const likeComment = async () => {
        const req = await fetch(Global.url + "comment/" + pubId + "/like", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        });
        const res = await req.json();

        if (res.status === "success") {
        }
    }

    const unlikeComment = async () => {
        const req = await fetch(Global.url + "comment/" + pubId + "/unlike", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        });
        const res = await req.json();

        if (res.status === "success") {
        }
    }

    const getCommentLikes = async () => {
        const req = await fetch(Global.url + "comment/" + pubId + "/likes", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        });
        const res = await req.json();

        if (res.status === "success") {
        }
    }

    return (
        <div className='flex flex-col text-center justify-center py-2 w-full'>
            <div className='flex gap-6 py-4 justify-center'>
                <input className="border w-full lg:w-3/5 rounded-md px-1 py-2 dark:bg-[#2a2a2a] dark:border-[#3a3a3a] bg-[#f7f7f7] border-slate-200" ref={inputComment} type="text" placeholder='Ingrese su comentario' />
                <button className='py-3 px-4 rounded-lg dark:bg-[#303030] dark:hover:bg-[#505050] bg-[#ededed] hover:bg-[#dcdcdc] transition duration-200 ease-in-out' type='button' onClick={() => setComment(inputComment.current.value)}><FontAwesomeIcon className='dark:text-danube-500 dark:hover:text-danube-600 text-big-stone-600 hover:text-big-stone-700' icon={faPaperPlane}></FontAwesomeIcon></button>
            </div>
            {(comments.length <= 0) ?
                <p className='py-2'>No hay comentarios en esta publicacion</p>
                :
                <button className='py-2'
                    onClick={() => {
                        viewComments();
                    }}>
                    Ver comentarios {`(${comments.length})`}
                </button>
            }
        </div>
    )
}

export default Comments;