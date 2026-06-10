import { Calendar, Mail, MapPin, MessageSquare, Phone, X, User } from "lucide-react";

const PublicProfile = ({ profile, onClose, onViewAvatar, onStartChat }) => {
    if (!profile) return null;
    return (
        <div className="fixed inset-0 bg-slate-900/40 dark:bg-slate-900/80 backdrop-blur-sm z-70 flex items-center justify-center p-4 transition-all">
            <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col border border-transparent dark:border-slate-800">
                <div className="h-32 bg-linear-to-r from-emerald-500 to-teal-600 relative shrink-0">
                    <button onClick={onClose} className="absolute top-4 right-4 text-white hover:bg-white/20 p-1.5 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto pb-6">
                    <div className="relative -mt-16 flex justify-center">
                        <div className="relative">
                            {profile.avatar ? (
                                <div className="cursor-pointer hover:opacity-90 transition-opacity" onClick={() => onViewAvatar(profile.avatar)}>
                                    <img
                                        src={profile.avatar}
                                        alt={profile.name}
                                        className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-900 object-cover bg-white dark:bg-slate-800 shadow-md"
                                    />
                                </div>
                            ) : (
                                <div className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 shadow-md">
                                    <User className="w-16 h-16" />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="px-6 pt-4 text-center">
                        <h2 className="text-2xl font-bold">{profile.name}</h2>
                        <p
                            className={`${profile.online ? "text-green-500" : "text-slate-400"} font-medium text-sm mt-1 mb-6 flex items-center justify-center gap-1.5`}>
                            <span className={`w-2 h-2 rounded-full ${profile.online ? "bg-green-500" : "bg-slate-400"}`}></span>
                            {profile.online ? "Online" : "Offline"}
                        </p>
                        <div className="space-y-4 text-left">
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">About</label>
                                <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{profile.about}</p>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 space-y-4">
                                <div>
                                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                                        <Mail className="w-3.5 h-3.5" /> Email Address
                                    </label>
                                    <p className="text-sm text-slate-700 dark:text-slate-300">{profile.email}</p>
                                </div>
                                <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                                        <Phone className="w-3.5 h-3.5" /> Phone Number
                                    </label>
                                    <p className="text-sm text-slate-700 dark:text-slate-300">{profile.phone}</p>
                                </div>
                                <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex gap-6">
                                    <div className="flex-1">
                                        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                                            <MapPin className="w-3.5 h-3.5" /> Location
                                        </label>
                                        <p className="text-sm text-slate-700 dark:text-slate-300">{profile.location}</p>
                                    </div>
                                    <div className="flex-1">
                                        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                                            <Calendar className="w-3.5 h-3.5" /> Joined
                                        </label>
                                        <p className="text-sm text-slate-700 dark:text-slate-300">{profile.joined}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2 pt-2">
                                <button
                                    onClick={onStartChat}
                                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                                    <MessageSquare className="w-4 h-4" /> Message
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default PublicProfile;
