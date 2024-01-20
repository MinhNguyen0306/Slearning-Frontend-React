import { useEffect, useRef, useState } from 'react'
import { sidebarConstants } from '../constants/sidebar.constant'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { cn } from '../util/utils'
import { useNavigate, useParams } from 'react-router-dom'
import { setSidebarExpand } from '../redux/features/appState/appState.slice'
import { ChevronDownIcon, LockIcon, PanelRightOpenIcon, User2Icon } from 'lucide-react'
import LectureSidebarItem from './common/LectureSidebarItem'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import { useQuery } from 'react-query'
import courseApi from '../api/modules/course.api'
import { toast } from 'react-toastify'
import lectureApi from '../api/modules/lecture.api'
import { PublishStatus } from '../types/payload/enums/PublishStatus'
import chapterApi from '../api/modules/chapter.api'
import progressApi from '../api/modules/progress.api'
import ChapterSidebarItem from './common/ChapterSidebarItem'

const Sidebar = () => {
    const navigate = useNavigate();
    const sidebarExpand = useSelector((state: RootState) => state.appState.sidebarExpand);
    const dispatch = useDispatch();
    const sidebarRef = useRef<HTMLDivElement>(null)
    const active = useSelector((state: RootState) => state.appState.activeState);

    useEffect(() => {
        let mouseEnterHandler = () => {
            dispatch(setSidebarExpand(true))
        }

        sidebarRef.current?.addEventListener('mouseenter', mouseEnterHandler)
        return () => {
            sidebarRef.current?.removeEventListener('mouseenter', mouseEnterHandler)
        }
    })
    
    useEffect(() => {
        let mouseLeaveHandler = () => {
            dispatch(setSidebarExpand(false))
        }

        sidebarRef.current?.addEventListener('mouseleave', mouseLeaveHandler)
        return () => {
            sidebarRef.current?.removeEventListener('mouseleave', mouseLeaveHandler)
        }
    })

  return (
    <aside ref={sidebarRef} className={cn('block sticky top-[80px] left-0 w-16 max-w-[300px] h-[100vh] bg-white',
    'shadow-md shadow-gray-300 transition-all duration-500', {
        "w-[250px]": sidebarExpand === true
    })}>
        <ul className='flex flex-col'>
            {
                sidebarConstants.instructorSidebarList.map((item, index) => (
                  <li 
                    key={index}
                    onClick={() => item.path ? navigate(item.path) : null}
                  >
                    <div className={cn('flex py-5 cursor-pointer hover:bg-mainColorHover w-full relative',{
                        "border-r-8 border-mainColor bg-mainColorHover transition-all duration-500 text-mainColor": 
                        item.state && active?.includes(item.state)
                    })}>
                        <div>
                            <item.icon className='w-6 h-6 mx-5'/>
                        </div>
                        <span className={cn('overflow-hidden whitespace-nowrap', {
                            "opacity-0 transition-opacity duration-500": sidebarExpand === false
                        })}>{item.display}</span>
                    </div>
                  </li>  
                ))
            }
        </ul>
    </aside>
  )
}

