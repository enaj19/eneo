import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import "./App.css";
import "fontawesome-free/css/all.min.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

type FileItem = {
    name: string;
    isDirectory: boolean;
    path: string;
    type: string;
    size: number | null;
    modifiedAt: string;
};

function App() {
    const [currentPath, setCurrentPath] = useState("");
    const [files, setFiles] = useState<FileItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState<"table" | "cards">("table");
    const [sortColumn, setSortColumn] = useState<"name" | "size" | "modifiedAt" | "type">("name");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchFiles = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${API_URL}/files`, {
                    params: { path: currentPath },
                });
                setFiles(res.data);
            } catch (err) {
                console.error("Erreur API:", err);
                setFiles([]);
            } finally {
                setLoading(false);
            }
        };
        fetchFiles();
    }, [currentPath]);

    const handleDoubleClick = (file: FileItem) => {
        if (file.isDirectory) {
            setCurrentPath(currentPath ? `${currentPath}/${file.name}` : file.name);
        } else {
            const downloadUrl = `${API_URL}/download?path=${encodeURIComponent(
                currentPath ? `${currentPath}/${file.name}` : file.name
            )}`;
            window.location.href = downloadUrl;
        }
    };

    const getIcon = (file: FileItem) => {
        if (file.isDirectory) return "fas fa-folder";
        const ext = file.name.split(".").pop()?.toLowerCase();
        switch (ext) {
            case "xlsx":
            case "xls":
                return "fas fa-file-excel";
            case "docx":
            case "doc":
                return "fas fa-file-word";
            case "pptx":
            case "ppt":
                return "fas fa-file-powerpoint";
            case "pdf":
                return "fas fa-file-pdf";
            case "jpg":
            case "jpeg":
            case "png":
                return "fas fa-file-image";
            case "zip":
            case "rar":
                return "fas fa-file-archive";
            default:
                return "fas fa-file";
        }
    };

    const formatSize = (size: number | null) => {
        if (size === null) return "-";
        if (size < 1024) return `${size} o`;
        if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} Ko`;
        if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} Mo`;
        return `${(size / (1024 * 1024 * 1024)).toFixed(1)} Go`;
    };

    const sortedFilteredFiles = useMemo(() => {
        let filtered = files.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));
        filtered.sort((a, b) => {
            let aValue: any = a[sortColumn];
            let bValue: any = b[sortColumn];
            if (sortColumn === "name" || sortColumn === "type") {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            } else if (sortColumn === "modifiedAt") {
                aValue = new Date(aValue).getTime();
                bValue = new Date(bValue).getTime();
            } else if (sortColumn === "size") {
                aValue = aValue || 0;
                bValue = bValue || 0;
            }
            if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
            if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
            return 0;
        });
        return filtered;
    }, [files, sortColumn, sortDirection, search]);

    const toggleSort = (column: "name" | "size" | "modifiedAt" | "type") => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(column);
            setSortDirection("asc");
        }
    };

    const renderBreadcrumb = () => {
        const parts = currentPath.split("/").filter(Boolean);
        return (
            <div className="breadcrumb">
                <span onClick={() => setCurrentPath("")}>Dossiers</span>
                {parts.map((part, i) => {
                    const pathUpTo = parts.slice(0, i + 1).join("/");
                    return (
                        <span key={pathUpTo} onClick={() => setCurrentPath(pathUpTo)}>
                            {" / " + part}
                        </span>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="container">
            <a href="?path=">
                <img src="logo.png" alt="Logo Eneo" style={{ height: "50px" }} />
            </a>
            <h1>📂 Ressources Documentaires ENEO</h1>
            {renderBreadcrumb()}

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                <div style={{ display: "flex", gap: "10px" }}>
                    <button onClick={() => setView("table")} className={`${view === "table" ? "active-view" : ""}`}>
                        <i className="fas fa-table"></i> <span className="md">Vue Tableau</span> 
                    </button>
                    <button onClick={() => setView("cards")} className={`${view === "cards" ? "active-view" : ""}`}>
                        <i className="fas fa-th-large"></i> <span className="md">Vue Cartes</span>
                    </button>
                </div>
                <input
                    type="text"
                    placeholder="Rechercher..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ padding: "6px 10px", borderRadius: "6px", border: "1px solid #ccc" }}
                />
            </div>

            {loading ? (
                <p>Chargement...</p>
            ) : view === "table" ? (
                <table>
                    <thead>
                        <tr>
                            <th onClick={() => toggleSort("name")}>
                                Nom {sortColumn === "name" ? (sortDirection === "asc" ? "▲" : "▼") : ""}
                            </th>
                            <th onClick={() => toggleSort("type")}>
                                Type {sortColumn === "type" ? (sortDirection === "asc" ? "▲" : "▼") : ""}
                            </th>
                            <th onClick={() => toggleSort("size")}>
                                Taille {sortColumn === "size" ? (sortDirection === "asc" ? "▲" : "▼") : ""}
                            </th>
                            <th onClick={() => toggleSort("modifiedAt")}>
                                Modifié le {sortColumn === "modifiedAt" ? (sortDirection === "asc" ? "▲" : "▼") : ""}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedFilteredFiles.map((f, i) => (
                            <tr key={i} onDoubleClick={() => handleDoubleClick(f)}>
                                <td>
                                    <i className={`${getIcon(f)} file-icon`}></i> {f.name}
                                </td>
                                <td>{f.type}</td>
                                <td>{formatSize(f.size)}</td>
                                <td>{new Date(f.modifiedAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="cards-container">
                    {sortedFilteredFiles.map((f, i) => (
                        <div key={i} className="file-card" onDoubleClick={() => handleDoubleClick(f)}>
                            <i className={`${getIcon(f)} file-icon`}></i>
                            <div className="file-info">
                                <div className="file-name">{f.name}</div>
                                <div className="file-type">{f.type}</div>
                                <div className="file-meta">
                                    <span>{formatSize(f.size)}</span> •{" "}
                                    <span>{new Date(f.modifiedAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default App;
