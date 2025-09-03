const { Client } = require('ldapjs');

/**
 * Gère la connexion et l'authentification d'un utilisateur sur le serveur LDAP.
 *
 * @param {string} userId - L'identifiant de l'utilisateur.
 * @param {string} password - Le mot de passe de l'utilisateur.
 * @returns {Promise<boolean>} Renvoie `true` si l'authentification est réussie, sinon lève une exception.
 */
const ldapLogin = async (userId, password) => {
    // Définition de variables de secours pour éviter l'erreur "undefined".
    // REMPLACEZ 'ldap://192.168.1.10:389' par votre URL de serveur LDAP réelle.
    const LDAP_URL = process.env.LDAP_URL || 'ldap://10.250.90.8:389';
    const BASE_DN = process.env.BASE_DN || 'dc=camlight,dc=cm';
    const SUPERADMIN_PASSWORD = process.env.SUPERADMIN_PASSWORD || 'motdepasse-super-secret';

    // --- LOGIQUE DE TEST SUPERADMIN (À ENLEVER EN PRODUCTION) ---
    if (userId === 'superadmin' && password === SUPERADMIN_PASSWORD) {
        console.log('Authentification Superadmin réussie !');
        return true;
    }

    console.log(`Tentative de connexion à l'URL : ${LDAP_URL}`);
    const client = new Client({
        url: LDAP_URL
    });

    try {
        console.log(`Tentative de connexion pour l'utilisateur : ${userId}`);
        await client.bind(`${userId}@camlight.cm`, password);
        console.log(`Authentification LDAP réussie pour l'utilisateur : ${userId}`);
        return true;
    } catch (error) {
        console.error(`Erreur LDAP : Échec de la connexion pour ${userId}@camlight.cm`, error.message);
        throw new Error('Invalid Credentials');
    } finally {
        try {
            await client.unbind();
        } catch (unbindError) {
            console.error(`Échec de la déconnexion du client LDAP : ${unbindError.message}`);
        }
    }
};

module.exports = { ldapLogin };
