import { EditIcon, ImageIcon, PlusCircleIcon, UploadCloudIcon, XIcon } from 'lucide-react';
import { useState, useRef, ChangeEvent } from 'react'
import { toast } from 'react-toastify';

interface Props {
    imageBlob: string,
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

const AdvertisementImageForm = ({ onChange, imageBlob } : Props) => {
    const [isChosingImage, setIsChosingImage] = useState<boolean>(false);
    const imageRef = useRef<HTMLImageElement>(null)

    const handleChooseFile = (e: ChangeEvent<HTMLInputElement>) => {
        if(e.target.files) {
            const fileSize = Number((Math.ceil(e.target.files[0].size / 1024) / 1024).toFixed(3))
            if(fileSize > 10) {
                toast.error("Dung lượng ảnh quá lớn. Chọn ảnh khác!")
            } else {
                onChange(e)
                const oldImageUrl = imageRef.current?.src
                oldImageUrl && URL.revokeObjectURL(oldImageUrl)
                imageRef.current?.src === '';
                setIsChosingImage(false)
            }
        }
    }

    return (
        <div className="bg-gray-100 w-full h-[30rem] rounded-md flex flex-col gap-5 p-5
        border-[1px] border-gray-300">
            <div className="flex justify-between items-center font-bold">
                <span>Ảnh hiển thị quảng cáo</span>
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
                    !isChosingImage && !imageBlob && (
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
                    !isChosingImage && imageBlob && (
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
                        <span className="text-xs">
                            Giới hạn dung lượng ảnh <span className='font-extrabold text-base'>(10MB)</span>
                        </span>
                        <span className="text-xs">
                            Kích thước ảnh tối thiểu <span className='font-extrabold text-base'>(800 x 500 pixel)</span>
                        </span>
                        <span className="text-xs">
                            Giới hạn kích thước ảnh <span className='font-extrabold text-base'>(1218 x 650 pixel)</span>
                        </span>
                    </div>
                )
            }
            {
                !isChosingImage && imageBlob.length === 0 && (
                    <div className="w-full flex-1 bg-gray-500 grid place-items-center rounded-sm">
                        <ImageIcon className="text-gray-100 w-16 h-16"/>
                    </div>
                )
            }
            {
                !isChosingImage && imageBlob.length > 0 && (
                    <div className='w-full max-h-[400px] flex-1 rounded-sm cursor-pointer'>
                        <img ref={imageRef} src={imageBlob} className='w-full h-full'/>
                    </div>
                )
            }
        </div>
    )
}

export default AdvertisementImageForm
