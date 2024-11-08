import React, { useEffect, useRef, useState } from 'react'
import { Global } from '../../../helpers/Global'
import { Field, Form, Formik, ErrorMessage } from 'formik'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile, faFilePdf, faFileWord, faHeart, faPaperPlane, faTrash, faUpload, faHome, faUsers, faImage, faBell, faPlus, faBook } from '@fortawesome/free-solid-svg-icons'
import FormulaPopup from '../../modules/Publication/FormulaPopup'
import UseAlgebraicExpression from '../../../hooks/UseAlgebraicExpression'
import Paragraph from '../../modules/Publication/Paragraph'
import InfiniteScroll from 'react-infinite-scroll-component'
import SkeletonLoader from './SkeletonLoader'
import { Link } from 'react-router-dom'
import useAuth from '../../../hooks/useAuth'
import Comments from './Comments'
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import Swal from 'sweetalert2'
import socket from "../../../helpers/Socket"
import InitialAvatar from "../../modules/User/InitialAvatar"
import CardUser from "../../modules/User/CardUser"
import { PollCreator, PollDisplay } from './components/Polls';
import { faTrophy } from '@fortawesome/free-solid-svg-icons';
import MathChallenges from './components/MathChallenges'
import LeaderboardList from "./components/LeaderboardList"
import WeeklyChallenge from './components/WeeklyChallenge'
import useSection from '../../../hooks/useSection';
import Learning from "../Learning/Learning"

