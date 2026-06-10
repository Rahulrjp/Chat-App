import { RotateCcw, X, ZoomIn, ZoomOut, Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";
import { useState, useRef } from "react";

const CustomVideoPlayer = ({ url }) => {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isMuted, setIsMuted] = useState(false);

    const togglePlay = () => {
        if (!videoRef.current) return;
        if (isPlaying) {
            videoRef.current.pause();
            setIsPlaying(false);
        } else {
            videoRef.current.play().catch(err => console.log(err));
            setIsPlaying(true);
        }
    };

    const handleTimeUpdate = () => {
        if (!videoRef.current) return;
        setCurrentTime(videoRef.current.currentTime);
    };

    const handleLoadedMetadata = () => {
        if (!videoRef.current) return;
        setDuration(videoRef.current.duration);
    };

    const handleSeek = (e) => {
        if (!videoRef.current || !duration) return;
        const seekTime = (Number(e.target.value) / 100) * duration;
        videoRef.current.currentTime = seekTime;
        setCurrentTime(seekTime);
    };

    const toggleMute = () => {
        if (!videoRef.current) return;
        videoRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    const formatTime = (timeInSeconds) => {
        if (isNaN(timeInSeconds)) return "0:00";
        const mins = Math.floor(timeInSeconds / 60);
        const secs = Math.floor(timeInSeconds % 60);
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    };

    const handleVideoEnded = () => {
        setIsPlaying(false);
    };

    return (
        <div className="relative w-full max-w-3xl aspect-video bg-black rounded-xl overflow-hidden group shadow-2xl flex items-center justify-center">
            {/* The Video Element */}
            <video
                ref={videoRef}
                src={url}
                onClick={togglePlay}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleVideoEnded}
                className="w-full h-full object-contain cursor-pointer"
            />

            {/* Play Button in the Center */}
            {!isPlaying && (
                <button
                    onClick={togglePlay}
                    className="absolute p-5 rounded-full bg-black/60 text-white hover:bg-black/80 hover:scale-110 active:scale-95 transition-all duration-200 shadow-lg border border-white/10 z-10 pointer-events-auto">
                    <Play className="w-8 h-8 fill-current ml-0.5" />
                </button>
            )}

            {/* Custom Control Bar at the Bottom */}
            <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-black/90 via-black/50 to-transparent p-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                {/* Scrubber / Progress Bar */}
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={duration ? (currentTime / duration) * 100 : 0}
                    onChange={handleSeek}
                    className="w-full h-1 bg-white/20 hover:h-1.5 rounded-lg appearance-none cursor-pointer accent-indigo-500 transition-all"
                />

                <div className="flex items-center justify-between text-white text-sm">
                    <div className="flex items-center gap-3">
                        {/* Play/Pause Button */}
                        <button onClick={togglePlay} className="p-1 hover:text-indigo-400 transition-colors">
                            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                        </button>

                        {/* Mute Button */}
                        <button onClick={toggleMute} className="p-1 hover:text-indigo-400 transition-colors">
                            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                        </button>

                        {/* Time Display */}
                        <span>
                            {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                    </div>

                    <button
                        onClick={() => videoRef.current?.requestFullscreen()}
                        className="p-1 hover:text-indigo-400 transition-colors">
                        <Maximize className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

const PhotoViewer = ({ photoUrl, onClose }) => {
    const [imageScale, setImageScale] = useState(1);
    if (!photoUrl) return null;

    const isVideo = typeof photoUrl === "string" && (photoUrl.includes("/video/upload/") || /\.(mp4|webm|ogg|mov|avi)$/i.test(photoUrl));

    return (
        <div className="fixed inset-0 bg-black/95 z-100 flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200 overflow-hidden">
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2 sm:gap-3 z-20 bg-black/40 p-1.5 sm:p-2 rounded-full backdrop-blur-md">
                {!isVideo && (
                    <>
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
                    </>
                )}
                <button onClick={onClose} className="p-2 hover:bg-red-500/80 text-white rounded-full transition-colors" title="Close">
                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
            </div>
            <div
                className="w-full h-full flex items-center justify-center overflow-auto"
                onWheel={(e) => {
                    if (isVideo) return;
                    if (e.deltaY < 0) setImageScale((prev) => Math.min(prev + 0.15, 4));
                    else setImageScale((prev) => Math.max(prev - 0.15, 0.5));
                }}>
                {isVideo ? (
                    <CustomVideoPlayer url={photoUrl} />
                ) : (
                    <img
                        src={photoUrl}
                        alt="Fullscreen Photo"
                        style={{
                            transform: `scale(${imageScale})`,
                            transition: imageScale === 1 ? "transform 0.3s ease-out" : "transform 0.1s ease-out",
                        }}
                        className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl origin-center"
                    />
                )}
            </div>
        </div>
    );
};

export default PhotoViewer;
