import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../redux/store"
import { setAboutModalOpen } from "../../redux/features/appState/appState.slice";
import { XCircleIcon } from 'lucide-react';
import { Button } from "../Button";
import { useForm, SubmitHandler } from 'react-hook-form';
import { AboutSchema, aboutSchema } from "../../types/zod/AboutSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "react-query";
import userApi from "../../api/modules/user.api";
import { User } from "../../types/model/User";
import { toast } from 'react-toastify';
import { Tooltip } from "react-tooltip";
import { setLoggedinUser } from "../../redux/features/user/user.slice";
import notificationApi from "../../api/modules/notification.api";
import { Notice } from "../../types/model/Notice";
import { getImage } from "../../util/utils";
import { requestToken } from "../../firebase";

const AboutModal = ({user}: { user: User }) => {
    const dispatch = useDispatch();
    const aboutModal = useSelector((state: RootState) => state.appState.aboutModalOpen);
    const handleClose = () => {
        dispatch(setAboutModalOpen({ open: false, prevAbout: "" }))
    }

    const {register, handleSubmit, formState: { errors }} = useForm<AboutSchema>({
        resolver: zodResolver(aboutSchema)
    })

    const mutation = useMutation({
        mutationFn: (about: string) => userApi.updateAbout(user.id, about),
        onSuccess: (data) => {
            if(data.error) {
                toast.error(data.error.message);
            } else {
                // CHua hoan thien
                requestToken().then(token => console.log(token))
                // const notice: Notice = { 
                //     title: "TYu", 
                //     topic: "gi the",
                //     content: "adad",
                //     imageUrl: user.avatar ? getImage(user.avatar.url) : "",
                //     data: {
                //         "daa": "daa",
                //         "key2": "key2"
                //     },
                //     deviceTokens: ["fboqPlrs_gumaMZzM7JWdz:APA91bGNmyZp2xo6lkhoHxDtBQDTAG9LHs9O3tK46lB6RSVpp78zqiiXMUx4QKzWU7JNrWAqNMe4KGKZ1Jk7c1iTnz6ikYW1SHXF6FP996B00dTp8zbogUJZNt20__WAL4Cs3gyCG2jd"] 

                // }
                // notificationApi.sendNotification(notice, "http://127.0.0.1:5173")
                // .then((response) => {
                //     console.log(response)
                // })
                // .catch(error => console.log(error))
                dispatch(setLoggedinUser(data.response.data))
                handleClose()
                toast.success("Cập nhật thành công")
            }
        },
        onError: (error: Error) => {
            toast.error(error.message);
        }
    })

    const onSubmit: SubmitHandler<AboutSchema> = async (values) => {
        mutation.mutate(values.about)
    }

    return (
        <>
            {
                aboutModal.open &&
                <div className='h-screen w-screen fixed z-[99999] inset-0 bg-gray-800 bg-opacity-50
                    grid place-items-center overflow-hidden'>
                    <div className='w-1/3 m-auto bg-white rounded-md border-[1px] border-gray-300 flex flex-col
                    justify-center items-center gap-2'>
                        <div className="self-end pt-2 pr-2 cursor-pointer">
                            <XCircleIcon className="hover:stroke-red-600" onClick={handleClose}/>
                        </div>

                        <form 
                            onSubmit={handleSubmit(onSubmit)}
                            className='flex flex-col max-h-[500px] overflow-scroll gap-y-5 mb-8 w-full px-10
                            [&>div>label]:font-bold [&>div>label]:mb-2'
                        >
                            <div className="flex flex-col">
                                <label htmlFor="about">Gioi thieu ban than</label>
                                <textarea 
                                    data-tooltip-id="aboutError"
                                    data-tooltip-content={errors.about?.message}
                                    {...register('about')}
                                    id="about" 
                                    defaultValue={user.about}
                                    placeholder="Nhap gioi thieu ban than"
                                    className="h-[200px] border-[1px] p-2 outline-none border-gray-800 rounded-md px-3 resize-none"
                                />
                                { errors.about?.message && <Tooltip id="aboutError" /> }
                            </div>
                            <Button type="submit" variant='blueContainer'>
                                Luu
                            </Button>
                        </form>
                    </div>
                </div> 
            }
        </>
    )
}

export default AboutModal
