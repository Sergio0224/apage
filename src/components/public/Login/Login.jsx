import React, { useState } from 'react';
import { Field, Form, Formik, ErrorMessage } from 'formik';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import useAuth from '../../../hooks/useAuth';
import { Global } from '../../../helpers/Global';
import Swal from 'sweetalert2';
import loginbg from "../../../assets/images/bg-login.jpg";

const Login = () => {
  const [showPwd, setShowPwd] = useState(false);
  const { setAuth } = useAuth();

  const sigin = async (data) => {
    const req = await fetch(Global.url + "user/login", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      }
    });

    const res = await req.json();

    if (res.status == "success") {
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      setAuth(res.user);

      Swal.fire({
        html: "<p class='font-bold dark:text-[#D1D1D1]'>Inicio de sesión exitoso</p>",
        icon: "success",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        toast: true,
        position: "bottom-right",
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        customClass: {
          timerProgressBar: "dark:bg-[#505050]",
          popup: "dark:bg-[#242424]",
          title: "dark:text-[#D1D1D1]",
        },
      });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }

    if (res.status == "error") {
      if (res.message == "No existe el usuario") {
        Swal.fire({
          title: "Usuario no encontrado",
          html: "<p class='dark:text-[#D1D1D1]'>El correo electrónico ingresado no se encuentra registrado en nuestro sistema. Por favor, revisa la información o crea una nueva cuenta.</p>",
          icon: "error",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          showCloseButton: true,
          customClass: {
            timerProgressBar: "dark:bg-[#505050]",
            popup: "dark:bg-[#242424]",
            title: "dark:text-[#D1D1D1]",
          },
        });
      } else if (res.message == "No te has identificado correctamente") {
        Swal.fire({
          title: "Contraseña incorrecta",
          html: "<p class='dark:text-[#D1D1D1]'>La contraseña ingresada es incorrecta. Por favor, verifica e intenta nuevamente.</p>",
          icon: "error",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          showCloseButton: true,
          customClass: {
            timerProgressBar: "dark:bg-[#505050]",
            popup: "dark:bg-[#242424]",
            title: "dark:text-[#D1D1D1]",
          },
        });
      }
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-vista-white-50 dark:bg-gray-900">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
        <div className="w-full md:w-1/2 mb-8 md:mb-0 hidden md:block">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden" style={{ height: '85vh' }}>
            <img src={loginbg} alt="login-pic" className="w-full h-full object-cover object-center" />
          </div>
        </div>

        <div className="w-full md:w-1/2 md:pl-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Iniciar sesión</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Ingrese su correo electrónico a continuación para iniciar sesión en su cuenta
          </p>
          <Formik
            initialValues={{ email: '', password: '' }}
            validate={values => {
              const errors = {};
              if (!values.email) {
                errors.email = 'Campo Requerido';
              } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
                errors.email = 'Email inválido';
              }
              if (!values.password) {
                errors.password = 'Campo Requerido';
              } else if (values.password.length < 8) {
                errors.password = 'La contraseña debe tener al menos 8 caracteres';
              }
              return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
              setTimeout(async () => {
                await sigin(values);
                setSubmitting(false);
              }, 400);
            }}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Correo Electrónico
                  </label>
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-big-stone-500 focus:border-big-stone-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    placeholder="example@mail.com"
                  />
                  <ErrorMessage name="email" component="div" className="mt-1 text-sm text-red-600 dark:text-red-400" />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Field
                      id="password"
                      name="password"
                      type={showPwd ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-big-stone-500 focus:border-big-stone-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                      placeholder="**********"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPwd(!showPwd)}
                    >
                      <FontAwesomeIcon icon={showPwd ? faEyeSlash : faEye} className="h-5 w-5 text-gray-400" />
                    </button>
                  </div>
                  <ErrorMessage name="password" component="div" className="mt-1 text-sm text-red-600 dark:text-red-400" />
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-big-stone-600 hover:bg-big-stone-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-big-stone-500 dark:bg-danube-500 dark:hover:bg-danube-600"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Cargando...
                      </>
                    ) : (
                      "Iniciar sesión"
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
          <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            ¿No tienes una cuenta?{" "}
            <NavLink to="/register" className="font-medium text-big-stone-600 hover:text-big-stone-700 dark:text-danube-400 dark:hover:text-danube-300">
              Regístrate aquí
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;