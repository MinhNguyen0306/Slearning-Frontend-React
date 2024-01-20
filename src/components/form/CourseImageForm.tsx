import { PlusCircleIcon, UploadCloudIcon, ImageIcon, XIcon, EditIcon } from 'lucide-react';
import { ChangeEvent, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import courseApi from '../../api/modules/course.api';

const CourseImageForm = ({ courseId, imageUrl }: { courseId: string, imageUrl?: string }) => {
    const queryClient = useQueryClient();
    const [isChosingImage, setIsChosingImage] = useState<boolean>(false);

    const handleChooseFile = (e: ChangeEvent<HTMLInputElement>) => {
        if(e.target.files) {
            const file = e.target.files[0]
            const size = file.size;
            const url = URL.createObjectURL(e.target.files[0])
            const image = new Image
            image.src = url
            if(image.width > 1500 || image.height > 900) {
                toast.error("Độ phân giải không phù hợp")
                return;
            } else if(size > 1024 * 1024 * 5) {
                toast.error("Kích thước ảnh quá lớn")
                return;
            } else {
                const formData = new FormData;
                formData.append('image', file);
                mutation.mutate(formData)
            }
        }
    }

    const mutation = useMutation({
        mutationFn: (imageFile: FormData) => courseApi.updateImageCourse(courseId, imageFile),
        onSuccess: (data) => {
            if(data.response) {
                queryClient.invalidateQueries("courseCreating")
                toast.success("Cập nhật ảnh thành công")
            } 

            if(data.error) toast.error("Cập nhật ảnh thất bại")
        },
        onSettled() {
            setIsChosingImage(false)
        },
        onError: (error: Error) => {
            toast.error(error.message)
        }
    })

    return (
        <div className="bg-gray-100 w-full h-[30rem] rounded-md flex flex-col gap-5 p-5
        border-[1px] border-gray-300 mt-5">
            <div className="flex justify-between items-center font-bold">
                <span>Ảnh khóa học</span>
                {
                    isChosingImage && (
                        <span 
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => setIsChosingImage(false)}
                        >
                            <XIcon />
                            <span>Hủy</span>
                        </span>
                    )
                }
                {
                    !isChosingImage && !imageUrl && (
                        <span 
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => setIsChosingImage(true)}
                        >
                            <PlusCircleIcon />
                            <>Thêm ảnh</>
                        </span>
                    )
                }
                {
                    !isChosingImage && imageUrl && (
                        <span 
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => setIsChosingImage(true)}
                        >
                            <EditIcon />
                            <>Đổi ảnh</>
                        </span>
                    )
                }
            </div>
            {
                isChosingImage && (
                    <div className="relative w-full flex-1 bg-white flex flex-col gap-2 items-center justify-center
                    place-items-center rounded-sm border-2 border-gray-300 border-dashed">
                        <label htmlFor="upload" className="w-full h-full absolute inset-0 cursor-pointer"></label>
                        <input 
                            type="file" 
                            accept="Image/*" 
                            id="upload"
                            name="upload"
                            hidden
                            onChange={(file) => handleChooseFile(file)}
                        />
                        <UploadCloudIcon className="w-16 h-16 stroke-secondColor"/>
                        <span className="text-lg font-bold text-secondColor">Tải file ảnh lên</span>
                        <span className="text-xs">Giới hạn kích thước ảnh (50MB)</span>
                        <span className="text-xs">Giới hạn độ phân giải 1500 * 900</span>
                    </div>
                )
            }
            {
                !isChosingImage && !imageUrl && (
                    <div className="w-full flex-1 bg-gray-500 grid place-items-center rounded-sm">
                        <ImageIcon className="text-gray-100 w-16 h-16"/>
                    </div>
                )
            }
            {
                !isChosingImage && imageUrl && (
                    <div className='w-full max-h-[400px] flex-1 rounded-sm cursor-pointer'>
                        <img src={imageUrl} className='w-full h-full'/>
                    </div>
                )
            }
        </div>
    )
}

export default CourseImageForm
