import { Calendar, Camera, Check, Edit2, Mail, MapPin, Phone, X, User, Trash2 } from "lucide-react";
import { useRef, useState } from "react";

const CurrentUserProfile = ({ show, onClose, currentUser, onSaveAbout, onSetCropImageSrc, onViewAvatar, onDeleteAvatar }) => {
    const [isEditingAbout, setIsEditingAbout] = useState(false);
    const [aboutInput, setAboutInput] = useState(currentUser?.about);
    const [isDeleting, setIsDeleting] = useState(false);
    const fileInputRef = useRef(null);

    if (!show) return null;

    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onSetCropImageSrc(reader.result);
            };
            reader.readAsDataURL(file);
        }
        if (e.target) e.target.value = null;
    };

    return (
        <div className="fixed inset-0 bg-slate-900/40 dark:bg-slate-900/80 backdrop-blur-sm z-70 flex items-center justify-center p-4 transition-all">
            <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col border border-transparent dark:border-slate-800">
                <div className="h-32 bg-linear-to-r from-indigo-500 to-purple-600 relative shrink-0">
                    <button onClick={onClose} className="absolute top-4 right-4 text-white hover:bg-white/20 p-1.5 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto pb-6">
                    <div className="relative mt-16 flex justify-center">
                        <div className="relative cursor-pointer group">
                            {currentUser?.avatar?.url ? (
                                <>
                                    <img
                                        src={currentUser.avatar.url}
                                        alt={currentUser?.name}
                                        onClick={() => onViewAvatar(currentUser.avatar.url)}
                                        className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-900 object-cover bg-white dark:bg-slate-800 shadow-md group-hover:opacity-90 transition-opacity"
                                    />
                                    <button
                                        onClick={async (e) => {
                                            e.stopPropagation();
                                            try {
                                                setIsDeleting(true);
                                                await onDeleteAvatar();
                                            } catch (err) {
                                                console.error("Deletion error:", err);
                                            } finally {
                                                setIsDeleting(false);
                                            }
                                        }}
                                        disabled={isDeleting}
                                        className="absolute bottom-1 left-1 bg-red-600 p-2 rounded-full text-white hover:bg-red-700 border-2 border-white dark:border-slate-900 shadow-sm transition-colors cursor-pointer z-10 disabled:opacity-50 flex items-center justify-center min-w-8 min-h-8"
                                        title="Delete Avatar">
                                        {isDeleting ? (
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <Trash2 className="w-4 h-4" />
                                        )}
                                    </button>
                                </>
                            ) : (
                                <div className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 shadow-md">
                                    <User className="w-16 h-16" />
                                </div>
                            )}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    fileInputRef.current?.click();
                                }}
                                className="absolute bottom-1 right-1 bg-indigo-600 p-2 rounded-full text-white hover:bg-indigo-700 border-2 border-white dark:border-slate-900 shadow-sm transition-colors cursor-pointer z-10">
                                <Camera className="w-4 h-4" />
                            </button>
                            <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden" />
                        </div>
                    </div>
                    <div className="px-6 pt-4 text-center">
                        <h2 className="text-2xl font-bold">{currentUser?.name}</h2>
                        <p className="text-green-500 font-medium text-sm mt-1 mb-6 flex items-center justify-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            {currentUser?.status}
                        </p>
                        <div className="space-y-4 text-left">
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">About</label>
                                    {!isEditingAbout && (
                                        <button
                                            onClick={() => setIsEditingAbout(true)}
                                            className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                                {isEditingAbout ? (
                                    <div className="space-y-2">
                                        <textarea
                                            value={aboutInput}
                                            onChange={(e) => setAboutInput(e.target.value)}
                                            className="w-full text-sm p-2 border border-indigo-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none resize-none bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200"
                                            rows="3"
                                            autoFocus
                                        />
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => {
                                                    setIsEditingAbout(false);
                                                    setAboutInput(currentUser?.about);
                                                }}
                                                className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                                                Cancel
                                            </button>
                                            <button
                                                onClick={() => {
                                                    onSaveAbout(aboutInput);
                                                    setIsEditingAbout(false);
                                                }}
                                                className="text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                                                <Check className="w-3 h-3" /> Save
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{currentUser?.about}</p>
                                )}
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 space-y-4">
                                <div>
                                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                                        <Mail className="w-3.5 h-3.5" /> Email Address
                                    </label>
                                    <p className="text-sm text-slate-700 dark:text-slate-300">{currentUser?.email}</p>
                                </div>
                                <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                                        <Phone className="w-3.5 h-3.5" /> Phone Number
                                    </label>
                                    <p className="text-sm text-slate-700 dark:text-slate-300">{currentUser?.phoneNumber}</p>
                                </div>
                                <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex gap-6">
                                    <div className="flex-1">
                                        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                                            <MapPin className="w-3.5 h-3.5" /> Location
                                        </label>
                                        <p className="text-sm text-slate-700 dark:text-slate-300">{currentUser?.location}</p>
                                    </div>
                                    <div className="flex-1">
                                        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                                            <Calendar className="w-3.5 h-3.5" /> Joined
                                        </label>
                                        <p className="text-sm text-slate-700 dark:text-slate-300">{new Date(currentUser?.createdAt).toDateString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CurrentUserProfile;
