import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../redux/store"
import { setChangeAvatarModalOpen } from "../../redux/features/appState/appState.slice";
import { CameraIcon, Loader2Icon, XCircleIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from "../Button";
import { User } from "../../types/model/User";
import {toast} from 'react-toastify'
import { useMutation } from "react-query";
import userApi from "../../api/modules/user.api";
import { setLoggedinUser } from "../../redux/features/user/user.slice";
import { getImage } from "../../util/utils";

const ChangeAvatarModal = ({user}: {user: User}) => {
    const dispatch = useDispatch();
    const changeAvatarModalOpen = useSelector((state: RootState) => state.appState.changeAvatarModalOpen);
    const handleClose = () => dispatch(setChangeAvatarModalOpen(false))
    const [avatar, setAvatar] = useState<string>("");
    const [fileImage, setFileImage] = useState<File>();

    const handleChangeAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target && e.target.files) {
            const file = e.target.files[0];
            const size = file.size
            const url = window.URL.createObjectURL(file)
            const image = new Image;
            
            image.src=url

            if(image.width >= 1000 || image.height >= 600) {
                toast.error("Kich thuoc anh khong hop le")
                return;
            }

            if(size >= 1024 * 1024) {
                toast.error("Dung luong anh qua lon chon anh khac")
                return;
            }
            
            setAvatar(url)
            setFileImage(file);
        }
    }

    const handleUpload = (userId: string) => {
        if(avatar && fileImage) {
            const formData = new FormData;
            formData.append("avatar", fileImage);
            return userApi.updateAvatar(userId, formData)
        } else if(user.id) {
            toast.error("Loi user dang nhap")
        } else {
            toast.error("Chua co anh duoc chon")
        }
    }

    const mutation = useMutation({
        mutationFn: async () => await handleUpload(user.id),
        onSuccess: (data) => {
            if(data?.response) {
                dispatch(setLoggedinUser(data.response.data))
                dispatch(setChangeAvatarModalOpen(false))
                toast.success("Doi thanh cong")
            } else {
                toast.error("Doi Avatar that bai")
            }
        },
        onError: () => {
            toast.error("Loi he thong")
        }
    })

    return (
        <>
            {
                changeAvatarModalOpen &&
                <div className='h-screen w-screen fixed z-[99999] top-0 left-0 bg-gray-800 bg-opacity-50
                    grid place-items-center overflow-hidden'>
                    <div className='w-1/3 m-auto bg-white rounded-md border-[1px] border-gray-300 flex flex-col
                    justify-center items-center gap-2'>
                        <div className="self-end pt-2 pr-2 cursor-pointer">
                            <XCircleIcon className="hover:stroke-red-600" onClick={handleClose}/>
                        </div>

                        <div 
                            className='flex flex-col max-h-[500px] overflow-y-scroll gap-y-5 mb-8 w-full px-10
                            [&>div>label]:font-bold [&>div>label]:mb-2'
                        >
                            <h1 className="text-2xl font-bold text-left">Cập nhật ảnh đại diện</h1>

                            <p>Choose a photo that shows your face clearly and has a professional look. If you use other professional platforms, it’s a good idea to keep them consistent.</p>
                            
                            <label 
                                htmlFor="avatar"
                                className='relative w-fit h-fit rounded-full border-[1px] border-gray-300 p-1 group cursor-pointer'
                            >
                                {
                                    user.avatar?.url && 
                                    <img 
                                        src={user.avatar?.url ? getImage(user.avatar.url) : ""} 
                                        className='w-[200px] h-[200px] rounded-full object-cover'
                                    />
                                }
                                {
                                    avatar && avatar !== "" &&
                                    <div className="w-[200px] h-[200px] rounded-full bg-green-600 grid place-items-center">
                                        <span className="text-white font-extrabold text-5xl">
                                            { user.fullName?.charAt(0) }
                                        </span>
                                    </div> 
                                }
                                <div className="w-full h-full absolute inset-0 z-50 bg-gray-900 bg-opacity-60 rounded-full
                                grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <CameraIcon className="w-7 h-7 stroke-slate-200 stroke-1"/>
                                </div>
                            </label>

                            <input 
                                type="file" 
                                accept="image/*" 
                                id="avatar"
                                name="avatar"
                                className="absolute w-full h-full inset-0 z-[100]" 
                                hidden
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeAvatar(e)}
                            />

                            <div className="flex justify-start items-center gap-x-5 mt-3">
                                <div>
                                    <label 
                                        htmlFor="avatar"
                                        className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 block cursor-pointer" 
                                    >
                                        Chọn ảnh
                                    </label>
                                </div>

                                <Button variant='blueOutline' onClick={() => setAvatar("")}>
                                    Bỏ ảnh
                                </Button>
                            </div>

                            <span>
                                Dung lượng tối đa 1MB, kích thước tối đa 1000px * 600px
                            </span>

                            <div className="mt-10">
                                <Button variant='blueContainer' disabled={mutation.isLoading} rounded='md' onClick={() => mutation.mutate()}>
                                    {
                                        mutation.isLoading ? <Loader2Icon className="animate-spin"/> : "Lưu"
                                    }
                                </Button>
                            </div>
                        </div>
                    </div>
                </div> 
            }
        </>
    )
}

export default ChangeAvatarModal
