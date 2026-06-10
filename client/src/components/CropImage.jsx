import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { ImageIcon, X } from "lucide-react";

const CropImage = ({ cropImageSrc, onClose, onSave }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [isApplying, setIsApplying] = useState(false);

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    if (!cropImageSrc) return null;

    const createImage = (url) =>
        new Promise((resolve, reject) => {
            const image = new Image();
            image.addEventListener("load", () => resolve(image));
            image.addEventListener("error", (error) => reject(error));
            image.src = url;
        });

    const handleSaveCrop = async () => {
        try {
            if (!croppedAreaPixels) return;
            setIsApplying(true);
            const image = await createImage(cropImageSrc);
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            // Crop size
            canvas.width = croppedAreaPixels.width;
            canvas.height = croppedAreaPixels.height;

            ctx.drawImage(
                image,
                croppedAreaPixels.x,
                croppedAreaPixels.y,
                croppedAreaPixels.width,
                croppedAreaPixels.height,
                0,
                0,
                croppedAreaPixels.width,
                croppedAreaPixels.height
            );

            const base64 = canvas.toDataURL("image/jpeg", 0.9);
            await onSave(base64);
        } catch (e) {
            console.error("Error cropping image:", e);
        } finally {
            setIsApplying(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-90 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 border border-transparent dark:border-slate-800">
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                    <h3 className="font-bold text-slate-800 dark:text-white">Crop Profile Picture</h3>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 p-1.5 rounded-full transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>
                <div className="p-6 flex flex-col">
                    <div className="relative w-full h-80 bg-slate-950 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                        <Cropper
                            image={cropImageSrc}
                            crop={crop}
                            zoom={zoom}
                            aspect={1}
                            cropShape="round"
                            showGrid={false}
                            onCropChange={setCrop}
                            onCropComplete={onCropComplete}
                            onZoomChange={setZoom}
                        />
                    </div>
                    <div className="w-full mt-6 flex items-center gap-3">
                        <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                            <ImageIcon className="w-4 h-4" />
                        </span>
                        <input
                            type="range"
                            min="1"
                            max="3"
                            step="0.05"
                            value={zoom}
                            onChange={(e) => setZoom(parseFloat(e.target.value))}
                            className="flex-1 accent-indigo-600 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                            <ImageIcon className="w-5 h-5" />
                        </span>
                    </div>
                    <div className="w-full flex gap-3 mt-6">
                        <button
                            onClick={onClose}
                            disabled={isApplying}
                            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                            Cancel
                        </button>
                        <button
                            onClick={handleSaveCrop}
                            disabled={isApplying}
                            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2">
                            {isApplying ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Applying...
                                </>
                            ) : (
                                "Apply Crop"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CropImage;
