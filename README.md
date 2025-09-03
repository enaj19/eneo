Application de gestion de fichiers RDE

Bienvenue sur le dépôt de l'application de gestion de fichiers RDE (Répertoire de Documents d'Entreprise). Cette application web permet aux utilisateurs de se connecter via LDAP et de parcourir un répertoire de fichiers sur le serveur.

Fonctionnalités
Authentification LDAP : Les utilisateurs s'authentifient en utilisant leurs identifiants Active Directory ou LDAP.

Gestionnaire de fichiers : Navigation dans les dossiers, visualisation et téléchargement de fichiers.

Structure modulaire : L'application est divisée en un frontend (React/TypeScript) et un backend (Node.js/Express).

Configuration de l'environnement
Avant de démarrer le projet, vous devez configurer les variables d'environnement pour le backend.

Créez un fichier .env à la racine du dossier backend.

Ajoutez les variables suivantes en remplaçant les valeurs par les vôtres :

# Fichier .env pour le backend
PORT=5000
ALLOW_ORIGIN=http://localhost:5173
LDAP_URL=ldap://[Votre_adresse_IP]:389
SUPERADMIN_PASSWORD=votre_mot_de_passe_super_secret
ROOT_DIR=./dossier pour les tests en local

Note : Le SUPERADMIN_PASSWORD est pour des tests en local. Pensez à l'utiliser pour vous connecter avec l'identifiant superadmin et votre mot de passe pour contourner le LDAP si besoin(Pour les tests).

Installation et démarrage
Suivez ces étapes pour installer et lancer le frontend et le backend.

Backend
Ouvrez votre terminal et naviguez jusqu'au dossier backend :

- cd backend

Installez les dépendances du backend :

- npm install

Démarrez le serveur :

- npm run dev

Le serveur sera accessible à l'adresse http://localhost:5000.

Frontend
Ouvrez un deuxième terminal et naviguez jusqu'au dossier frontend :

- cd frontend

Installez les dépendances du frontend :

- npm install

Démarrez l'application :

- npm run dev

L'application sera accessible dans votre navigateur, généralement à l'adresse http://localhost:5173.

Utilisation
Ouvrez l'application dans votre navigateur.

Sur l'écran de connexion, entrez vos identifiants de connexion LDAP ou utilisez le superadmin de test.

Une fois connecté, vous pourrez parcourir le contenu du dossier spécifié par la variable ROOT_DIR dans votre fichier .env.

Cliquez sur le bouton action 'Télécharger' pour le télécharger un fichier, ou sur le bouton action 'Ouvrir' pour naviguer dans un dossier.

Pour les dossiers et les fichiers que vous avez ajoutés, vous verrez leurs noms, types, tailles et dates de modification.

