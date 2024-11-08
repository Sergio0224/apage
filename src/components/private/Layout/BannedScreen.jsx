import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';

// Custom Alert components to replace shadcn/ui
const Alert = ({ variant, className, children }) => (
  <div className={`rounded-lg border p-4 ${variant === 'destructive' ? 'bg-red-100 border-red-500' : ''} ${className}`}>
    {children}
  </div>
);

const AlertTitle = ({ className, children }) => (
  <h2 className={`font-bold ${className}`}>{children}</h2>
);

const AlertDescription = ({ className, children }) => (
  <div className={`mt-2 ${className}`}>{children}</div>
);

const Button = ({ variant, className, onClick, children }) => (
  <button
    className={`px-4 py-2 rounded-lg ${variant === 'destructive' ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-gray-200'} ${className}`}
    onClick={onClick}
  >
    {children}
  </button>
);

const BannedScreen = ({ banReason, banExpiresAt }) => {
  const navigate = useNavigate();
  const { setAuth, setCounters } = useAuth();

  const handleLogout = () => {
    localStorage.clear();
    setAuth({});
    setCounters({});
    navigate("/login");
  };

  const formatExpirationDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-lg">
        <Alert variant="destructive" className="border-red-500 mb-6">
          <FontAwesomeIcon icon={faTriangleExclamation} className="h-6 w-6" />
          <AlertTitle className="text-2xl font-bold mb-4">Cuenta Suspendida</AlertTitle>
          <AlertDescription className="space-y-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Motivo de la suspensión:</h3>
              <p className="text-base">
                {banReason || "Violación de las normas de la comunidad"}
              </p>
            </div>

            {banExpiresAt && (
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">La suspensión termina:</h3>
                <p className="text-base">
                  {formatExpirationDate(banExpiresAt)}
                </p>
              </div>
            )}

            {!banExpiresAt && (
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-semibold text-red-700">Suspensión permanente</h3>
                <p className="text-sm mt-1">
                  Tu cuenta ha sido suspendida de forma permanente.
                </p>
              </div>
            )}

            <div className="bg-orange-50 p-4 rounded-lg mt-4">
              <p className="text-sm text-gray-700">
                Si crees que esto es un error, por favor contacta con el equipo de soporte
                proporcionando el ID de tu cuenta y una explicación detallada.
              </p>
            </div>
          </AlertDescription>
        </Alert>

        <Button
          variant="destructive"
          className="w-full flex items-center justify-center gap-2"
          onClick={handleLogout}
        >
          <FontAwesomeIcon icon={faRightFromBracket} className="h-5 w-5" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );
};

export default BannedScreen;