export const AdminSidebar = () => {
    const navigate = useNavigate();
    const active = useSelector((state: RootState) => state.appState.activeState);
    let sidebarRef = useRef<HTMLDivElement>(null);
    const [sidebarExpand, setSidebarExpand] = useState<boolean>(false);

    useEffect(() => {
        const mouseEnterHandler = () => {
            setSidebarExpand(true)
        }

        sidebarRef.current?.addEventListener('mouseenter', mouseEnterHandler);
        return () => (
            sidebarRef.current?.removeEventListener('mouseenter', mouseEnterHandler)
        )
    }, [sidebarExpand])

    useEffect(() => {
        const mouseLeaveHandler = () => {
            setSidebarExpand(false)
        }

        sidebarRef.current?.addEventListener('mouseleave', mouseLeaveHandler);
        return () => {
            sidebarRef.current?.removeEventListener('mouseleave', mouseLeaveHandler);
        }
    }, [sidebarExpand])

    return (
        <div ref={sidebarRef} className={cn('sticky top-[80px] left-0 bg-white border-r-[1px] border-gray-300 h-screen',
        'w-16 duration-500 transition-all', {
            "w-[250px]": sidebarExpand
        })}>
            <div className='flex items-center justify-start border-b-2 border-gray-300'>
                <div>
                    <User2Icon className='w-6 h-6 mx-5 fill-gray-500 stroke-transparent'/>
                </div>
                <div className='flex flex-col whitespace-nowrap overflow-hidden py-2'>
                    <span className='font-bold'>Nguyen Le Minh</span>
                    <span className='text-sm text-gray-500'>
                        <i className='w-2 h-2 align-middle mr-2 rounded-full bg-green-500 inline-block'></i>
                        Admin
                    </span>
                </div>
            </div>
            <ul className='w-full flex flex-col list-none'>
                {
                    sidebarConstants.adminSidebarList.map((item, index) => (
                        <li key={index} onClick={() => item.path ? navigate(item.path) : null}>
                            <div className={cn(" py-5 flex justify-start items-center hover:bg-mainColorHover cursor-pointer", {
                                "border-r-8 border-mainColor bg-mainColorHover transition-all duration-500 text-mainColor": active && item.state?.includes(active)
                            })}>
                                <div>
                                    <item.icon className='w-6 h-6 mx-5'/>
                                </div>
                                <span className={cn('whitespace-nowrap overflow-hidden', {
                                    "opacity-0 transition-opacity duration-500": !sidebarExpand
                                })}>
                                    {item.display}
                                </span>
                            </div>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}

export const LearningSidebar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { courseId, lectureId } = useParams();
    const { sidebarExpand } = useSelector((state: RootState) => state.appState);
    const user = useSelector((state: RootState) => state.user.user);

    const progressOfUser = useQuery({
        queryKey: ['progressOfUser', user.id, courseId, lectureId],
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

    function percentProgress() {
        if(progressOfUser.data && learningCourseQuery.data) {
            const completedProgressed = progressOfUser.data.filter(p => p.completed);
            return completedProgressed.length / learningCourseQuery.data.chapters.reduce((i,c) => i + c.lectures.length, 0)
        } else {
            return 0;
        }
    }

    return (
        <div className={cn('fixed left-0 top-[80px] w-[350px] h-screen pb-[80px] flex flex-col items-start shadow-lg',
        "shadow-gray-300 bg-white pl-5 transition-all duration-500 overflow-y-scroll text-sm", {
            "left-[-350px]": !sidebarExpand
        })}>
            <span 
                className='text-blue-600 flex items-center gap-2 hover:text-blue-700
                my-5 cursor-pointer'
                onClick={() => dispatch(setSidebarExpand(false))}
            >
                <PanelRightOpenIcon /> 
                <span className='font-bold'>Ẩn mục lục</span>
             </span>

             <span className='font-bold text-lg text-left'>
                { learningCourseQuery.data?.title }
             </span>
             <div className='flex gap-3 items-center justify-start my-2'>
                <div className='w-10 h-10'>
                    <CircularProgressbar 
                        value={percentProgress() * 100} 
                        text={`${Math.round(percentProgress() * 100)}%`}
                        strokeWidth={15} 
                        styles={buildStyles({
                            pathTransitionDuration: 0.5,
                            pathColor: '#09c902',
                            textColor: '#09c902',
                            trailColor: '#d6d6d6',
                        })}
                    />
                </div>
                <span className='text-sm font-semibold'>
                    { progressOfUser.data ? progressOfUser.data.filter(p => p.completed).length : 0 } / { learningCourseQuery.data?.chapters.reduce((i,c) => i + c.lectures.length, 0) } bài giảng
                </span>
             </div>

             <ul className='w-full flex flex-col items-start justify-start list-none h-fit'>
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
        </div>
    )
}

export default Sidebar