export const Feed = () => {

    const [pageList, setPageList] = useState(1)
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [hasMore, setHasMore] = useState(true)
    const { inputValue, setInputValue, renderExpression } = UseAlgebraicExpression()
    const [following, setFollowing] = useState([]);
    const [likes, setLikes] = useState({});
    const { auth } = useAuth()
    const [isLiked, setIsLiked] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const fileInputRef = useRef(null);
    const inputRef = useRef(null);
    const [imageLoaded, setImageLoaded] = useState(false)
    const [postType, setPostType] = useState('text');
    const { activeSection, setActiveSection } = useSection();

    const handleImageLoad = () => {
        setImageLoaded(true)
    }

    const handleImageError = () => {
        setImageLoaded(false)
    }

    const toggleLike = () => {
        setIsLiked(!isLiked);
    };

    useEffect(() => {

        const fetchData = async () => {
            try {
                await Promise.all([getUsers(), getPublications()])

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();

        socket.on("nueva-publicacion-recibida", (nuevaPublicacion) => {
            getPublication(nuevaPublicacion._id)
        });

        socket.on('dislike-recibido', async (updatedPublication) => {
            setPosts(prevPublications => {
                return prevPublications.map(pub => {
                    if (pub._id === updatedPublication._id) {
                        return {
                            ...pub,
                            likes: updatedPublication.likes,
                        };
                    }
                    return pub;
                });
            });
            const req = await fetch(Global.url + "publication/" + pubId + "/unlike", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("token")
                }
            })
            const res = req.json()
        });

        socket.on('nuevo-like-recibido', (updatedPublication) => {
            setPosts(prevPublications => {
                return prevPublications.map(pub => {
                    if (pub._id === updatedPublication._id) {
                        return {
                            ...pub,
                            likes: updatedPublication.likes
                        };
                    }
                    return pub;
                });
            });
        });

        socket.on('nueva-encuesta-recibida', (data) => {
            if (data.pollPost) {
                setPosts(prevPosts => {
                    // Evitar duplicados
                    if (prevPosts.some(post => post._id === data.pollPost._id)) {
                        return prevPosts;
                    }
                    return [data.pollPost, ...prevPosts];
                });
            }
        });

        socket.on('voto-encuesta-recibido', (encuestaActualizada) => {
            setPosts(prevPosts => {
                return prevPosts.map(post => {
                    if (post.type === 'poll' && post._id === encuestaActualizada._id) {
                        return {
                            ...post,
                            poll: encuestaActualizada
                        };
                    }
                    return post;
                });
            });
        });

        return () => {
            socket.off("nueva-publicacion-recibida")
            socket.off('dislike-recibido')
            socket.off('nuevo-like-recibido');
            socket.off('nueva-encuesta-recibida');
            socket.off('voto-encuesta-recibido');
        };

    }, []);

    const getPublication = async (pubId) => {
        const req = await fetch(`${Global.url}publication/${pubId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        })

        const res = await req.json()
        if (res) {
            setPosts(prevPosts => [res, ...prevPosts]);
        }

    }

    const getUsers = async () => {

        const userId = auth._id

        const req = await fetch(Global.url + "follow/following/" + userId + "/1", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        })
        const res = await req.json()

        let newArrayFollowing = []

        res.follows.forEach(follow => {
            newArrayFollowing = [...newArrayFollowing, follow.followed]
        })

        res.users = newArrayFollowing

        if (res.users && res.status == "success") {
            setFollowing(res.user_following)
        }
    }


    const getPublications = async () => {
        try {
            // Obtener publicaciones normales
            const reqPubs = await fetch(Global.url + "publication/feed/" + pageList, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("token")
                }
            });
            const resPubs = await reqPubs.json();

            // Obtener encuestas
            const reqPolls = await fetch(Global.url + "poll/list/" + pageList, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("token")
                }
            });
            const resPolls = await reqPolls.json();

            // Convertir las encuestas al formato de publicación
            const pollPosts = resPolls.polls.map(poll => ({
                _id: poll._id,
                user: poll.user,
                text: poll.question,
                type: 'poll',
                poll: poll,
                likes: [],
                created_at: poll.created_at,
            }));

            // Combinar publicaciones y encuestas, ordenar por fecha
            const allPosts = [...resPubs.publications, ...pollPosts].sort((a, b) =>
                new Date(b.created_at) - new Date(a.created_at)
            );

            if (posts.length <= 0) {
                setPosts(allPosts);
            } else if (posts.length <= (resPubs.total + resPolls.total)) {
                setPosts(prevPosts => [...prevPosts, ...allPosts]);
            }

            setLoading(false);
            setHasMore(allPosts.length > 0);
            setPageList(prevPageList => prevPageList + 1);
        } catch (error) {
            console.error('Error fetching publications:', error);
            setLoading(false);
            setHasMore(false);
        }
    };

    const getLikes = async (pubId) => {
        const req = await fetch(Global.url + "publication/" + pubId + "/likes", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        })

        const res = await req.json()

        if (res) {
            setLikes(prevLikes => ({ ...prevLikes, [res._id]: res.likes }))
        }
    }

    const like = async (pubId) => {
        const req = await fetch(Global.url + "publication/" + pubId + "/like", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        });
        const res = await req.json();
        if (res) {
            socket.emit("nuevo-like", { publicationId: pubId, userId: auth._id });
        }
    }


    const unlike = async (pubId) => {
        socket.emit("nuevo-dislike", { publicationId: pubId, userId: auth._id });
    }

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                resolve(fileReader.result.split(',')[1]);
            };
            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };


    const savePublication = async (values) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Authentication token not found");
            }

            // Crear el objeto de publicación
            const publicationData = {
                text: inputValue,
            };

            // Guardar la publicación inicial
            const req = await fetch(Global.url + "publication/save", {
                method: "POST",
                body: JSON.stringify(publicationData),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token,
                },
            });

            const res = await req.json();

            if (res.status !== "success") {
                throw new Error("Failed to save publication");
            }

            // Si hay archivos seleccionados, subirlos
            if (selectedFiles.length > 0) {
                const formData = new FormData();
                selectedFiles.forEach((file) => {
                    formData.append("files", file);
                });

                const uploadReq = await fetch(
                    Global.url + "publication/upload/" + res.publicationStored._id,
                    {
                        method: "POST",
                        body: formData,
                        headers: {
                            "Authorization": token,
                        },
                    }
                );

                const uploadRes = await uploadReq.json();

                if (uploadRes.status !== "success") {
                    throw new Error("Failed to upload files");
                }

                // Emitir el evento socket con la publicación actualizada
                socket.emit("nueva-publicacion", { publication: uploadRes.publication });
            } else {
                // Si no hay archivos, emitir el evento con la publicación original
                socket.emit("nueva-publicacion", { publication: res.publicationStored });
            }

            // Generar comentario AI si hay texto
            if (inputValue) {
                const generateCom = await fetch(Global.url + "comment/generate", {
                    method: "POST",
                    body: JSON.stringify({ text: inputValue }),
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": token,
                    }
                });

                const resCom = await generateCom.json();
                if (resCom.comment) {
                    await createComment(res.publicationStored._id, resCom.comment);
                }
            }

            // Limpiar el estado
            setInputValue("");
            setPreviews([]);
            setSelectedFiles([]);
            if (fileInputRef.current) {
                fileInputRef.current.value = null;
            }

            // Mostrar mensaje de éxito
            showSuccessToast();

        } catch (error) {
            console.error("Error in savePublication:", error);
            showErrorToast(error.message);
        }
    };

    // Helper function to handle text-only publications
    const handleTextPublication = async (values, publicationStored, token) => {
        // Generate AI comment
        const generateCom = await fetch(Global.url + "comment/generate", {
            method: "POST",
            body: JSON.stringify({ text: values.text }),
            headers: {
                "Content-Type": "application/json",
                "Authorization": token,
            }
        });

        const resCom = await generateCom.json();

        if (resCom.comment) {
            await createComment(publicationStored._id, resCom.comment);
        }

        socket.emit("nueva-publicacion", { publication: publicationStored });
    };

    // Helper function to handle publications with files
    const handleFilePublication = async (fileInput, values, publicationStored, token) => {
        const formData = new FormData();
        Array.from(fileInput.files).forEach(file => {
            formData.append("files", file);
        });

        const reqUpload = await fetch(
            Global.url + "publication/upload/" + publicationStored._id,
            {
                method: "POST",
                body: formData,
                headers: {
                    "Authorization": token,
                },
            }
        );
        const resUpload = await reqUpload.json();

        if (resUpload.status !== "success") {
            throw new Error("Failed to upload files");
        }

        // Reset file input state
        if (typeof setPreviews === "function") setPreviews([]);
        if (typeof setSelectedFiles === "function") setSelectedFiles([]);
        if (fileInputRef?.current) fileInputRef.current.value = null;

        // Generate AI comment for image
        const firstFile = fileInput.files[0];
        if (firstFile) {
            await handleImageComment(firstFile, values, token);
        }

        socket.emit("nueva-publicacion", { publication: resUpload.publication });
    };

    // Helper function to create a comment
    const createComment = async (publicationId, commentText) => {
        const geminiToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjY3MmUyZjI3Mzk2NjA1ODMyNDhiYWIxOCIsIm5hbWUiOiJHZW1pbmkiLCJuaWNrIjoiR2VtaW5pIiwiZW1haWwiOiJHZW1pbmlAR2VtaW5pLmNvbSIsInJvbGUiOiJyb2xlX3VzZXIiLCJpbWFnZSI6Imh0dHBzOi8vcmVzLmNsb3VkaW5hcnkuY29tL2RiaXpibmloaS9pbWFnZS91cGxvYWQvdjE3MzEwODA1NzMvYXZhdGFycy94dXJzcGx1cWc3YmNwMnl1Ynhudi5wbmciLCJpYXQiOjE3MzEwODA2NTEsImV4cCI6MTczMzY3MjY1MX0.cDxM21hDcHf9xfB5HJl6JJXrmuXHGj-j3bvplHvQmZU";

        await fetch(Global.url + "publication/" + publicationId + "/comments/create", {
            method: "POST",
            body: JSON.stringify({ text: commentText, publicationId }),
            headers: {
                "Content-Type": "application/json",
                "Authorization": geminiToken
            }
        });
    };

    // Helper function to handle image comment generation
    const handleImageComment = async (file, values, token) => {
        const fileBlob = new Blob([file], { type: file.type });
        const base64 = await convertToBase64(fileBlob);

        await fetch(Global.url + "comment/generate-from-image", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
            body: JSON.stringify({ text: values.text, imageBase64: base64 }),
        });
    };

    // Toast notification helpers
    const showSuccessToast = () => {
        Swal.fire({
            html: "<p class='font-bold dark:text-[#D1D1D1]'>Publicacion realizada</p>",
            icon: "success",
            showCloseButton: true,
            showConfirmButton: false,
            timer: 5000,
            timerProgressBar: true,
            toast: true,
            position: "bottom-right",
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            customClass: {
                popup: "dark:bg-[#242424]",
                timerProgressBar: "dark:bg-[#505050]"
            }
        });
    };

    const showErrorToast = (message) => {
        Swal.fire({
            html: `<p class='font-bold dark:text-[#D1D1D1]'>Error: ${message}</p>`,
            icon: "error",
            showCloseButton: true,
            showConfirmButton: false,
            timer: 5000,
            timerProgressBar: true,
            toast: true,
            position: "bottom-right",
            customClass: {
                popup: "dark:bg-[#242424]",
                timerProgressBar: "dark:bg-[#505050]"
            }
        });
    };
    const downloadFile = (fileUrl) => {
        const fileName = fileUrl.split('/').pop();
        fetch(fileUrl, {
            headers: {
                'Content-Type': 'application/pdf',
            },
        })
            .then((response) => response.blob())
            .then((blob) => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', fileName);
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
            })
            .catch((error) => {
                console.error('Error al descargar el archivo:', error);
            });
    };

    const isDownloadableFile = (fileUrl) => {
        const allowedFileExtensions = ['pdf', 'docx', 'doc'];
        const allowedImageExtensions = ['jpg', 'jpeg', 'png', 'gif'];

        if (!fileUrl) {
            return false; // Si fileUrl es undefined, null, '', 0, false, retorna falso
        }

        const fileName = fileUrl.split('/').pop();
        const extension = fileName.split('.').pop().toLowerCase();

        if (allowedImageExtensions.includes(extension)) {
            return 'isImage';
        } else if (allowedFileExtensions.includes(extension)) {
            return { isFile: true, fileType: extension };
        } else {
            return false;
        }
    };

    const handleFileChange = (event) => {
        const files = event.target.files;
        const newPreviews = [];
        const newSelectedFiles = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            newSelectedFiles.push(file);

            if (file.type.startsWith('image/')) {
                const preview = URL.createObjectURL(file);
                newPreviews.push({ type: 'image', preview, file });
            } else {
                newPreviews.push({ type: 'file', preview: file.name, file });
            }
        }

        setSelectedFiles((prevSelectedFiles) => [...prevSelectedFiles, ...newSelectedFiles]);
        setPreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
    };

    const removeFile = (index) => {
        const newSelectedFiles = [...selectedFiles];
        const newPreviews = [...previews];

        const removedFile = newSelectedFiles.splice(index, 1)[0];

        const removedPreview = newPreviews.splice(index, 1)[0];

        setSelectedFiles(newSelectedFiles);
        setPreviews(newPreviews);

        if (removedPreview && removedPreview.type === 'image') {
            URL.revokeObjectURL(removedPreview.preview);
        }

        const dataTransfer = new DataTransfer();
        const remainingFiles = Array.from(fileInputRef.current.files)
            .filter((_, i) => i !== index);

        remainingFiles.forEach((file) => {
            dataTransfer.items.add(file);
        });

        fileInputRef.current.files = dataTransfer.files;
    };

    // En la función handlePollSubmit, modifica el evento socket.emit para incluir la información del usuario
    const handlePollSubmit = async (pollData) => {
        try {
            const response = await fetch(Global.url + 'poll/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify(pollData)
            });

            if (!response.ok) {
                throw new Error('Error al crear la encuesta');
            }

            const newPoll = await response.json();

            // Crear estructura completa del post
            const pollPost = {
                _id: newPoll.poll._id,
                user: auth, // Incluir información completa del usuario autenticado
                text: newPoll.poll.question,
                type: 'poll',
                poll: newPoll.poll,
                likes: [],
                created_at: newPoll.poll.created_at
            };

            // Emitir el post completo
            socket.emit('nueva-encuesta', { pollPost });

            // Actualizar el estado local
            setPosts(prevPosts => [pollPost, ...prevPosts]);

            setPostType('text'); // Volver al modo de publicación normal
        } catch (error) {
            console.error('Error:', error);
            alert('No se pudo crear la encuesta');
        }
    };

    // Modificar la función handleVote
    const handleVote = async (pollId, optionIndex) => {
        try {
            const response = await fetch(`${Global.url}poll/vote/${pollId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify({ optionIndex })
            });

            if (!response.ok) {
                throw new Error('Error al registrar el voto');
            }

            const updatedPoll = await response.json();

            // Emitir evento de voto
            socket.emit('voto-encuesta', {
                pollId: pollId,
                poll: updatedPoll.poll
            });
        } catch (error) {
            console.error('Error:', error);
            alert('No se pudo registrar el voto');
        }
    };



    return (
        <div className="flex w-full min-h-screen">
            {/* Sidebar */}
            <div className="hidden lg:flex flex-col w-64 p-6 border-r dark:border-[#2d2d2d] space-y-8">
                {/* User Profile Summary */}
                <div className="flex items-center space-x-3 mb-8">
                    {auth.image ? (
                        <img
                            src={auth.image}
                            className="w-12 h-12 rounded-full border-2 border-white dark:border-[#2d2d2d]"
                            alt={auth.name}
                        />
                    ) : (
                        <InitialAvatar name={auth.name} size={48} fontSize={24} />
                    )}
                    <div>
                        <h3 className="font-medium dark:text-white">{auth.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">@{auth.nick}</p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="space-y-2">
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            setActiveSection('inicio');
                        }}
                        className={`flex items-center space-x-3 p-3 rounded-xl ${activeSection === 'inicio'
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                            : 'hover:bg-gray-100 dark:hover:bg-[#2a2a2a] text-gray-700 dark:text-gray-300'
                            }`}
                    >
                        <FontAwesomeIcon icon={faHome} className="w-5 h-5" />
                        <span>Inicio</span>
                    </a>
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            setActiveSection('retos');
                        }}
                        className={`flex items-center space-x-3 p-3 rounded-xl ${activeSection === 'retos'
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                            : 'hover:bg-gray-100 dark:hover:bg-[#2a2a2a] text-gray-700 dark:text-gray-300'
                            }`}
                    >
                        <FontAwesomeIcon icon={faTrophy} className="w-5 h-5" />
                        <span>Retos</span>
                    </a>
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            setActiveSection('aprendizaje');
                        }}
                        className={`flex items-center space-x-3 p-3 rounded-xl ${activeSection === 'aprendizaje'
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                            : 'hover:bg-gray-100 dark:hover:bg-[#2a2a2a] text-gray-700 dark:text-gray-300'
                            }`}
                    >
                        <FontAwesomeIcon icon={faBook} className="w-5 h-5" />
                        <span>Aprendizaje</span>
                    </a>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 max-w-3xl mx-auto px-4 py-6">
                {activeSection === 'inicio' ? (
                    // Content for Inicio section
                    <>
                        {/* Create Post */}
                        <div className="bg-white dark:bg-[#242424] rounded-xl shadow-lg mb-6">
                            {/* Tipo de publicación */}
                            <div className="flex border-b dark:border-[#3a3a3a]">
                                <button
                                    onClick={() => setPostType('text')}
                                    className={`flex-1 p-3 text-center ${postType === 'text'
                                        ? 'border-b-2 border-blue-500 text-blue-500'
                                        : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-[#2a2a2a]'
                                        }`}
                                >
                                    Publicación
                                </button>
                                <button
                                    onClick={() => setPostType('poll')}
                                    className={`flex-1 p-3 text-center ${postType === 'poll'
                                        ? 'border-b-2 border-blue-500 text-blue-500'
                                        : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-[#2a2a2a]'
                                        }`}
                                >
                                    Encuesta
                                </button>
                            </div>

                            {postType === 'text' ? (
                                <Formik
                                    initialValues={{
                                        text: '',
                                    }}
                                    validate={values => {
                                        const errors = {};
                                        if (!inputValue && selectedFiles.length === 0) {
                                            errors.text = 'Debes escribir algo o adjuntar un archivo';
                                        }
                                        return errors;
                                    }}
                                    onSubmit={(values, { setSubmitting }) => {
                                        savePublication(values).finally(() => {
                                            setSubmitting(false);
                                        });
                                    }}
                                >
                                    {({ isSubmitting, setFieldValue }) => (
                                        <Form className="p-4">
                                            <div className="flex items-start space-x-4 mb-4">
                                                {auth.image ? (
                                                    <img
                                                        src={auth.image}
                                                        className="w-10 h-10 rounded-full"
                                                        alt={auth.name}
                                                    />
                                                ) : (
                                                    <InitialAvatar name={auth.name} size={40} fontSize={20} />
                                                )}
                                                <Field
                                                    as="textarea"
                                                    name="text"
                                                    value={inputValue}
                                                    onChange={e => setInputValue(e.target.value)}
                                                    className="flex-1 resize-none rounded-2xl border p-3 min-h-[60px] bg-gray-100 dark:bg-[#2a2a2a] dark:border-[#3a3a3a] focus:ring-2 focus:ring-blue-500"
                                                    placeholder="¿Qué está pasando?"
                                                />
                                            </div>

                                            <div className="flex items-center justify-between border-t dark:border-[#3a3a3a] pt-3">
                                                <div className="flex items-center space-x-4">
                                                    <FormulaPopup />
                                                    <button className="flex gap-2 items-center" type="button" onClick={() => fileInputRef.current?.click()}>
                                                        <span className="dark:bg-danube-500 dark:hover:bg-danube-600 border-0 text-white bg-big-stone-600 hover:bg-big-stone-700 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer">
                                                            <FontAwesomeIcon className="w-1/2 h-1/2" icon={faUpload}></FontAwesomeIcon>
                                                        </span>
                                                        Subir Archivos
                                                        <input
                                                            type="file"
                                                            className="hidden"
                                                            multiple
                                                            ref={fileInputRef}
                                                            onChange={handleFileChange}
                                                        />
                                                    </button>
                                                </div>

                                                <button
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full disabled:opacity-50 transition-colors"
                                                >
                                                    {isSubmitting ? "Publicando..." : "Publicar"}
                                                </button>
                                            </div>

                                            {/* File Previews */}
                                            {previews.length > 0 && (
                                                <div className="grid grid-cols-2 gap-4 mt-4">
                                                    {previews.map((preview, index) => (
                                                        <div key={index} className="relative group rounded-xl overflow-hidden">
                                                            {preview.type === 'image' ? (
                                                                <img src={preview.preview} alt="" className="w-full h-40 object-cover" />
                                                            ) : (
                                                                <div className="flex items-center p-4 bg-gray-100 dark:bg-[#2a2a2a] h-40">
                                                                    <span className="truncate">{preview.preview}</span>
                                                                </div>
                                                            )}
                                                            <button
                                                                type="button"
                                                                onClick={() => removeFile(index)}
                                                                className="absolute top-2 right-2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >
                                                                <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </Form>
                                    )}
                                </Formik>
                            ) : (
                                <PollCreator onSubmit={handlePollSubmit} />
                            )}
                        </div>

                        {/* Posts Feed */}
                        <InfiniteScroll
                            dataLength={posts.length}
                            next={getPublications}
                            hasMore={hasMore}
                            loader={<SkeletonLoader />}
                            className="space-y-6"
                        >
                            {loading ? (
                                <div className="space-y-6">
                                    <SkeletonLoader />
                                    <SkeletonLoader />
                                    <SkeletonLoader />
                                </div>
                            ) : (
                                posts.map((data) => (
                                    <div key={data._id} className="bg-white dark:bg-[#242424] rounded-xl shadow-lg overflow-hidden">
                                        {/* Post Header */}
                                        <div className="p-4 flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                {data.user.image ? (
                                                    <img
                                                        src={data.user.image}
                                                        className="w-10 h-10 rounded-full"
                                                        alt={data.user.name}
                                                    />
                                                ) : (
                                                    <InitialAvatar name={data.user.name} size={40} fontSize={20} />
                                                )}
                                                <Link to={`profile/${data.user._id}`} className="font-medium hover:underline">
                                                    @{data.user.nick}
                                                </Link>
                                            </div>
                                            {data.type !== 'poll' && (
                                                <button
                                                    onClick={() => data.likes.includes(auth._id) ? unlike(data._id) : like(data._id)}
                                                    className={`flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition-all ${data.likes.includes(auth._id) ? 'text-red-500' : 'text-gray-400'}`}
                                                >
                                                    <FontAwesomeIcon
                                                        icon={data.likes.includes(auth._id) ? faHeartSolid : faHeartRegular}
                                                        className={`w-5 h-5 ${data.likes.includes(auth._id) ? 'scale-110' : ''}`}
                                                    />
                                                    <span>{data.likes.length}</span>
                                                </button>
                                            )}
                                        </div>

                                        {/* Post Content */}
                                        <div className="px-4 pb-4">
                                            {data.type === 'poll' ? (
                                                <PollDisplay
                                                    poll={data.poll}
                                                    onVote={(optionIndex) => handleVote(data._id, optionIndex)}
                                                    userId={auth._id}
                                                />
                                            ) : (
                                                <>
                                                    <Paragraph content={data.text} className="mb-4" />

                                                    {/* Post Files */}
                                                    {data.files && (
                                                        <div className="space-y-4">
                                                            {data.files.map((file, index) => {
                                                                const fileInfo = isDownloadableFile(file);
                                                                if (fileInfo.isFile) {
                                                                    return (
                                                                        <button
                                                                            key={index}
                                                                            onClick={() => downloadFile(file)}
                                                                            className={`flex items-center space-x-3 p-4 rounded-xl w-full transition-colors ${fileInfo.fileType === "pdf"
                                                                                ? 'bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700'
                                                                                : 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700'
                                                                                } text-white`}
                                                                        >
                                                                            <FontAwesomeIcon icon={fileInfo.fileType === "pdf" ? faFilePdf : faFileWord} className="w-5 h-5" />
                                                                            <span className="truncate">{file.split('/').pop()}</span>
                                                                        </button>
                                                                    );
                                                                }
                                                                return fileInfo === "isImage" && (
                                                                    <img
                                                                        key={index}
                                                                        src={file}
                                                                        alt=""
                                                                        className="w-full rounded-xl"
                                                                    />
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>

                                        {/* Comments Section */}
                                        <div className="border-t dark:border-[#3a3a3a] px-4 py-3">
                                            {(data.type === "poll") ? console.log("poll")
                                                :
                                                <Comments pubId={data._id} />
                                            }
                                        </div>
                                    </div>
                                ))
                            )}
                        </InfiniteScroll>
                    </>
                ) : activeSection === 'aprendizaje' ? (
                    <Learning />
                ) : (
                    <MathChallenges />
                )}
            </div>

            {/* Right Sidebar - Challenges & Leaderboard */}
            <div className="hidden xl:block w-80 p-6 border-l dark:border-[#2d2d2d]">
                <div className="sticky top-6 space-y-6">
                    {/* Challenges Section */}
                    <div className="bg-white dark:bg-[#242424] rounded-xl p-4 shadow-sm">
                        <h3 className="font-medium mb-4 dark:text-white">Retos</h3>
                        <div className="space-y-4">
                            <WeeklyChallenge />
                        </div>
                    </div>
                    {/* Leaderboard */}
                    <div className="bg-white dark:bg-[#242424] rounded-xl p-4 shadow-sm">
                        <h3 className="font-medium mb-4 dark:text-white">Leaderboard</h3>
                        <LeaderboardList />
                    </div>
                </div>
            </div>
        </div>
    );
}