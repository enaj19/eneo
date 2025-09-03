import { useState } from "react";
import axios from "axios";

// L'URL de votre API de backend, comme défini dans App.tsx
const API_URL = "http://localhost:5000/api";

type LoginProps = {
    onLoginSuccess: () => void;
};

const Login = ({ onLoginSuccess }: LoginProps) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    // 1. Nouvel état pour gérer la visibilité du mot de passe
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage("");

        try {
            // Appel à l'API de connexion de votre backend
            const response = await axios.post(`${API_URL}/login`, {
                username,
                password,
            });

            // L'API renvoie maintenant un objet { success: true, ... }
            if (response.data.success) {
                console.log("Authentification réussie !");
                // Appeler la fonction de succès passée par App.tsx
                onLoginSuccess();
            } else {
                setErrorMessage(response.data.message || "Nom d'utilisateur ou mot de passe incorrect.");
            }
        } catch (error) {
            console.error("Erreur de connexion :", error);
            // Si le backend ne répond pas
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    setErrorMessage(error.response.data.message || "Erreur de connexion. Veuillez réessayer.");
                } else {
                    setErrorMessage("Erreur réseau. Le serveur ne répond pas. Veuillez réessayer plus tard.");
                }
            } else {
                setErrorMessage("Une erreur inattendue est survenue.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <style>
                {`
                    body {
                        background-color: #f4f7f9;
                        font-family: Arial, sans-serif;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 85vh;
                        margin: 0;
                    }

                    .login-container {
                        background-color: white;
                        padding: 40px;
                        border-radius: 8px;
                        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                        width: 350px;
                        text-align: center;
                    }

                    h2 {
                        color: #000000ff;
                        margin-bottom: 20px;
                    }

                    .form-group {
                        margin-bottom: 20px;
                        text-align: left;
                    }

                    label {
                        display: block;
                        font-weight: bold;
                        margin-bottom: 5px;
                        color: #555;
                    }

                    input[type="text"],
                    input[type="password"],
                    .form-group-password input {
                        width: 100%;
                        padding: 10px;
                        border: 1px solid #ccc;
                        border-radius: 5px;
                        box-sizing: border-box;
                        transition: border-color 0.3s;
                    }

                    input:focus {
                        outline: none;
                        border-color: #3498db;
                    }

                    /* 4. Nouveau CSS pour la mise en page de l'icône */
                    .form-group-password {
                        position: relative;
                    }
                    .toggle-password-icon {
                        position: absolute;
                        right: 4px;
                        top: 70%;
                        transform: translateY(-50%);
                        cursor: pointer;
                        color: #555;
                    }
                    .toggle-password-icon svg {
                        width: 20px;
                        height: 20px;
                    }

                    .error-message {
                        color: #e74c3c;
                        margin-top: 15px;
                    }

                    .login-button {
                        width: 100%;
                        padding: 10px;
                        background-color: #000000ff;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        font-size: 16px;
                        cursor: pointer;
                        transition: background-color 0.3s;
                    }

                    .login-button:hover {
                        background-color: #307aab;
                    }
                    
                    .login-button:disabled {
                        background-color: #bdc3c7;
                        cursor: not-allowed;
                    }
                `}
            </style>
            <h2>Connexion</h2>
            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label htmlFor="username">Nom d'utilisateur</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group form-group-password">
                    <label htmlFor="password">Mot de passe</label>
                    <input
                        // 2. Le type est maintenant contrôlé par l'état showPassword
                        type={showPassword ? "text" : "password"}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {/* 3. L'icône de l'oeil avec sa fonction de basculement */}
                    <span
                        className="toggle-password-icon"
                        // Gérer le clic et le maintien
                        onMouseDown={() => setShowPassword(true)}
                        onMouseUp={() => setShowPassword(false)}
                        onMouseLeave={() => setShowPassword(false)}
                    >
                        {showPassword ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0112 5.5c2.946 0 5.673 1.144 7.788 3.193M3.98 8.223a7.7 7.7 0 00.901 1.76l.338.358M3.98 8.223L5.356 12m7.788-3.777a7.7 7.7 0 00-.901-1.76L12 5.5c-2.946 0-5.673 1.144-7.788 3.193M12 5.5V5.5m0 0a.44.44 0 01.44.44v.11a.44.44 0 01-.44.44v-.11M12 5.5V5.5m0 0a.44.44 0 01.44.44v.11a.44.44 0 01-.44.44v-.11" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 5.5L12 5.5" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.42 12.578a3.15 3.15 0 01-4.464 0" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c-4.97 0-9-3.358-9-7.5s4.03-7.5 9-7.5 9 3.358 9 7.5-4.03 7.5-9 7.5z" />
                            </svg>
                        )}
                    </span>
                </div>
                <button type="submit" className="login-button" disabled={loading}>
                    {loading ? "Connexion en cours..." : "Se connecter"}
                </button>
            </form>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
};

export default Login;
