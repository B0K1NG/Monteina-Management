import React from "react";
import { useLoading } from "../contexts/LoadingContext";

const LoadingOverlay: React.FC = () => {
    const { loading } = useLoading();

    if (!loading) return null;

    return (
        <div className="loading-overlay">
            <div className="spinner">
            </div>
            <p className="loading-text">Kraunama...</p>
        </div>
    );
};

export default LoadingOverlay;