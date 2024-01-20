import { useState, useRef, useEffect } from 'react'
import { Button } from './Button'
import TestVideo from "../assets/testvideo.mp4";
import { MaximizeIcon, MinimizeIcon, PauseIcon, PlayIcon, Volume1Icon, Volume2Icon, VolumeIcon, VolumeXIcon } from 'lucide-react';
import { cn, getVideo } from '../util/utils';
import fileApi from '../api/modules/file.api';

const VideoContainer = ({ videoUrl }: {videoUrl: string}) => {
    let videoContainerRef = useRef<HTMLDivElement>(null);
    let videoRef = useRef<HTMLVideoElement>(null)
    let volumeRef = useRef<HTMLInputElement>(null)
    let timelineContainerRef = useRef<HTMLDivElement>(null); 
    let timelineRef = useRef<HTMLDivElement>(null); 
    let indicatorRef = useRef<HTMLDivElement>(null); 
    let durationRef = useRef<HTMLDivElement>(null);
    let controlsContainerRef = useRef<HTMLDivElement>(null)

    const [isPaused, setIsPaused] = useState<boolean>(false)
    const [isFullScreen, setIsFullScreen] = useState<boolean>(false)
    const [volumeLevel, setVolumeLevel] = useState<'high' | 'medium' | 'low' | 'muted'>('high')

    function handleFullScreenVideo() {
        if(document.fullscreenElement === null) {
            videoContainerRef.current?.requestFullscreen()
            setIsFullScreen(true)
        } else {    
            document.exitFullscreen()
            setIsFullScreen(false)
        }
    }

    function toggleMute() {
        if(videoRef.current && volumeRef.current) {
            if(Number(volumeRef.current.value) > 0) {
                videoRef.current.volume = 0
            } else {
                videoRef.current.volume = 1
            }
        }
    }

    const leadingZeroFormatter = new Intl.NumberFormat(undefined, {
        minimumIntegerDigits: 2,
    })

    function formatTime(time: number) {
        const seconds = Math.floor(time % 60);
        const minutes = Math.floor(time / 60) % 60
        const hours = Math.floor(time / 3600)
        if(hours === 0) {
            return `${minutes}:${leadingZeroFormatter.format(seconds)}`
        } else {
            return `${hours}:${leadingZeroFormatter.format(minutes)}:${leadingZeroFormatter.format(seconds)}`
        }
    }

    // Reload video when change state
    useEffect(() => {   
        if(videoRef.current) {
            videoRef.current.src = getVideo(videoUrl)
        }
    }, [videoUrl])

    useEffect(() => {
        const durationHandler = () => {
            if(videoRef.current && durationRef.current && timelineRef.current && indicatorRef.current) {
                durationRef.current.childNodes[0].textContent = String(formatTime(videoRef.current.currentTime))
                const percent = videoRef.current.currentTime / videoRef.current.duration * 100
                timelineRef.current.style.width = `${String(percent)}%`
                indicatorRef.current.style.left = `${String(percent)}%`
            }

            const duration = videoRef.current?.duration
            const currentTime = videoRef.current?.currentTime
            if(duration && currentTime && currentTime === duration) {
                console.log("Next")
            }
        }

        videoRef.current?.addEventListener('timeupdate', durationHandler);
        return () => {
            videoRef.current?.addEventListener('timeupdate', durationHandler);
        }
    })

    useEffect(() => {
        const loadedDataHandler = () => {
            if(videoRef.current && durationRef.current && timelineRef.current && timelineContainerRef.current) {
                durationRef.current.childNodes[2].textContent = String(formatTime(videoRef.current.duration))
                durationRef.current.childNodes[0].textContent = String(formatTime(videoRef.current.currentTime))
            }
        }

        videoRef.current?.addEventListener('loadeddata', loadedDataHandler);
        return () => {
            videoRef.current?.removeEventListener('loadeddata', loadedDataHandler);
        }
    }, [])

    useEffect(() => {
        const volumeChangeHandler = () => {
            if(videoRef.current && volumeRef.current) {
                videoRef.current.volume = Number(volumeRef.current.value)
                videoRef.current.muted = Number(volumeRef.current.value) === 0
            }
        }

        volumeRef.current?.addEventListener('input', volumeChangeHandler);
        return () => {
            volumeRef.current?.removeEventListener('input', volumeChangeHandler);
        }
    })

    useEffect(() => {
        const volumeChangeHandler = () => {
            if(videoRef.current && volumeRef.current) {
                volumeRef.current.value = String(videoRef.current?.volume)
                if(videoRef.current.muted || videoRef.current.volume === 0) {
                    setVolumeLevel('muted')
                    volumeRef.current.value = String(0)
                } else if(videoRef.current.volume > 0.3 && videoRef.current.volume < 0.5) {
                    setVolumeLevel('medium')
                } else if(videoRef.current.volume <= 0.3 && videoRef.current.volume > 0) {
                    setVolumeLevel('low')
                } else {
                    setVolumeLevel('high')
                }
            }
        }
        
        videoRef.current?.addEventListener('volumechange', volumeChangeHandler)
        return () => {
            videoRef.current?.removeEventListener('volumechange', volumeChangeHandler)
        }
    }, [])

    useEffect(() => {
        const handlePausePlay = (e: KeyboardEvent) => {
            const video = videoRef.current
            if(video) {
                switch(e.key) {
                    case " ": 
                        if(e.target === document.body) {
                            e.preventDefault()
                        }
                        isPaused ? video.pause() : video.play()
                        setIsPaused(prev => !prev)
                        break;
                    case "ArrowRight": 
                        video.currentTime += 5
                        break;
                    case "ArrowLeft": 
                        video.currentTime -= 5
                        break;
                    case "m": 
                        video.muted = !video.muted
                        break;
                }
            }
        }

        document.addEventListener('keydown', handlePausePlay)
        return () => {
            document.removeEventListener('keydown', handlePausePlay)
        }
    }, [isPaused])

    useEffect(() => {
        const handlePausePlay = (e: MouseEvent) => {
            const video = videoRef.current
            const target = e.target
            if(target === video) {
                isPaused ? video?.pause() : video?.play()
                setIsPaused(prev => !prev)
            }
        }

        videoContainerRef.current?.addEventListener('click', handlePausePlay)
        return () => {
            videoContainerRef.current?.removeEventListener('click', handlePausePlay)
        }
    }, [isPaused])

    return (
        <div 
            ref={videoContainerRef} 
            className='relative w-full h-full text-white group bg-black'
            onDoubleClick={handleFullScreenVideo}
        >
            {/* Video Controls Container */}
            <div ref={controlsContainerRef} className={cn('absolute bottom-0 left-0 right-0 w-full z-50 px-5 py-3 opacity-0 ',
            'group-hover:opacity-100 cursor-pointer', {
                'opacity-100': !isPaused
            })}>
                {/* Timeline Video Container */}
                <div ref={timelineContainerRef} className='relative w-full h-1 mb-2 hover:scale-y-[200%]'>
                    <div className='absolute inset-0 bg-gray-400'>
                    </div>

                    {/* Timeline Video */}
                    <div ref={timelineRef} className='absolute inset-0 w-0 bg-red-500 z-50 h-full'>
                    </div>
                    {/* End Timeline Video */}

                    {/* Indicator */}
                    <div ref={indicatorRef} className='absolute bg-red-500 rounded-full h-3 w-3 -translate-y-1/2 top-1/2
                    '>
                    </div>
                    {/* End Indicator */}
                    <div>
                    </div>
                </div>
                {/* End Timeline Video Container */}

                {/* Controls */}
                <div className='flex items-center justify-between'>
                    <div className='flex gap-4 items-center justify-start'>
                        <button>
                            {
                                isPaused ? (
                                    <PauseIcon className='stroke-none fill-white w-8 h-8'/>
                                ): (
                                    <PlayIcon className='stroke-none fill-white w-8 h-8'/>
                                )
                            }
                        </button>
                        <div className='flex items-center justify-start gap-4 volume-container'>
                            <button onClick={toggleMute}>
                                { volumeLevel === 'high' && <Volume2Icon className='stroke-white w-7 h-7'/> }
                                { volumeLevel === 'medium' && <Volume1Icon className='stroke-white w-7 h-7'/> }
                                { volumeLevel === 'low' && <VolumeIcon className='stroke-white w-7 h-7'/> }
                                { volumeLevel === 'muted' && <VolumeXIcon className='stroke-white w-7 h-7'/> }
                            </button>
                            <input 
                                ref={volumeRef}
                                type='range' 
                                min={0} 
                                max={1} 
                                step='any' 
                                className='w-0 origin-left scale-x-0 transition-all duration-300 volume-slider'
                            />
                        </div>
                        <div ref={durationRef} className='flex gap-1 items-center justify-start'>
                            <span>
                            </span>
                            <span>/</span>
                            <span>
                            </span>
                        </div>
                    </div>
                    <div className='flex gap-2 items-center justify-end'>
                        <button onClick={handleFullScreenVideo}>
                            {
                                isFullScreen ? (
                                    <MinimizeIcon className='stroke-white w-7 h-7'/>
                                ): (
                                    <MaximizeIcon className='stroke-white w-7 h-7'/>
                                )
                            }
                        </button>
                    </div>
                </div>
                {/* End Controls */}
            </div>
            {/* End Video Controls Container */}

            {/* Video Source */}
            <video ref={videoRef} className='w-full h-full'>
                <source src={getVideo(videoUrl)} type='video/mp4' />
            </video>
            {/* End Video Source */}
        </div>
    )
}

export default VideoContainer
