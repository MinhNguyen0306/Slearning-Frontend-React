import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../redux/store"
import Rating from "../Rating";
import { useState } from "react";
import { Button } from "../Button";
import { CheckCircleIcon } from "lucide-react";
import { useMutation } from "react-query";
import courseApi from "../../api/modules/course.api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { setCompletedCoursePopupState } from "../../redux/features/appState/appState.slice";
import initialState from "../../redux/features/appState/appState.selector";

const CompletedCoursePopup = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.user.user);
    const completedCoursePopup = useSelector((state: RootState) => state.appState.completedCoursePopupState);
    const [rating, setRating] = useState<number>(0)
    const [comment, setComment] = useState<string>("");

    const ratingMutation = useMutation({
        mutationKey: ['rating', user.id], 
        mutationFn: () => courseApi.ratingCourse(user.id, completedCoursePopup.courseId, rating, comment),
        onSettled() {
            handleClose()
        },
        onSuccess(data) {
            if(data.response) toast.success(data.response.data.message ?? "Đã đánh giá khóa học")
            if(data.error) toast.error(data.error.response?.data.errorMessage ?? "Đánh giá thất bại")
        },
        onError(error: Error) {
            toast.error(error.message)
        }
    })

    function handleRatingCourse() {
        ratingMutation.mutate();
    }

    function handleClose() {
        dispatch(setCompletedCoursePopupState(initialState.completedCoursePopupState))
        navigate("/learner/my-learning")
    }

    return (
        <>
            {
                completedCoursePopup.open &&
                <div className='h-screen w-screen fixed z-[99999] inset-0 bg-gray-800 bg-opacity-50
                    grid place-items-center overflow-hidden'>
                    <div className='w-1/3 m-auto bg-white rounded-md flex flex-col gap-y-5
                    justify-center items-center gap-2 px-5 py-8 shadow-md shadow-white'>
                        <h1 className="font-bold text-2xl bg-gradient-to-r from-blue-600 via-green-500 to-indigo-500
                        text-transparent bg-clip-text text-center flex">
                            Chúc mừng bạn đã hoàn thành khóa học này
                        </h1>
                        <div className="flex flex-col items-center gap-y-2">
                            <span className="text-lg">
                                Hãy để lại đánh giá cho khóa học
                            </span>
                            <Rating 
                                rating={rating} 
                                variant='outline' 
                                onRating={(r) => setRating(r)}
                            />
                            <input 
                                type="text" 
                                className="border border-gray-400 rounded-md px-3 py-2 outline-none w-full mt-2"
                                placeholder="Cho ý kiến đánh giá..."
                                onChange={(e) => setComment(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-y-2 w-1/2">
                            <Button variant='completed' rounded='md' onClick={handleRatingCourse} >
                                <div className="flex items-center gap-x-3 justify-center">
                                    <CheckCircleIcon />
                                    <span>
                                        Đánh giá và rời đi
                                    </span>
                                </div>
                            </Button>
                            <Button variant='danger' rounded='md' onClick={handleClose} >
                                <div className="flex items-center gap-x-3 justify-center">
                                    <CheckCircleIcon />
                                    <span>
                                        Rời đi
                                    </span>
                                </div>
                            </Button>
                        </div>
                    </div>
                </div> 
            }
        </>
    )
}

export default CompletedCoursePopup
