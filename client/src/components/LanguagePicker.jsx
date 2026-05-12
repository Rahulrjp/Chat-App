import { Check, X } from "lucide-react";

const LanguagePicker = ({ show, onClose, appSettings, setAppSettings }) => {
    if (!show) return null;
    return (
        <div className="fixed inset-0 bg-slate-900/40 dark:bg-slate-900/60 backdrop-blur-sm z-80 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 border border-transparent dark:border-slate-700">
                <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                    <h3 className="font-bold text-slate-800 dark:text-white">Select Language</h3>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 p-1.5 rounded-full transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>
                <div className="p-2 space-y-1">
                    {["English", "Español", "Français", "Deutsch", "हिन्दी"].map((lang) => (
                        <button
                            key={lang}
                            onClick={() => {
                                setAppSettings((prev) => ({ ...prev, language: lang }));
                                onClose();
                            }}
                            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors flex justify-between items-center ${appSettings.language === lang ? "bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400" : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"}`}>
                            {lang}
                            {appSettings.language === lang && <Check className="w-4 h-4" />}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default LanguagePicker;
