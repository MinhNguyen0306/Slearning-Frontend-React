import { Course } from "../../types/model/Course"
import NoImg from "../../assets/noimg.jpg";
import { getImage } from "../../util/utils";
import { BookOpenIcon } from "lucide-react";
import LinearProgress from "../LinearProgress";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useQuery } from "react-query";
import progressApi from "../../api/modules/progress.api";
import { toast } from "react-toastify";
import { useState } from "react";

const MyLearningBox = ({ course }: { course: Course }) => {
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.user.user)
    const [percentProgress, setPercentProgress] = useState<number>(0);

    const progressingQuery = useQuery({
        queryKey: ['progressingQuery', course.id, user.id],
        queryFn: async () => {
            const currentProgress = await progressApi.getCurrentProgress(user.id, course.id)
            if(currentProgress.response) return currentProgress.response
            if(currentProgress.error) {
                toast.error(currentProgress.error.response?.data.errorMessage)
            }
        },
    })

    const progressOfUser = useQuery({
        queryKey: ['progressOfUser', user.id, course.id],
        queryFn: async () => {
            if(course.id) {
                const { response, error } = await progressApi.getProgressCourseOfUser(user.id, course.id)
                if(error) {
                    toast.error(error.response?.data.errorMessage)
                    return Promise.reject()
                }
                if(response) return response.data
            } else {
                navigate("/learner/my-learning")
            }
        },
        onSuccess(data) {
            if(data && course) {
                const completedProgressed = data.filter(p => p.completed);
                if(completedProgressed.length === 0) {
                    setPercentProgress(0)
                } else {
                    const totalLecture = course.chapters.reduce((i,c) => i + c.lectures.length, 0)
                    const totalCompletedLecture = completedProgressed.length
                    const result = totalCompletedLecture / totalLecture * 100
                    setPercentProgress(result);
                }
            } else {
                setPercentProgress(0);
            }
        },
        onError(error: Error) {
            toast.error(error.message)
        }
    })

    function handleToLearning() {
        navigate(`/learning/${course.id}/lecture/${progressingQuery.data?.data.lecture.id}`)
    }

    return (
        <div className='w-auto border border-gray-300 bg-white rounded-md p-2 flex flex-col gap-y-3 break-words break-all
        cursor-pointer hover:bg-gray-50 h-full'
            onClick={handleToLearning}
        >
            <img 
                src={course.image ? getImage(course.image.url) : NoImg} 
                alt="Anh khoa hoc" 
                className="max-h-[150px] rounded-sm"
            />
            <h2 className="font-bold boxTitle">{ course.title }</h2>
            <span className="text-xs text-gray-600">{ course.user?.fullName }</span>
            <div className="flex justify-start items-center gap-x-3 text-xs text-gray-600">
                <BookOpenIcon className="w-5 h-5 text-mainColor"/>
                <span>{ course.chapters.reduce((i, c) => i + c.lectures.length, 0) } bài giảng</span>
            </div>
            <div className="flex flex-col justify-start gap-y-3 text-sm text-mainColor font-semibold">
                <LinearProgress value={percentProgress} id={course.id}/>
                <span>Đã hoàn thành { Math.round(percentProgress) }%</span>
            </div>
        </div>
    )
}

export default MyLearningBox
