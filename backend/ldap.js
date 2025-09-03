// ldap.js

const { Client } = require('ldapts'); // CORRECTION ICI: 'ldapts' au lieu de 'ldap-ts'

/**
 * Gère la connexion et l'authentification d'un utilisateur sur le serveur LDAP en utilisant ldapts.
 *
 * @param {string} userId - L'identifiant de l'utilisateur.
 * @param {string} password - Le mot de passe de l'utilisateur.
 * @returns {Promise<Object|null>} Renvoie un objet utilisateur si l'authentification est réussie, sinon null.
 */
const ldapLogin = async (userId, password) => {
    // --- 1. Validation de la configuration (on garde cette bonne pratique) ---
    const LDAP_URL = process.env.LDAP_URL;
    if (!LDAP_URL) {
        console.error("ERREUR FATALE : La variable d'environnement LDAP_URL n'est pas définie !");
        throw new Error("La configuration du serveur LDAP est manquante.");
    }
    
    const SUPERADMIN_PASSWORD = process.env.SUPERADMIN_PASSWORD;
    if (userId === 'superadmin' && password && password === SUPERADMIN_PASSWORD) {
        console.log('Authentification Superadmin locale réussie !');
        return { username: 'superadmin', dn: 'local/superadmin' };
    }

    // --- 2. Création du client LDAP ---
    const client = new Client({
        url: LDAP_URL,
        timeout: 5000,
        connectTimeout: 5000,
    });

    try {
        const userDN = `${userId}`;
        console.log(`Tentative de bind avec le DN : ${userDN}`);

        // --- 3. Connexion et authentification (bind) ---
        await client.bind(userDN, password);

        console.log(`Authentification LDAP réussie pour : ${userDN}`);
        
        return {
            username: userId,
            dn: userDN,
        };

        } catch (error) {
        // --- 4. Gestion des erreurs ---
        // Gérer les erreurs de façon plus fine pour un meilleur diagnostic
        if (error.code === 'LDAP_INVALID_CREDENTIALS_ERROR') {
            console.log(`Échec de l'authentification (identifiants invalides) pour : ${userId}`);
            return null; // Retourne null pour indiquer un échec d'authentification
        }
        
        // Gérer les erreurs plus génériques
        console.error(`Une erreur technique LDAP est survenue pour ${userId}:`, error.message);
        throw new Error("Erreur du service d'authentification.");

        } finally {
            // --- 5. Déconnexion ---
            // S'assurer que le client est déconnecté même en cas d'erreur
            await client.unbind();
            console.log("Client LDAP déconnecté.");
        }
};

module.exports = { ldapLogin };