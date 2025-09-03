const { Client } = require('ldapjs');

/**
 * Gère la connexion et l'authentification d'un utilisateur sur le serveur LDAP.
 *
 * @param {string} userId 
 * @param {string} password 
 * @returns {Promise<boolean>} 
 */
const ldapLogin = async (userId, password) => {
    const LDAP_URL = process.env.LDAP_URL || ''; 
    const BASE_DN = process.env.BASE_DN || ''; 
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
