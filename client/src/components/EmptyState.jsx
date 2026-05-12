import { MessageSquare } from "lucide-react";

const EmptyState = () => (
    <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 p-8 transition-colors duration-200">
        <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mb-6">
            <MessageSquare className="w-12 h-12 text-indigo-400 dark:text-indigo-500" />
        </div>
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">Welcome to ChatApp</h2>
        <p className="text-center max-w-md">Select a contact from the sidebar to start a conversation, or search for someone specific.</p>
    </div>
);

export default EmptyState;
