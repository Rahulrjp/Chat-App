import { ImageIcon, X } from "lucide-react";
import { useState } from "react";

const CropImage = ({ cropImageSrc, onClose, onSave }) => {
    const [cropZoom, setCropZoom] = useState(1);
    const [cropOffset, setCropOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    if (!cropImageSrc) return null;

    const handleCropMouseDown = (e) => {
        e.preventDefault();
        setIsDragging(true);
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        setDragStart({ x: clientX - cropOffset.x, y: clientY - cropOffset.y });
    };
    const handleCropMouseMove = (e) => {
        if (!isDragging) return;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        setCropOffset({ x: clientX - dragStart.x, y: clientY - dragStart.y });
    };
    const handleCropMouseUp = () => {
        setIsDragging(false);
    };

    const handleSaveCrop = () => {
        const image = new Image();
        image.src = cropImageSrc;
        image.onload = () => {
            const canvas = document.createElement("canvas");
            const size = 300;
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext("2d");
            const baseScale = Math.max(size / image.width, size / image.height);
            const finalScale = baseScale * cropZoom;
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, size, size);
            ctx.translate(size / 2 + cropOffset.x, size / 2 + cropOffset.y);
            ctx.scale(finalScale, finalScale);
            ctx.drawImage(image, -image.width / 2, -image.height / 2);
            onSave(canvas.toDataURL("image/jpeg", 0.9));
        };
    };

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-90 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 border border-transparent dark:border-slate-800">
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                    <h3 className="font-bold text-slate-800 dark:text-white">Crop Profile Picture</h3>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 p-1.5 rounded-full transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>
                <div className="p-6 flex flex-col items-center">
                    <div
                        style={{ width: 300, height: 300 }}
                        className="bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden relative cursor-move shadow-inner border border-slate-200 dark:border-slate-700 touch-none mx-auto"
                        onMouseDown={handleCropMouseDown}
                        onMouseMove={handleCropMouseMove}
                        onMouseUp={handleCropMouseUp}
                        onMouseLeave={handleCropMouseUp}
                        onTouchStart={handleCropMouseDown}
                        onTouchMove={handleCropMouseMove}
                        onTouchEnd={handleCropMouseUp}>
                        <div className="absolute inset-0 z-10 pointer-events-none shadow-[0_0_0_999px_rgba(0,0,0,0.5)] m-0 border-2 border-white/50"></div>
                        <img
                            src={cropImageSrc}
                            alt="Crop preview"
                            className="absolute max-w-none pointer-events-none"
                            style={{
                                top: "50%",
                                left: "50%",
                                transform: `translate(calc(-50% + ${cropOffset.x}px), calc(-50% + ${cropOffset.y}px)) scale(${cropZoom})`,
                                minWidth: "100%",
                                minHeight: "100%",
                                width: "auto",
                                height: "auto",
                            }}
                        />
                    </div>
                    <div className="w-full mt-6 flex items-center gap-3">
                        <span className="text-xs font-medium text-slate-500">
                            <ImageIcon className="w-4 h-4" />
                        </span>
                        <input
                            type="range"
                            min="1"
                            max="3"
                            step="0.05"
                            value={cropZoom}
                            onChange={(e) => setCropZoom(parseFloat(e.target.value))}
                            className="flex-1 accent-indigo-600"
                        />
                        <span className="text-xs font-medium text-slate-500">
                            <ImageIcon className="w-5 h-5" />
                        </span>
                    </div>
                    <div className="w-full flex gap-3 mt-6">
                        <button
                            onClick={onClose}
                            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                            Cancel
                        </button>
                        <button
                            onClick={handleSaveCrop}
                            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-md">
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CropImage;
