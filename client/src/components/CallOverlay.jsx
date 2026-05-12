import { Lock, Mic, MicOff, PhoneOff, User, Video, VideoOff, Volume2, X } from "lucide-react";
import { useEffect, useState } from "react";
import formatDuration from "../utils/formatDuration";

const CallOverlay = ({ callState, onEndCall, currentUser }) => {
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [callDuration, setCallDuration] = useState(0);
    const [status, setStatus] = useState("calling");

    useEffect(() => {
        if (!callState) return;
        setStatus("calling");
        const timer = setTimeout(() => {
            setStatus("connected");
        }, 2500);
        return () => clearTimeout(timer);
    }, [callState]);

    useEffect(() => {
        let interval;
        if (status === "connected") {
            interval = setInterval(() => {
                setCallDuration((prev) => prev + 1);
            }, 1000);
        } else {
            setCallDuration(0);
        }
        return () => clearInterval(interval);
    }, [status]);

    if (!callState) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-xl z-100 flex flex-col justify-between items-center text-white transition-all duration-300 animate-in fade-in zoom-in-95">
            <div className="w-full p-6 flex justify-between items-start absolute top-0 left-0">
                <button onClick={() => onEndCall(callDuration, status)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <X className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-full text-xs font-medium border border-emerald-400/20">
                    <Lock className="w-3 h-3" /> End-to-end encrypted
                </div>
                <div className="w-10"></div>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center w-full max-w-5xl px-4 mt-16 mb-24">
                <div className="text-center mb-8">
                    <h2 className="text-3xl sm:text-4xl font-light mb-3">{callState.contact.name}</h2>
                    <p className="text-slate-300 tracking-wider text-sm font-medium">
                        {status === "calling" ? "Calling..." : formatDuration(callDuration)}
                    </p>
                </div>
                <div className="w-full flex items-center justify-center relative">
                    {callState.type === "audio" ? (
                        <div className="relative flex items-center justify-center h-64 w-64">
                            {status === "calling" && (
                                <>
                                    <div className="absolute inset-0 bg-indigo-500 rounded-full animate-ping opacity-20 duration-1000"></div>
                                    <div className="absolute inset-4 bg-indigo-400 rounded-full animate-ping opacity-20 delay-150 duration-1000"></div>
                                </>
                            )}
                            {status === "connected" && <div className="absolute inset-0 bg-emerald-500 rounded-full animate-pulse opacity-10"></div>}
                            <img
                                src={callState.contact.avatar}
                                alt={callState.contact.name}
                                className="w-40 h-40 rounded-full object-cover border-4 border-slate-700 relative z-10 shadow-2xl"
                            />
                        </div>
                    ) : (
                        <div className="w-full max-w-3xl h-[50vh] sm:h-[60vh] bg-slate-800 rounded-3xl overflow-hidden relative border border-slate-700 shadow-2xl flex items-center justify-center">
                            <div className="absolute inset-0 bg-slate-900">
                                <img src={callState.contact.avatar} className="w-full h-full object-cover opacity-30 blur-2xl scale-110" alt="" />
                            </div>
                            <div className="relative z-10 animate-in zoom-in duration-500">
                                <img
                                    src={callState.contact.avatar}
                                    className="w-32 h-32 sm:w-48 sm:h-48 rounded-full border-4 border-white/10 shadow-2xl"
                                    alt="Remote User"
                                />
                            </div>
                            <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 w-24 h-36 sm:w-36 sm:h-48 bg-slate-900 rounded-2xl border-2 border-slate-600/50 overflow-hidden shadow-2xl transition-all">
                                {isVideoOff ? (
                                    <div className="w-full h-full flex items-center justify-center bg-slate-800">
                                        <User className="w-8 h-8 sm:w-12 sm:h-12 text-slate-500" />
                                    </div>
                                ) : (
                                    <img src={currentUser.avatar} className="w-full h-full object-cover" alt="You" />
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 sm:gap-6 bg-slate-800/80 p-3 sm:p-4 rounded-full backdrop-blur-xl border border-slate-700 shadow-2xl">
                <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`p-3.5 sm:p-4 rounded-full transition-all ${isMuted ? "bg-white text-slate-900 shadow-lg" : "bg-slate-700/50 hover:bg-slate-600 text-white"}`}
                    title={isMuted ? "Unmute" : "Mute"}>
                    {isMuted ? <MicOff className="w-5 h-5 sm:w-6 sm:h-6" /> : <Mic className="w-5 h-5 sm:w-6 sm:h-6" />}
                </button>
                {callState.type === "video" && (
                    <button
                        onClick={() => setIsVideoOff(!isVideoOff)}
                        className={`p-3.5 sm:p-4 rounded-full transition-all ${isVideoOff ? "bg-white text-slate-900 shadow-lg" : "bg-slate-700/50 hover:bg-slate-600 text-white"}`}
                        title={isVideoOff ? "Turn on camera" : "Turn off camera"}>
                        {isVideoOff ? <VideoOff className="w-5 h-5 sm:w-6 sm:h-6" /> : <Video className="w-5 h-5 sm:w-6 sm:h-6" />}
                    </button>
                )}
                <button className="p-3.5 sm:p-4 rounded-full transition-all bg-slate-700/50 hover:bg-slate-600 text-white" title="Speaker">
                    <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <button
                    onClick={() => onEndCall(callDuration, status)}
                    className="p-3.5 sm:p-4 bg-red-500 hover:bg-red-600 text-white rounded-full transition-transform hover:scale-110 shadow-lg shadow-red-500/20 ml-2"
                    title="End Call">
                    <PhoneOff className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
            </div>
        </div>
    );
};

export default CallOverlay;
