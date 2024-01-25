import { useQuery } from "react-query"
import { useNavigate, useParams } from "react-router-dom"
import courseApi from "../../../api/modules/course.api"
import { toast } from "react-toastify"
import { useSelector } from "react-redux"
import { RootState } from "../../../redux/store"
import { CodingExercise } from "../../../types/model/CodingExercise"
import progressApi from "../../../api/modules/progress.api"
import ChapterSidebarItem from "../ChapterSidebarItem"

interface Props {
    codingEx?: CodingExercise
}

const CurriculumContent = ({ codingEx }: Props) => {
    const navigate = useNavigate()
    const { courseId } = useParams()
    const user = useSelector((state: RootState) => state.user.user)

    const learningCourseQuery = useQuery({
        queryKey: ['learningCourse', courseId],
        queryFn: async () => {
            if(courseId) {
                const { response, error } = await courseApi.getById(courseId)
                if(error) {
                    toast.error(error.response?.data.errorMessage)
                    return Promise.reject()
                }
                if(response) return response.data
            } else {
                navigate("/learner/my-learning")
            }
        },
    })

    const progressOfUser = useQuery({
        queryKey: ['progressOfUser', user.id, courseId, codingEx?.lecture.id],
        queryFn: async () => {
            if(courseId) {
                const { response, error } = await progressApi.getProgressCourseOfUser(user.id, courseId)
                if(error) {
                    toast.error(error.response?.data.errorMessage)
                    return Promise.reject()
                }
                if(response) return response.data
            } else {
                navigate("/learner/my-learning")
            }
        },
    })

    const currentProgressQuery = useQuery({
        queryKey: ['currentProgress', user.id, courseId],
        queryFn: async () => {
            if(courseId) {
                return progressApi.getCurrentProgress(user.id, courseId);
            } else {
                return Promise.reject()
            }
        }
    })


    return (
        <ul className='w-[75%] mx-auto flex flex-col items-start justify-start list-none h-fit mt-5'>
            {
                learningCourseQuery.data 
                    && [...learningCourseQuery.data.chapters].sort((c1, c2) => c1.position - c2.position).map((chapter, _) => (
                    <li key={chapter.id} className='w-full min-w-full break-words break-before-all'>
                        {
                            progressOfUser.data && currentProgressQuery.data?.response
                                ?   <ChapterSidebarItem 
                                        chapter={chapter} 
                                        userId={user.id} 
                                        progresses={progressOfUser.data} 
                                        currentProgress={currentProgressQuery.data.response.data}
                                    />
                                : <div className='bg-gray-200 animate-pulse w-full h-[45px]'></div> 
                        }
                    </li>
                ))
            }
        </ul>
    )
}

export default CurriculumContent
