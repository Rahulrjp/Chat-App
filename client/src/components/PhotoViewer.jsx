import { RotateCcw, X, ZoomIn, ZoomOut } from "lucide-react";
import { useState } from "react";

const PhotoViewer = ({ photoUrl, onClose }) => {
    const [imageScale, setImageScale] = useState(1);
    if (!photoUrl) return null;

    return (
        <div className="fixed inset-0 bg-black/95 z-100 flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200 overflow-hidden">
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2 sm:gap-3 z-20 bg-black/40 p-1.5 sm:p-2 rounded-full backdrop-blur-md">
                <button
                    onClick={() => setImageScale((prev) => Math.min(prev + 0.5, 4))}
                    className="p-2 hover:bg-white/20 text-white rounded-full transition-colors"
                    title="Zoom In">
                    <ZoomIn className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <button
                    onClick={() => setImageScale((prev) => Math.max(prev - 0.5, 0.5))}
                    className="p-2 hover:bg-white/20 text-white rounded-full transition-colors"
                    title="Zoom Out">
                    <ZoomOut className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <button
                    onClick={() => setImageScale(1)}
                    className="p-2 hover:bg-white/20 text-white rounded-full transition-colors"
                    title="Reset Zoom">
                    <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <div className="w-px h-6 bg-white/30 mx-1"></div>
                <button onClick={onClose} className="p-2 hover:bg-red-500/80 text-white rounded-full transition-colors" title="Close">
                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
            </div>
            <div
                className="w-full h-full flex items-center justify-center overflow-auto"
                onWheel={(e) => {
                    if (e.deltaY < 0) setImageScale((prev) => Math.min(prev + 0.15, 4));
                    else setImageScale((prev) => Math.max(prev - 0.15, 0.5));
                }}>
                <img
                    src={photoUrl}
                    alt="Fullscreen Photo"
                    style={{
                        transform: `scale(${imageScale})`,
                        transition: imageScale === 1 ? "transform 0.3s ease-out" : "transform 0.1s ease-out",
                    }}
                    className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl origin-center"
                />
            </div>
        </div>
    );
};

export default PhotoViewer;
