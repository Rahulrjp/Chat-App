import { ImageIcon, User } from "lucide-react";

const AvatarContextMenu = ({ menuData, onClose, onViewAvatar, onViewProfile }) => {
    if (!menuData) return null;
    return (
        <>
            <div
                className="fixed inset-0 z-55"
                onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                }}></div>
            <div
                className="fixed z-60 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden py-1 w-40 animate-in fade-in zoom-in-95 duration-100"
                style={{
                    top: Math.min(menuData.y, window.innerHeight - 100),
                    left: menuData.x + 10,
                }}>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onViewAvatar(menuData.contact.avatar);
                        onClose();
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    <ImageIcon className="w-4 h-4" /> View Photo
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onViewProfile(menuData.contact);
                        onClose();
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    <User className="w-4 h-4" /> View Profile
                </button>
            </div>
        </>
    );
};

export default AvatarContextMenu;
