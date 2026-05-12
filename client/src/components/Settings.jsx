import { Bell, ChevronRight, Eye, Globe, LogOut, Moon, Settings, Shield, User, X } from "lucide-react";
import { logoutUser } from "../services/auth.services";
import { useNavigate } from "react-router-dom";
import socket from "../config/socket.io";

const SettingsView = ({ show, onClose, appSettings, toggleSetting, onShowProfile, onShowLanguage }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const res = await logoutUser();
            console.log("Logout successfully : ", res);

            if (socket.connected) {
                console.log("Disconnecting socket......");
                socket.disconnect();
            }

            navigate("/login");
        } catch (error) {
            console.error("Logout error : ", error);
        }
    };

    if (!show) return null;
    return (
        <div className="fixed inset-0 bg-slate-900/40 dark:bg-slate-900/80 backdrop-blur-sm z-60 flex items-center justify-center p-4 transition-all">
            <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh] border border-transparent dark:border-slate-800">
                <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50 shrink-0">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <Settings className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Settings
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 p-1.5 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/30 dark:bg-slate-900">
                    <div>
                        <div className="px-2 mb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Account & Privacy</div>
                        <div className="bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm">
                            <button
                                onClick={() => {
                                    onClose();
                                    onShowProfile();
                                }}
                                className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border-b border-slate-100 dark:border-slate-700">
                                <div className="flex items-center gap-3">
                                    <div className="bg-indigo-50 dark:bg-indigo-500/20 p-2 rounded-xl text-indigo-600 dark:text-indigo-400">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <span className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Edit Profile</span>
                                        <span className="block text-xs text-slate-500 dark:text-slate-400">Change name, avatar, and bio</span>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-400" />
                            </button>
                            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700">
                                <div className="flex items-center gap-3">
                                    <div className="bg-emerald-50 dark:bg-emerald-500/20 p-2 rounded-xl text-emerald-600 dark:text-emerald-400">
                                        <Eye className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <span className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Read Receipts</span>
                                        <span className="block text-xs text-slate-500 dark:text-slate-400">Let others know you've read messages</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => toggleSetting("readReceipts")}
                                    className={`w-11 h-6 rounded-full transition-colors relative flex items-center ${appSettings.readReceipts ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"}`}>
                                    <div
                                        className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${appSettings.readReceipts ? "translate-x-6" : "translate-x-1"}`}
                                    />
                                </button>
                            </div>
                            <div className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-50 dark:bg-blue-500/20 p-2 rounded-xl text-blue-600 dark:text-blue-400">
                                        <Shield className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <span className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Online Status</span>
                                        <span className="block text-xs text-slate-500 dark:text-slate-400">Show when you are active</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => toggleSetting("onlineStatus")}
                                    className={`w-11 h-6 rounded-full transition-colors relative flex items-center ${appSettings.onlineStatus ? "bg-blue-500" : "bg-slate-300 dark:bg-slate-600"}`}>
                                    <div
                                        className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${appSettings.onlineStatus ? "translate-x-6" : "translate-x-1"}`}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="px-2 mb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Preferences</div>
                        <div className="bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm">
                            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700">
                                <div className="flex items-center gap-3">
                                    <div className="bg-amber-50 dark:bg-amber-500/20 p-2 rounded-xl text-amber-600 dark:text-amber-400">
                                        <Bell className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Push Notifications</span>
                                </div>
                                <button
                                    onClick={() => toggleSetting("notifications")}
                                    className={`w-11 h-6 rounded-full transition-colors relative flex items-center ${appSettings.notifications ? "bg-amber-500" : "bg-slate-300 dark:bg-slate-600"}`}>
                                    <div
                                        className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${appSettings.notifications ? "translate-x-6" : "translate-x-1"}`}
                                    />
                                </button>
                            </div>
                            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700">
                                <div className="flex items-center gap-3">
                                    <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded-xl text-slate-700 dark:text-slate-300">
                                        <Moon className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Dark Mode</span>
                                </div>
                                <button
                                    onClick={() => toggleSetting("darkMode")}
                                    className={`w-11 h-6 rounded-full transition-colors relative flex items-center ${appSettings.darkMode ? "bg-indigo-500" : "bg-slate-300 dark:bg-slate-600"}`}>
                                    <div
                                        className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${appSettings.darkMode ? "translate-x-6" : "translate-x-1"}`}
                                    />
                                </button>
                            </div>
                            <button
                                onClick={onShowLanguage}
                                className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="bg-purple-50 dark:bg-purple-500/20 p-2 rounded-xl text-purple-600 dark:text-purple-400">
                                        <Globe className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">App Language</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium text-slate-400">{appSettings.language}</span>
                                    <ChevronRight className="w-4 h-4 text-slate-400" />
                                </div>
                            </button>
                        </div>
                    </div>
                    <div className="pt-2">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 p-3.5 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 hover:text-red-700 dark:hover:text-red-300 rounded-2xl transition-colors font-bold shadow-sm border border-transparent dark:border-red-900/30">
                            <LogOut className="w-5 h-5" /> Log Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsView;
