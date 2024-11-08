import React, { useEffect, useState } from 'react'
import { Form, Formik, Field } from 'formik'
import useAuth from '../../../hooks/useAuth'
import { Global } from '../../../helpers/Global'
import Swal from 'sweetalert2'

const Config = () => {
  const { auth, setAuth } = useAuth()
  const [selectedImage, setSelectedImage] = useState(null)
  const [activeSection, setActiveSection] = useState('account');
  const [selectedTheme, setSelectedTheme] = useState(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark" || storedTheme === "light") {
      return storedTheme === "dark" ? "dark" : "light";
    } else {
      return "system";
    }
  });
  const [moderators, setModerators] = useState([]);
  const [bannedUsers, setBannedUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Verificar si el usuario es admin
  const isAdmin = auth?.role === 'role_admin';
  // Verificar si el usuario es moderador o admin
  const isModerator = auth?.role === 'role_moderator' || auth?.role === 'role_admin';

  useEffect(() => {
    const theme =
      selectedTheme === "system"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : selectedTheme.toLowerCase();

    if (theme === "dark") {
      document.querySelector("html").classList.add("dark");
      if (selectedTheme !== "system") {
        localStorage.setItem("theme", "dark");
      } else {
        localStorage.removeItem("theme");
      }
    } else {
      document.querySelector("html").classList.remove("dark");
      if (selectedTheme !== "system") {
        localStorage.setItem("theme", "light");
      } else {
        localStorage.removeItem("theme");
      }
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, [selectedTheme]);

  const handleSystemThemeChange = () => {
    const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = isDarkMode ? "dark" : "light";

    if (selectedTheme === "system") {
      if (theme === "dark") {
        document.querySelector("html").classList.add("dark");
      } else {
        document.querySelector("html").classList.remove("dark");
      }
    }
  };

  const sendSecurityCode = async () => {
    try {
      const req = await fetch(`${Global.url}user/securityCode`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": localStorage.getItem('token'),
        },
        body: JSON.stringify({ email: auth.email }),
      });
      const res = await req.json();
      if (res.message === 'Código de seguridad enviado') {
        verifySecurityCode();
      } else {
        Swal.fire({
          title: 'Error',
          text: res.message,
          icon: 'error',
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true,
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
          customClass: {
            popup: "dark:bg-[#242424] w-[90%] md:w-1/2",
            title: "dark:text-[#D1D1D1]",
          },
        });
      }
    } catch (error) {
      console.error('Error al enviar el código de seguridad:', error);
      Swal.fire({
        title: 'Error',
        text: 'Error al enviar el código de seguridad',
        icon: 'error',
        timer: 2000,
        showConfirmButton: false,
        timerProgressBar: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        customClass: {
          popup: "dark:bg-[#242424] w-[90%] md:w-1/2",
          title: "dark:text-[#D1D1D1]",
        },
      });
    }
  };

  const verifySecurityCode = async () => {
    const { value: code } = await Swal.fire({
      title: 'Escriba el código que ha sido enviado a su correo',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off',
      },
      showCancelButton: true,
      confirmButtonColor: "#3f8d47",
      confirmButtonText: 'Enviar',
      cancelButtonText: "Cancelar",
      cancelButtonColor: "#a73a3e",
      customClass: {
        popup: "dark:bg-[#242424] w-[90%] md:w-1/2",
        title: "dark:text-[#D1D1D1]",
        confirmButton: "hover:bg-sea-green-700",
        cancelButton: "hover:bg-stiletto-800",
        input: "dark:bg-[#2a2a2a] dark:border-[#3a3a3a] dark:text-[#D1D1D1]"
      },
      preConfirm: (inputCode) => {
        if (!inputCode) {
          Swal.showValidationMessage('Por favor, ingrese el código de seguridad.');
        }
        return inputCode;
      },
    });

    if (code) {
      try {
        const response = await fetch(`${Global.url}user/securityCode/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            "Authorization": localStorage.getItem('token'),
          },
          body: JSON.stringify({ email: auth.email, code }),
        });
        const data = await response.json();
        if (data.message === 'Código de seguridad válido') {
          updatePassword();
        } else {
          Swal.fire({
            title: 'Error',
            text: data.message,
            icon: 'error',
            timer: 2000,
            showConfirmButton: false,
            timerProgressBar: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            customClass: {
              popup: "dark:bg-[#242424] w-[90%] md:w-1/2",
              title: "dark:text-[#D1D1D1]",
            },
          });
        }
      } catch (error) {
        console.error('Error al verificar el código de seguridad:', error);
        Swal.fire({
          title: 'Error',
          text: 'Error al verificar el código de seguridad',
          icon: 'error',
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true,
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
          customClass: {
            popup: "dark:bg-[#242424] w-[90%] md:w-1/2",
            title: "dark:text-[#D1D1D1]",
          },
        });
      }
    }
  };

  const updatePassword = async () => {
    const { value: newPassword } = await Swal.fire({
      title: 'Ingrese su nueva contraseña',
      html: `
        <input id="password" class="swal2-input dark:bg-[#2a2a2a] dark:border-[#3a3a3a] dark:text-[#D1D1D1]" placeholder="Nueva contraseña" type="password">
        <input id="confirmPassword" class="swal2-input dark:bg-[#2a2a2a] dark:border-[#3a3a3a] dark:text-[#D1D1D1]" placeholder="Confirmar contraseña" type="password">
      `,
      focusConfirm: false,
      confirmButtonColor: "#3f8d47",
      confirmButtonText: 'Enviar',
      customClass: {
        confirmButton: "hover:bg-sea-green-700",
        popup: "dark:bg-[#242424] w-[90%] md:w-1/2",
        title: "dark:text-[#D1D1D1]",
      },
      preConfirm: () => {
        const password = Swal.getPopup().querySelector('#password').value;
        const confirmPassword = Swal.getPopup().querySelector('#confirmPassword').value;
        if (!password || !confirmPassword) {
          Swal.showValidationMessage('Por favor, ingrese una contraseña y confírmela.');
        } else if (password !== confirmPassword) {
          Swal.showValidationMessage('Las contraseñas no coinciden.');
        } else {
          return password;
        }
      },
    });

    if (newPassword) {
      try {
        const response = await fetch(`${Global.url}user/update`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            "Authorization": localStorage.getItem('token'),
          },
          body: JSON.stringify({ name: auth.name, nick: auth.nick, email: auth.email, password: newPassword }),
        });
        const data = await response.json();
        Swal.fire({
          title: 'Éxito',
          text: data.message,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true,
          customClass: {
            popup: "dark:bg-[#242424] w-[90%] md:w-1/2",
            title: "dark:text-[#D1D1D1]",
          },
        });
      } catch (error) {
        console.error('Error al actualizar la contraseña:', error);
        Swal.fire({
          title: 'Error',
          text: 'Error al actualizar la contraseña',
          icon: 'error',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
          customClass: {
            popup: "dark:bg-[#242424] w-[90%] md:w-1/2",
            title: "dark:text-[#D1D1D1]",
          },
        });
      }
    }
  };

  const updateUser = async ({ name, nick, email }) => {

    let data = { name, nick, email }
    const token = localStorage.getItem("token")

    const req = await fetch(Global.url + "user/update", {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      }
    })

    const res = await req.json()

    if (res.status == "success" && res.user) {
      delete res.user.password
      setAuth(res.user)
    }

    const fileInput = document.querySelector("#file0")

    if (res.status = "success" && fileInput.files[0]) {

      const formData = new FormData()
      formData.append("file0", fileInput.files[0])

      const reqUpload = await fetch(Global.url + "user/upload", {
        method: "POST",
        body: formData,
        headers: {
          "Authorization": token
        }
      })

      const resUpload = await reqUpload.json()

      if (resUpload.status == "success" && resUpload.user) {
        delete resUpload.user.password
        setAuth(resUpload.user)
      }

    }

  }


  const menuItems = [
    { id: 'account', label: 'Cuenta', show: true },
    { id: 'notifications', label: 'Notificaciones', show: true },
    { id: 'password', label: 'Contraseña', show: true },
    { id: 'moderation', label: 'Moderación', show: isModerator },
    { id: 'admin', label: 'Administración', show: isAdmin }
  ];

  // Función para manejar el baneo de usuarios
  const handleBanUser = async (userId, duration, reason) => {
    try {
      const response = await fetch(`${Global.url}user/ban/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify({ duration, reason })
      });
      const data = await response.json();
      if (data.status === 'success') {
        Swal.fire({
          title: 'Usuario baneado',
          text: 'El usuario ha sido baneado exitosamente',
          icon: 'success',
          customClass: {
            popup: "dark:bg-[#242424]",
            title: "dark:text-[#D1D1D1]"
          }
        });
      }
    } catch (error) {
      console.error('Error al banear usuario:', error);
    }
  };

  // Función para promover a moderador
  const handlePromoteToModerator = async (userId) => {
    try {
      const response = await fetch(`${Global.url}user/promote/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        }
      });
      const data = await response.json();
      if (data.status === 'success') {
        Swal.fire({
          title: 'Moderador añadido',
          text: 'El usuario ha sido promovido a moderador',
          icon: 'success',
          customClass: {
            popup: "dark:bg-[#242424]",
            title: "dark:text-[#D1D1D1]"
          }
        });
      }
    } catch (error) {
      console.error('Error al promover usuario:', error);
    }
  };

  // Función para cargar usuarios
  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${Global.url}user/list/${page}`, {
        method: 'GET',
        headers: {
          'Authorization': localStorage.getItem('token')
        }
      });
      const data = await response.json();

      if (data.status === 'success') {
        setUsers(data.users);
        setTotalPages(Math.ceil(data.total / data.itemsPerPage));
      }
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  // Función para cargar moderadores
  const loadModerators = async () => {
    try {
      const response = await fetch(`${Global.url}user/moderators`, {
        method: 'GET',
        headers: {
          'Authorization': localStorage.getItem('token')
        }
      });
      const data = await response.json();

      if (data.status === 'success') {
        setModerators(data.moderators);
      }
    } catch (error) {
      console.error('Error al cargar moderadores:', error);
    }
  };

  // Cargar usuarios y moderadores cuando el componente se monta
  useEffect(() => {
    if (isModerator) {
      loadUsers();
      loadModerators();
    }
  }, [page, isModerator]);


  const renderContent = () => {
    switch (activeSection) {
      case 'moderation':
        return (
          <div className="bg-white dark:bg-[#242424] rounded-lg shadow-sm border border-slate-200 dark:border-[#3a3a3a]">
            <div className="border-b border-slate-200 dark:border-[#3a3a3a] px-6 py-4">
              <h2 className="text-lg font-medium dark:text-white">Panel de Moderación</h2>
            </div>
            <div className="p-6">
              {/* Table Header */}
              <div className="w-full overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b dark:border-[#3a3a3a]">
                      <th className="text-left py-3 px-4 text-sm font-medium dark:text-gray-300">#ID</th>
                      <th className="text-left py-3 px-4 text-sm font-medium dark:text-gray-300">Usuario</th>
                      <th className="text-left py-3 px-4 text-sm font-medium dark:text-gray-300">Rol</th>
                      <th className="text-left py-3 px-4 text-sm font-medium dark:text-gray-300">Creado</th>
                      <th className="text-right py-3 px-4 text-sm font-medium dark:text-gray-300">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="5" className="text-center py-4 dark:text-gray-300">
                          Cargando usuarios...
                        </td>
                      </tr>
                    ) : (
                      users.map((user, index) => (
                        <tr key={user._id} className="border-b dark:border-[#3a3a3a]">
                          <td className="py-3 px-4">
                            <span className="text-sm text-gray-600 dark:text-gray-400">#{user._id}</span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={user.image}
                                alt={user.name}
                                className="w-8 h-8 rounded-full"
                              />
                              <div>
                                <div className="font-medium dark:text-white">{user.name}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                              ${user.role === 'role_admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400' :
                                user.role === 'role_moderator' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                                  'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'}`}>
                              {user.role === 'role_admin' ? 'Admin' :
                                user.role === 'role_moderator' ? 'Moderador' : 'Usuario'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {new Date(user.created_at).toLocaleDateString()}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="relative inline-block text-left">
                              <button
                                onClick={() => {
                                  const dropdown = document.getElementById(`dropdown-${user._id}`);
                                  dropdown.classList.toggle('hidden');
                                }}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                              >
                                <svg className="w-5 h-5 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                </svg>
                              </button>
                              <div
                                id={`dropdown-${user._id}`}
                                className="hidden absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-[#2a2a2a] ring-1 ring-black ring-opacity-5 z-10"
                              >
                                <div className="py-1">
                                  {!user.isBanned ? (
                                    <button
                                      onClick={() => handleBanUser(user._id, '24h', 'Violación de normas')}
                                      className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                                    >
                                      Banear usuario
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => handleUnbanUser(user._id)}
                                      className="w-full text-left px-4 py-2 text-sm text-green-600 dark:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                                    >
                                      Desbanear usuario
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleRemoveAvatar(user._id)}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                  >
                                    Eliminar usuario
                                  </button>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex justify-center gap-2 mt-6">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded-md disabled:opacity-50"
                >
                  Anterior
                </button>
                <span className="px-3 py-1 text-sm dark:text-gray-300">
                  Página {page} de {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded-md disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        );

      case 'admin':
        return (
          <div className="bg-white dark:bg-[#242424] rounded-lg shadow-sm border border-slate-200 dark:border-[#3a3a3a]">
            <div className="border-b border-slate-200 dark:border-[#3a3a3a] px-6 py-4">
              <h2 className="text-lg font-medium dark:text-white">Panel de Administración</h2>
            </div>
            <div className="p-6 space-y-6">
              {/* Gestión de Moderadores */}
              <div>
                <h3 className="text-sm font-medium mb-4 dark:text-gray-300">Moderadores</h3>
                <div className="space-y-4">
                  {moderators.map(mod => (
                    <div key={mod._id} className="flex items-center justify-between p-4 border dark:border-[#3a3a3a] rounded-lg">
                      <div>
                        <span className="font-medium dark:text-white">{mod.name}</span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{mod.email}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveModerator(mod._id)}
                        className="px-3 py-1.5 text-sm text-white bg-red-600 hover:bg-red-700 rounded-md"
                      >
                        Remover Moderador
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Añadir Moderador */}
              <div>
                <h3 className="text-sm font-medium mb-4 dark:text-gray-300">Añadir Moderador</h3>
                <div className="flex gap-4">
                  <select
                    className="flex-1 rounded-md border dark:bg-[#2a2a2a] dark:border-[#3a3a3a] p-2"
                  >
                    {users.filter(user => !moderators.find(mod => mod._id === user._id))
                      .map(user => (
                        <option key={user._id} value={user._id}>
                          {user.name} ({user._id})
                        </option>
                      ))}
                  </select>
                  <button
                    onClick={() =>
                      handlePromoteToModerator(document.querySelector('select').value)}
                    className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                  >
                    Promover a Moderador
                  </button>
                </div>
              </div>

              {/* Estadísticas */}
              <div>
                <h3 className="text-sm font-medium mb-4 dark:text-gray-300">Estadísticas</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border dark:border-[#3a3a3a] rounded-lg">
                    <div className="text-2xl font-bold dark:text-white">150</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Usuarios Totales</div>
                  </div>
                  <div className="p-4 border dark:border-[#3a3a3a] rounded-lg">
                    <div className="text-2xl font-bold dark:text-white">5</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Moderadores</div>
                  </div>
                  <div className="p-4 border dark:border-[#3a3a3a] rounded-lg">
                    <div className="text-2xl font-bold dark:text-white">10</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Usuarios Baneados</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'password':
        return (
          <div className=" bg-white dark:bg-[#242424] rounded-lg shadow-sm border border-slate-200 dark:border-[#3a3a3a] lg:min-w-[530.7px]">
            <div className="border-b border-slate-200 dark:border-[#3a3a3a] px-6 py-4">
              <h2 className="text-lg font-medium dark:text-white">Cambiar contraseña</h2>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <button
                  onClick={sendSecurityCode}
                  className="px-4 py-2 dark:bg-danube-500 dark:hover:bg-danube-600 bg-big-stone-600 hover:bg-big-stone-700 text-white rounded-md"
                >
                  Enviar código de seguridad
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-white dark:bg-[#242424] rounded-lg shadow-sm border border-slate-200 dark:border-[#3a3a3a]">
            <div className="border-b border-slate-200 dark:border-[#3a3a3a] px-6 py-4">
              <h2 className="text-lg font-medium dark:text-white">Cuenta</h2>
            </div>

            <div className="p-6">
              <Formik
                initialValues={{
                  name: auth.name || '',
                  nick: auth.nick || '',
                  email: auth.email || '',
                  file0: undefined
                }}
                onSubmit={updateUser}
              >
                {({ values, handleChange, setFieldValue }) => (
                  <Form className="space-y-6">
                    {/* Sección de Avatar */}
                    <div>
                      <h3 className="text-sm font-medium mb-4 dark:text-gray-300">Avatar</h3>
                      <div className="flex items-start space-x-4">
                        <img
                          src={selectedImage ? URL.createObjectURL(selectedImage) : auth.image}
                          alt="Perfil"
                          className="w-16 h-16 rounded-full"
                        />
                        <div>
                          <div className="flex space-x-3">
                            <button
                              type="button"
                              onClick={() => document.getElementById('file0').click()}
                              className="px-3 py-1.5 text-sm dark:bg-danube-500 dark:hover:bg-danube-600 bg-big-stone-600 hover:bg-big-stone-700 text-white rounded-md"
                            >
                              Subir
                            </button>
                            <button
                              type="button"
                              className="px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-[#3a3a3a] rounded-md"
                            >
                              Eliminar
                            </button>
                            <input
                              type="file"
                              id="file0"
                              className="hidden"
                              onChange={(e) => {
                                setFieldValue('file0', e.currentTarget.files[0]);
                                setSelectedImage(e.currentTarget.files[0]);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Campos del formulario */}
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium dark:text-gray-300">Nombre de usuario</label>
                        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">Visible para otros miembros</div>
                        <Field
                          type="text"
                          name="nick"
                          value={values.nick}
                          onChange={handleChange}
                          className="mt-1 block w-full rounded-md border dark:bg-[#2a2a2a] dark:border-[#3a3a3a] bg-[#f7f7f7] border-slate-200 p-2"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium dark:text-gray-300">Nombre completo</label>
                        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">¿Cómo quieres que te llamemos?</div>
                        <Field
                          type="text"
                          name="name"
                          value={values.name}
                          onChange={handleChange}
                          className="mt-1 block w-full rounded-md border dark:bg-[#2a2a2a] dark:border-[#3a3a3a] bg-[#f7f7f7] border-slate-200 p-2"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium dark:text-gray-300">Correo electrónico</label>
                        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">Para notificaciones e inicio de sesión</div>
                        <Field
                          type="email"
                          name="email"
                          value={values.email}
                          onChange={handleChange}
                          className="mt-1 block w-full rounded-md border dark:bg-[#2a2a2a] dark:border-[#3a3a3a] bg-[#f7f7f7] border-slate-200 p-2"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium dark:text-gray-300">Tema</label>
                        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">Elige tu tema preferido</div>
                        <select
                          value={selectedTheme}
                          onChange={(e) => setSelectedTheme(e.target.value)}
                          className="mt-1 block w-full rounded-md border dark:bg-[#2a2a2a] dark:border-[#3a3a3a] bg-[#f7f7f7] border-slate-200 p-2"
                        >
                          <option value="light">Claro</option>
                          <option value="dark">Oscuro</option>
                          <option value="system">Sistema</option>
                        </select>
                      </div>
                    </div>

                    {/* Eliminar cuenta */}
                    <div className="pt-6 border-t dark:border-[#3a3a3a]">
                      <h3 className="text-sm font-medium text-red-600 dark:text-red-400">Eliminar cuenta</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Al eliminar tu cuenta perderás todos tus datos</p>
                      <button
                        type="button"
                        className="mt-4 px-4 py-2 text-sm text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        Eliminar cuenta...
                      </button>
                    </div>

                    {/* Botón guardar */}
                    <div className="flex justify-end pt-6">
                      <button
                        type="submit"
                        className="px-4 py-2 dark:bg-danube-500 dark:hover:bg-danube-600 bg-big-stone-600 hover:bg-big-stone-700 text-white rounded-md"
                      >
                        Guardar cambios
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-8 dark:text-white">Configuración</h1>

      <div className="flex gap-8">
        {/* Menú lateral */}
        <div className="w-48 flex-shrink-0">
          <nav className="space-y-1">
            {menuItems.filter(item => item.show).map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveSection(item.id);
                }}
                className={`block px-3 py-2 rounded-md text-sm font-medium ${activeSection === item.id
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                  : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Contenido principal */}
        <div className="flex-1">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Config