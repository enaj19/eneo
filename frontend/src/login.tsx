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
                        height: 100vh;
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
                        color: #2c3e50;
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
                    input[type="password"] {
                        width: 100%;
                        padding: 10px;
                        border: 1px solid #ccc;
                        border-radius: 5px;
                        box-sizing: border-box;
                        transition: border-color 0.3s;
                    }

                    input[type="text"]:focus,
                    input[type="password"]:focus {
                        outline: none;
                        border-color: #3498db;
                    }

                    .error-message {
                        color: #e74c3c;
                        margin-top: 15px;
                    }

                    .login-button {
                        width: 100%;
                        padding: 12px;
                        background-color: #3498db;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        font-size: 16px;
                        cursor: pointer;
                        transition: background-color 0.3s;
                    }

                    .login-button:hover {
                        background-color: #2980b9;
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
                <div className="form-group">
                    <label htmlFor="password">Mot de passe</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
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
