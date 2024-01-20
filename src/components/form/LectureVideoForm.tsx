import { Edit2Icon, Edit3Icon, PlusCircleIcon, UploadCloudIcon, VideoIcon, XIcon } from 'lucide-react';
import { ChangeEvent, useState } from 'react'
import LinearProgress from '../LinearProgress';
import { useMutation, useQueryClient } from 'react-query';
import lectureApi from '../../api/modules/lecture.api';
import { Lecture } from '../../types/model/Lecture';
import { toast } from 'react-toastify';
import { getVideo } from '../../util/utils';
import VideoContainer from '../VideoContainer';

const LectureVideoForm = ({ lecture }: { lecture: Lecture }) => {
    const queryClient = useQueryClient();
    const [isChosingVideo, setIsChosingVideo] = useState<boolean>(false);
    const [videoUrl, setVideoUrl] = useState<string | undefined>(lecture.videoStorage ? lecture.videoStorage.url : undefined)

    const handleChooseFile = (e: ChangeEvent<HTMLInputElement>) => {
        if(e.target.files) {
            const videoFile = e.target.files[0]

            // Tao video object de kiem tra truoc khi upload
            const fakeUrl = URL.createObjectURL(videoFile)
            const videoEl = document.createElement("video")
            videoEl.src=fakeUrl

            videoEl.onloadedmetadata = event => {
                window.URL.revokeObjectURL(fakeUrl)
                const type = videoFile.type
                const size = videoFile.size
                const duration = videoEl.duration
                const volume = videoEl.volume
                const frameHeight = videoEl.videoHeight

                if(type !== "video/mp4") {
                    toast.error("Định dạng video phải ở MP4")
                } else if(size > 100 * 1024 * 1024) {
                    toast.error("Dung lượng tối đa 100MB")
                }  else if(duration < 10 && duration > 900) {
                    toast.error("Thời lượng tối thiểu 10 giây và tối đa 15 phút")
                } else if(volume === 0) {
                    toast.error("Video phải có âm thanh")
                } else if(frameHeight > 1028) {
                    toast.error("Độ phân giải tối đa 1028p")
                } else {
                    const formData = new FormData
                    formData.append("video", videoFile)
                    mutation.mutate({ video: formData, videoDuration: duration })
                }
            }
        }
    }

    const mutation = useMutation({
        mutationFn: ({ video, videoDuration }: { video: FormData, videoDuration: number }) => lectureApi.uploadVideo(lecture.id, video, videoDuration),
        onSuccess(data) {
            if(data.response) {
                queryClient.invalidateQueries("courseCreating")
                setVideoUrl(data.response.data.videoStorage?.url)
                toast.success("Upload video thành công")
            } else {
                toast.error(data.error.message)
            }
        },
        onSettled() {
            setIsChosingVideo(false)
        },
        onError(error: Error) {
            toast.error(error.message)
        }
    })

    return (
        <div className="bg-gray-100 w-full h-[500px] rounded-md flex flex-col gap-5 p-5
        border-[1px] border-gray-300">
            <div className="flex justify-between items-center font-bold">
                <span>Video bài giảng</span>
                {
                    isChosingVideo ? (
                        <span 
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => setIsChosingVideo(false)}
                        >
                            <XIcon />
                            <span>Hủy</span>
                        </span>
                    ) : (
                        <div 
                            onClick={() => setIsChosingVideo(true)}
                        >
                            {
                                !lecture.videoStorage
                                    ?   <span className='flex items-center gap-2 cursor-pointer'>
                                            <PlusCircleIcon />
                                            <span>Thêm một video</span>
                                        </span>
                                    :   <span className='flex items-center gap-2 cursor-pointer'>
                                            <Edit3Icon />
                                            <span>Video khác</span>
                                        </span>
                            }
                        </div>
                    )
                }
            </div>
            {
                isChosingVideo && (
                    <div className="relative w-full flex-1 bg-white flex flex-col gap-2 items-center justify-center
                    place-items-center rounded-sm border-2 border-gray-300 border-dashed">
                        <label htmlFor="upload" className="w-full h-full absolute inset-0 cursor-pointer"></label>
                        <input 
                            type="file" 
                            accept="video/*" 
                            id="upload"
                            name="upload"
                            hidden
                            onChange={(file) => handleChooseFile(file)}
                        />
                        <UploadCloudIcon className="w-16 h-16 stroke-secondColor"/>
                        <span className="text-lg font-bold text-secondColor">Chọn file video upload</span>
                        <span className="text-xs">Giới hạn kích thước video (100MB)</span>
                        <span className='text-xs'>Giới hạn độ phân giải (720p)</span>
                            {
                                mutation.isLoading && <LinearProgress />
                            }
                    </div>
                )
            }
            {
                !isChosingVideo && !videoUrl && (
                    <div className="w-full flex-1 bg-gray-500 grid place-items-center rounded-sm">
                        <VideoIcon className="text-gray-100 w-16 h-16"/>
                    </div>
                )
            }
            {
                !isChosingVideo && videoUrl && (
                    <div className='w-full max-h-[400px] flex-1 rounded-sm cursor-pointer'>
                        <VideoContainer videoUrl={videoUrl} />
                    </div>
                )
            }
        </div>
    )
}

export default LectureVideoForm
