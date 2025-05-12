import React, { useState, useEffect } from 'react';

import { clientAxios } from '../../api/axios';

const DocumentPreview = ({ orderId }) => {
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchDocumentPreview = async () => {
            try {
                const response = await clientAxios.get(`/orders/${orderId}/document/preview`);
                
                setPreviewUrl(response.data.preview_url);
            } catch (err) {
                setError('Failed to load document preview');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        
        fetchDocumentPreview();
    }, [orderId]);
    
    if (loading) return <div className="loading-preview">Loading preview...</div>;
    if (error) return <div className="error-message">{error}</div>;
    
    return (
        <div className="document-preview">
            <h3>Document Preview</h3>
            <div className="preview-container">
                <iframe
                    src={previewUrl}
                    title="Document Preview"
                    width="100%"
                    height="500px"
                    frameBorder="0"
                />
            </div>
        </div>
    );
};

export default DocumentPreview;