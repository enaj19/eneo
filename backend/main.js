require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 5000;
const ALLOW_ORIGIN = process.env.ALLOW_ORIGIN || "http://localhost:5173";
// Autoriser les requêtes venant du client React
// app.use(cors({ origin: "*" })); // Autorise toutes les origines (à sécuriser ensuite)
app.use(cors({ origin: ALLOW_ORIGIN }));
app.use(express.json());

// Répertoire racine à explorer (peut être paramétré dans .env)
const ROOT_DIR = path.resolve(
  process.env.ROOT_DIR || path.join(__dirname, "fichiers_test")
);

// Fonction pour déterminer le type de fichier en se basant sur son extension
const getFileType = (filename, isDirectory) => {
  if (isDirectory) {
    return "Dossier de fichiers";
  }
  const extension = path.extname(filename).toLowerCase();
  switch (extension) {
    case ".xlsx":
    case ".xls":
      return "Feuille de calcul Microsoft Excel";
    case ".docx":
    case ".doc":
      return "Document Microsoft Word";
    case ".pptx":
    case ".ppt":
      return "Présentation Microsoft PowerPoint";
    case ".pdf":
      return "Document PDF";
    case ".txt":
      return "Document texte";
    case ".jpg":
    case ".jpeg":
    case ".png":
    case ".gif":
      return "Image";
    case ".mp4":
    case ".mov":
      return "Vidéo";
    default:
      return "Fichier";
  }
};


const { ldapLogin } = require("./ldap"); 

/**
 * POST /api/login
 * Gère l'authentification des utilisateurs via LDAP
 * Reçoit { username, password } dans le corps de la requête
 */


// main.js -> dans app.post("/api/login", ...)

app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: "Nom d'utilisateur et mot de passe requis." });
    }

    try {
        const user = await ldapLogin(username, password);

        if (user) {
            // L'authentification a réussi
            console.log("Connexion réussie pour l'utilisateur:", user);
            return res.status(200).json({ success: true, user });
        } else {
            // L'authentification a échoué (identifiants invalides)
            console.log("Échec de l'authentification pour:", username);
            return res.status(401).json({ success: false, message: "Nom d'utilisateur ou mot de passe invalide." });
        }
    } catch (err) {
        // Cette partie va maintenant attraper les erreurs de configuration ou de connexion au serveur
        console.error("Erreur serveur lors de la tentative de connexion LDAP :", err.message);
        // On renvoie une erreur 500 car le problème vient du serveur (ex: URL manquante, serveur LDAP injoignable)
        return res.status(500).json({ success: false, message: "Erreur du service d'authentification. Contactez l'administrateur." });
    }
});
/**
 * GET /api/files
 * Liste les fichiers et dossiers d’un chemin donné
 * Exemple : /api/files?path=subfolder
 */
app.get("/api/files", (req, res) => {
  const relativePath = req.query.path || "";
  const targetPath = path.join(ROOT_DIR, relativePath);

  // Vérifier que le chemin demandé est bien dans ROOT_DIR (sécurité)
  if (!path.resolve(targetPath).startsWith(ROOT_DIR)) {
    return res.status(400).json({ error: "Chemin invalide" });
  }

  fs.readdir(targetPath, { withFileTypes: true }, async (err, entries) => {
    if (err) {
      console.error("Erreur lors de la lecture du dossier :", err);
      return res.status(500).json({ error: "Impossible de lire le dossier" });
    }

    // Pour chaque fichier, on récupère les infos (taille, date, type)
    const result = await Promise.all(
      entries.map(async (entry) => {
        const fullPath = path.join(targetPath, entry.name);
        const stats = await fs.promises.stat(fullPath);

        return {
          name: entry.name,
          isDirectory: entry.isDirectory(),
          path: path.join(relativePath, entry.name),
          type: getFileType(entry.name, entry.isDirectory()),
          size: entry.isDirectory() ? null : stats.size, // en octets
          modifiedAt: stats.mtime, // Date de dernière modification
        };
      })
    );

    res.json(result);
  });
});

/**
 * GET /api/download
 * Télécharge un fichier spécifique
 * Exemple : /api/download?path=subfolder/file.pdf
 */
app.get("/api/download", (req, res) => {
  const relativePath = req.query.path;
  if (!relativePath) {
    return res.status(400).json({ error: "Paramètre path requis" });
  }

  // Normaliser le chemin demandé
  const filePath = path.resolve(path.join(ROOT_DIR, relativePath));

  // Vérifier que le chemin est bien dans ROOT_DIR (sécurité)
  if (!filePath.startsWith(ROOT_DIR)) {
    return res.status(400).json({ error: "Chemin invalide" });
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      return res.status(404).json({ error: "Fichier introuvable" });
    }
    console.log("Downloading", filePath);
    res.download(filePath);
  });
});

// 🚀 Lancer le serveur
// app.listen(PORT, () => {
//   console.log(`Backend démarré sur http://localhost:${PORT}`);
// });
// 🚀 Lancer le serveur sur toutes les interfaces réseau
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend démarré sur http://localhost:${PORT}`);
  console.log(
    `Accessible sur le réseau via : http://<IP_DE_TA_MACHINE>:${PORT}`
  );
});
