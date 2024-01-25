import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom"
import { RootState } from "../redux/store";
import { useEffect, useRef } from "react";
import { logout, setLoggedinUser } from "../redux/features/user/user.slice";
import userApi from "../api/modules/user.api";
import { ChevronLeftIcon, Loader2Icon } from "lucide-react";
import { Button } from "../components/Button";
import { cn } from "../util/utils";
import { useMutation, useQuery } from "react-query";
import codingApi from "../api/modules/coding.api";
import { toast } from "react-toastify";
import { PublishStatus } from "../types/payload/enums/PublishStatus";

const CreateExerciseLayout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { state, pathname } = useLocation()
    const from = useRef<string>(state ? state.from : "/instructor/courses/publishing")
    console.log(state)
    const { id, quizId } = useParams();
    let courseId = useRef<string>();
    let exId = useRef<number>()
    const user = useSelector((state: RootState) => state.user.user);
    const activeState = useSelector((state: RootState) => state.appState.activeState)

    const exQuery = useQuery({
        queryKey: ['exQuery'],
        queryFn: async () => {
            if(quizId) {
                const { response, error } = await codingApi.getById(Number(quizId))
                if(response) return response.data
                if(error) {
                    navigate(from.current, { replace: true })
                    toast.error("Lay thong tin bai tap that bai")
                    return Promise.reject();
                }
            } else {
                navigate(from.current, { replace: true })
                toast.error("Khong tim thay ID bai tap")
                return Promise.reject()
            }
        }
    })

    useEffect(() => {
        courseId.current = id
        exId.current = Number(quizId)
    }, [id, quizId])

    useEffect(() => {
        const authUser = async () => {
            const {response, error} = await userApi.getById(user.id);

            if(response) dispatch(setLoggedinUser(response.data))
            if(error) dispatch(logout())
        }

        authUser()
    }, [dispatch]) 

    function handleNavigateTo(path: string) {
        navigate(path, {
            state: { from }
        })
    }

    function checkLast() {
        const strArray = pathname.split("/")
        const curState = strArray[strArray.length - 1]
        if(curState === 'guide-learners') {
            return true
        } else {
            return false
        }
    }

    function checkFirst() {
        const strArray = pathname.split("/")
        const curState = strArray[strArray.length - 1]
        if(curState === 'choose-language') {
            return true
        } else {
            return false
        }
    }

    const publishCodingExercise = useMutation({
        mutationKey: ['publishCodingExercise'],
        mutationFn: async () => {
          if(exId.current) {
            return codingApi.publishCodingExercise(exId.current)
          } else {
            return Promise.reject()
          }
        },
        onSuccess(data) {
          if(data.response) {
            toast.success("Đã xuất bản")
            navigate(from.current, { replace: true })
          }
          if(data.error) toast.error(data.error.response?.data.errorMessage ?? "Xuất bản thất bại!")
        },
        onError(error: Error) {
          toast.error(error.message)
        }
      })

    function handlePublish() {
        const ex = exQuery.data
        if(ex?.codeStarter !== "" && ex?.instruction !== "" && ex?.solution !== "" && ex?.result !== "") {
            publishCodingExercise.mutate()
        } else {
            toast.warn("Chưa đủ thông tin để xuất bản! Kiểm tra lại.")
        }
      }

    return (
        <>
            <div className='max-w-screen min-h-screen flex flex-col'>
                <div className="w-full fixed z-50 border border-gray-300 px-5 h-[50px] bg-white 
                flex justify-between items-center">
                    <div className="flex items-center justify-start gap-x-5">
                        <div className="flex justify-start gap-x-2 items-center font-semibold text-mainColor
                        hover:text-mainColorBold cursor-pointer" onClick={() => navigate(from.current, { replace: true })}>
                            <ChevronLeftIcon className="w-4 h-4" />
                            <span>Quay lại</span>
                        </div>
                        <span className="font-bold">{ exQuery.data?.title }</span>
                    </div>
                    <div className="flex justify-end items-center gap-x-5">
                        {
                            exQuery.data?.publishStatus === PublishStatus.UN_PUBLISHING
                                ?   <Button 
                                        rounded={'sm'} 
                                        className="text-sm" 
                                        onClick={handlePublish}
                                        disabled={publishCodingExercise.isLoading}
                                    >
                                        {
                                            publishCodingExercise.isLoading
                                                ?   <div className="flex items-center justify-center gap-x-2">
                                                    <Loader2Icon className="ư-5 h-5 animate-spin"/>
                                                        <span>Đang xuất bản</span>
                                                    </div>
                                                :   <span>Xuất bản</span>
                                        }
                                    </Button>
                                :   <Button 
                                        variant={'warning'}
                                        className="text-sm"
                                        rounded={'sm'}
                                    >
                                        <span>Đã xuất bản</span>
                                    </Button>
                        }
                    </div>
                </div>
                <div className='relative w-screen min-h-screen pt-[50px]'>
                    <Outlet />
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col w-screen fixed bottom-0 left-0 z-50 border-t border-t-gray-300">
                    <div className="w-full bg-white px-5 py-2 h-[55px] flex justify-between items-center text-sm">
                        <Button variant={'light'} disabled={checkFirst()}>
                            Về trước
                        </Button>
                        <div className="flex items-center justify-center gap-x-3">
                            <div className={cn("flex items-center justify-center gap-x-2",
                            "p-2 cursor-pointer hover:bg-green-200", {
                                'shadow-[inset_0px_-3px_0px_0px_rgba(0,152,0,1)]': activeState === "instructor.coding-exercise.choose-language"
                            })} onClick={
                                () => handleNavigateTo(`/instructor/courses/${courseId.current}/coding-exercise/${exId.current}/choose-language`)
                            }>
                                <span>Ngôn ngữ</span>
                            </div>
                            <div className={cn("flex items-center justify-center gap-x-2",
                            "p-2 cursor-pointer hover:bg-green-200", {
                                'shadow-[inset_0px_-3px_0px_0px_rgba(0,152,0,1)]': activeState === "instructor.coding-exercise.author-solution"
                            })} onClick={
                                () => handleNavigateTo(`/instructor/courses/${courseId.current}/coding-exercise/${exId.current}/author-solution`)
                            }>
                                <span>Giải pháp</span>
                            </div>
                            <div className={cn("flex items-center justify-center gap-x-2",
                            "p-2 cursor-pointer hover:bg-green-200", {
                                'shadow-[inset_0px_-3px_0px_0px_rgba(0,152,0,1)]': activeState === "instructor.coding-exercise.guide-learners"
                            })} onClick={
                                () => handleNavigateTo(`/instructor/courses/${courseId.current}/coding-exercise/${exId.current}/guide-learners`)
                            }>
                                <span>Hướng dẫn người học</span>
                            </div>
                        </div>
                        <Button disabled={checkLast()}>
                            Tiếp theo
                        </Button>
                    </div>
                </div>
                {/* End Bottom Bar */}
            </div>
        </>
    )
}

export default CreateExerciseLayout
