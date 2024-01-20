import { useState } from "react";
import { 
    XCircleIcon, 
    LayoutDashboardIcon,
    VideoIcon,
    EyeIcon,
    PaperclipIcon,
    PlusCircleIcon,
    FolderPlusIcon,
    FolderXIcon,
    Files,
} from "lucide-react";
import { Button } from "../Button";
import { useDispatch, useSelector } from "react-redux";
import LectureTitleForm from "../form/LectureTitleForm";
import LectureDescriptionForm from "../form/LectureDescriptionForm";
import LectureVideoForm from "../form/LectureVideoForm";
import { setCreateLectureModalOpen } from "../../redux/features/appState/appState.slice";
import { RootState } from "../../redux/store";
import { PublishStatus } from "../../types/payload/enums/PublishStatus";
import { useMutation, useQueryClient } from "react-query";
import lectureApi from "../../api/modules/lecture.api";
import { toast } from "react-toastify";
import initialState from "../../redux/features/appState/appState.selector";
import LectureFileAttachForm from "../form/LectureFileAttachForm";

const CreateLectureModal = () => {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const { open, lecture } = useSelector((state: RootState) => state.appState.createLectureModalOpen);
    const [previewed, setPreviewed] = useState<boolean>(lecture.previewed);
    const [publishing, setPublishing] = useState<PublishStatus>(lecture.publishStatus);
    const [attachFiles, setAttachFiles] = useState<File[]>([]);

    const mutationPreviewed = useMutation({
        mutationFn: () => lectureApi.updatePreviewed(lecture.id),
        onSuccess(data) {
            if(data.error) {
                toast.error(data.error.message)
            } else {
                queryClient.invalidateQueries("courseCreating")
                setPreviewed(data.response.data)
            }
        },
        onError(error: Error) {
            toast.error(error.message)
        }
    })

    const mutationPublishing = useMutation({
        mutationFn: () => lectureApi.updatePublishing(lecture.id),
        onSuccess(data) {
            if(data.error) {
                toast.error(data.error.message)
            } else {
                queryClient.invalidateQueries("courseCreating")
                setPublishing(data.response.data)
            }
        },
        onError(error: Error) {
            toast.error(error.message)
        }
    })

    function handleChangePreviewed() {
        mutationPreviewed.mutate()
    }

    function handleChangePublishing() {
        mutationPublishing.mutate()
    }

    function handleClose() {
        dispatch(setCreateLectureModalOpen(initialState.createLectureModalOpen))
    }

    return (
        <>
            {
                open &&
                <div className='h-screen w-screen fixed z-[99999] inset-0 bg-gray-800 bg-opacity-50
                grid place-items-center overflow-hidden'>
                    <div className='w-[80%] flex flex-col max-h-[90%] shadow-lg shadow-gray-300 rounded-md bg-white
                    overflow-y-auto scrollbar-hide'>
                        <div 
                            className="w-full py-1 px-4 border-b-[1px] border-gray-300 sticky top-0 left-0"
                            onClick={handleClose}
                        >
                            <XCircleIcon className="w-8 h-8 fill-red-500 stroke-white float-right cursor-pointer
                            hover:fill-red-600"/>
                        </div>
                        <div className='flex flex-col gap-5 overflow-x-hidden overflow-y-auto items-center justify-start'>
                            {/* Create Content */}
                            <div className="w-full grid grid-cols-2 gap-5 p-5">
                                {/* Left Content */}
                                <div className="flex flex-col gap-5 items-center justify-start">
                                    <div className="flex gap-2 items-center font-semibold self-start">
                                        <div className="rounded-full bg-blue-100 text-blue-600 p-1">
                                            <LayoutDashboardIcon />
                                        </div>
                                        <h2>Tùy chỉnh thông tin</h2>
                                    </div>
                                    {/* Lecture Title */}
                                    <LectureTitleForm lecture={lecture} />
                                    {/* End Lecture Title */}

                                    {/* Lecture Description */}
                                    <LectureDescriptionForm lecture={lecture} />
                                    {/* End Lecture Description */}

                                    <div className="flex gap-2 items-center font-semibold self-start">
                                        <div className="rounded-full bg-blue-100 text-blue-600 p-1">
                                            <EyeIcon />
                                        </div>
                                        <h2>Cài đặt truy cập</h2>
                                    </div>  

                                    <div className="flex flex-col w-full p-5 border-[1px] gap-3
                                    border-gray-300 bg-gray-100 rounded-md">
                                        <div className="flex justify-between items-center font-semibold">
                                            <label htmlFor="preview">Được xem trước</label>
                                            <input 
                                                type="checkbox" 
                                                id="preview" 
                                                name="preview"
                                                checked={previewed}
                                                onChange={handleChangePreviewed}
                                            />
                                        </div>
                                        <div className="flex justify-between items-center font-semibold">
                                            <h3>Trạng thái</h3>
                                            <Button 
                                                variant='blueOutline' 
                                                size='sm'
                                                rounded= 'md'
                                                onClick={handleChangePublishing}
                                            >
                                                {
                                                    publishing === PublishStatus.PUBLISHING ? "Xuất bản" : "Không xuất bản"
                                                }
                                            </Button>
                                        </div>
                                    </div> 

                                    <div className="flex gap-2 items-center font-semibold self-start">
                                        <div className="rounded-full bg-blue-100 text-blue-600 p-1">
                                            <PaperclipIcon />
                                        </div>
                                        <h2>Đính kèm file</h2>
                                    </div>           

                                    {/* File Attach Form */}
                                    <LectureFileAttachForm lectureId={lecture.id}/>
                                    {/* End File Attach Form */}
                                </div>
                                {/* End Left Content */}

                                {/* Right Content */}
                                <div className="w-full flex flex-col gap-5">
                                    <div className="flex gap-2 items-center font-semibold self-start">
                                        <div className="rounded-full bg-blue-100 text-blue-600 p-1">
                                            <VideoIcon />
                                        </div>
                                        <h2>Tùy chỉnh video</h2>
                                    </div>
                                    <LectureVideoForm lecture={lecture} />
                                </div>
                                {/* End Right Content */}
                            </div>
                            {/* End Create Content */}
                        </div>
                    </div>
              </div>
            }
        </>
    )
}

export default CreateLectureModal
