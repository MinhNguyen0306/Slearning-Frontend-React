import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { BookCopyIcon, ChevronLeftIcon, ChevronRightIcon, UsersIcon, VideoIcon, VideotapeIcon, XCircleIcon } from 'lucide-react';
import { setCourseDetailModalOpen } from '../../redux/features/appState/appState.slice';
import { Button } from '../Button';
import initialState from '../../redux/features/appState/appState.selector';
import { cn, getImage } from '../../util/utils';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { ResolveStatus } from '../../types/payload/enums/ResolveStatus';
import { toast } from 'react-toastify';
import courseApi from '../../api/modules/course.api';
import { CourseStatus } from '../../types/payload/enums/CourseStatus';
import VideoContainer from '../VideoContainer';
import LectureContent from '../learning/LectureContent';
import { useState } from 'react';
import { Chapter } from '../../types/model/Chapter';
import { Lecture } from '../../types/model/Lecture';
import lectureApi from '../../api/modules/lecture.api';
import { Tooltip } from 'react-tooltip';
import { requestToken } from '../../firebase';
import { Notice } from '../../types/model/Notice';
import notificationApi from '../../api/modules/notification.api';

const CourseDetailModal = () => {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const { open, course } = useSelector((state: RootState) => state.appState.courseDetailModalOpen);

    const [currentChapter, setCurrentChapter] = useState<Chapter>(() => {
        return [...course.chapters].sort((c1, c2) => c1.position - c2.position)[0]
    });
    const [currentLecture, setCurrentLecture] = useState<Lecture>(() => {
        return [...currentChapter.lectures].sort((l1, l2) => l1.position - l2.position)[0]
    });
    const [courseView, setCourseView] = useState<'overview' | 'curriculum'>('overview');

    const lectureQuery = useQuery({
        queryKey: ['lecture', { currentLecture }],
        queryFn: async () => {
            const { response, error } = await lectureApi.getById(currentLecture.id);
            if(error) {
                toast.error(error.message ?? "Lấy thông tin bài giảng thất bại!");
            } else {
                return response.data
            }
        },
        onError(error: Error) {
            toast.error(error.message)
        }
    })

    const mutation = useMutation({
        mutationFn: (resolveStatus: ResolveStatus) => courseApi.resolve(course.id, resolveStatus),
        onSuccess: (data) => {
            if(data.response) {
                queryClient.invalidateQueries('courses');
                handleClose();
                toast.success(data.response.data.message)
                requestToken().then(token => {
                    console.log(token)
                    const notice: Notice = {
                        title: "Xuất bản khóa học",
                        topic: course.id,
                        content: data.response.data.status === 'accepted' ? "Hệ thống đã duyệt đăng ký người dạy"
                        :   "Hệ thống từ chối đăng ký người dạy",
                        imageUrl: course.image ? getImage(course.image.url) : "",
                        deviceTokens: [String(token?.trim())]
                    }
                    notificationApi.sendNotification(notice, "http://127.0.0.1:5173/learner/profile")
                    .then((response) => {
                        console.log(response)
                    })
                    .catch(error => console.log(error))
                }).catch((error) => console.log(error))
            } else {
                toast.error(data.error.message ?? "Lỗi duyệt khóa học")
            }
        },
        onError: (error: Error) => {
            toast.error(error.message)
        },
    })

    const handleClickLecture = (lecture: Lecture, chapter: Chapter) => {
        if(chapter.id !== currentChapter.id) {
            setCurrentChapter(chapter)
            setCurrentLecture(lecture)
        } else {
            setCurrentLecture(lecture)
        }
    } 

    function handleToCurriculum() {
        setCourseView('curriculum')
    }

    function handleToOverview() {
        setCourseView('overview')
    }

    const handleClose = () => {
        dispatch(setCourseDetailModalOpen(initialState.courseDetailModalOpen))
    }

    return (
        <>
            {
                open &&
                <div className='h-screen w-screen fixed z-[9999] top-0 left-0 bg-gray-800 bg-opacity-50
                grid place-items-center overflow-hidden'>

                    {/* Modal */}
                    <div className='w-[73vw] h-[90%] flex flex-col justify-start items-start shadow-md shadow-gray-300 rounded-md bg-white
                    overflow-y-scroll overflow-x-hidden scrollbar-hide'>
                        <div className="w-full sticky top-0 left-0 flex justify-between items-center py-2 px-3 border-b-[1px]
                         border-gray-300 bg-inherit z-50">
                            <div className='flex items-center justify-start gap-x-2'>
                                <div 
                                    className={cn('grid place-items-center rounded-full w-7 h-7 text-gray-300', {
                                    'hover:bg-mainColorHover cursor-pointer text-black': courseView === 'curriculum'
                                    })}
                                    data-tooltip-id='overview'
                                    data-tooltip-content='Xem tổng quan khóa học'
                                    onClick={() => courseView === 'curriculum' ? handleToOverview() : null }
                                >
                                    <ChevronLeftIcon />
                                </div>
                                <Tooltip id='overview'/>

                                <div
                                    className={cn('grid place-items-center rounded-full w-7 h-7 text-gray-200', {
                                    'hover:bg-mainColorHover cursor-pointer text-black': courseView === 'overview'
                                    })}
                                    data-tooltip-id='curriculum'
                                    data-tooltip-content='Xem chương trình giảng dạy'
                                    onClick={() => courseView === 'overview' ? handleToCurriculum() : null}
                                >
                                    <ChevronRightIcon />
                                </div>
                                <Tooltip id='curriculum' />

                                {
                                    courseView === 'overview' 
                                    ?   (
                                        <div className='flex items-center justify-start font-semibold text-base'>
                                            <span>Tổng quan khóa học</span>
                                        </div>
                                    )
                                    :   (
                                        <div className='flex items-center justify-start font-semibold text-base'>
                                            <span>Chương trình giảng dạy</span>
                                        </div>
                                    )
                                }
                            </div>
                           
                            <XCircleIcon 
                                className="w-8 h-8 fill-red-500 stroke-white float-right cursor-pointer
                                hover:fill-red-600"
                                onClick={handleClose}
                            />    
                        </div>

                        {/* Content */}
                        <div className='min-w-max flex items-center justify-start overflow-x-hidden'>
                            {/* Overview Content */}
                            <div className={cn('sticky w-[73vw] h-full p-5',
                            'transition-transform duration-300', {
                                '-translate-x-[73vw]': courseView === 'curriculum',
                                'translate-x-0': courseView === 'overview',
                            })}>
                                <div className='w-full flex gap-x-10'>
                                    <div className='w-[45%] flex flex-col gap-y-7'>
                                        <img 
                                            src={getImage(course.image?.url ?? "")} 
                                            alt="Course Image" 
                                            className='w-full object-contain border-2 border-gray-200 rounded-xl'
                                        />
                                        <div className='flex flex-col gap-y-5'>
                                            <div className='flex flex-col gap-y-3'>
                                                <h2 className='font-semibold text-xl'>Giảng viên</h2>
                                                <span className='font-semibold text-mainColorBold underline underline-offset-2
                                                hover:text-blue-500 cursor-pointer text-2xl'>
                                                    { course.user?.fullName }
                                                </span>
                                                { course.user?.workExperiences.map((work, _) => (
                                                    <span key={work.id} className='text-gray-800'>
                                                        { work.position } tại { work.company }
                                                    </span>
                                                )) }
                                                <div className='flex justify-start items-center gap-x-3'>
                                                    {
                                                        course.user?.avatar 
                                                        ?   <img 
                                                                src={course.user?.avatar ? getImage(course.user.avatar.url) : ''} 
                                                                alt=""
                                                                className='w-[70px] h-[70px] rounded-full' 
                                                            />
                                                        :   <div className='rounded-full'>

                                                            </div>
                                                    }
                                                    <div className='flex flex-col gap-y-2'>
                                                        <div className='flex items-center justify-start gap-x-2'>
                                                            <UsersIcon className='w-5 h-5' />
                                                            <span>0 Học viên</span>
                                                        </div>
                                                        <div className='flex items-center justify-start gap-x-2'>
                                                            <BookCopyIcon className='w-5 h-5' />
                                                            <span>{ course.user?.courses?.length } Khóa học</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='flex flex-col gap-y-3'>
                                                <h3 className='font-semibold text-lg'>Khóa học bao gồm</h3>
                                                <div className='flex justify-start items-center gap-x-5'>
                                                    <VideotapeIcon className='w-5 h-5'/>
                                                    <span>{ course.chapters.length } Chương</span>
                                                </div>
                                                <div className='flex justify-start items-center gap-x-5'>
                                                    <VideoIcon className='w-5 h-5'/>
                                                    <span>{ course.chapters.reduce((i, c) => i + c.lectures.length, 0) } Bài giảng</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex-1 flex flex-col gap-y-5'>
                                        <h2 className='font-semibold text-2xl'>{ course.title }</h2>
                                        <p>{ course.introduce }</p>
                                        <div>
                                            <h2 className='font-semibold text-lg'>
                                                Mô tả
                                            </h2>
                                            <p dangerouslySetInnerHTML={{ __html: course.description }} />
                                        </div>
                                        <div className=''>
                                            <h2 className='font-semibold text-lg mb-2'>Những gì đạt được</h2>
                                            <p className='border border-gray-300 rounded-xl p-5'>
                                                { course.achievement }
                                            </p>
                                        </div>
                                        <div className=''>
                                            <h2 className='font-semibold text-lg mb-2'>Yêu cầu đối với khóa học</h2>
                                            <p >
                                                { course.achievement }
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* End Overview Content */}

                            {/* Curriculum Content */}
                            <div className={cn('sticky w-[73vw] h-full flex p-5 transition-transform duration-300', {
                                'translate-x-0': courseView === 'overview',
                                '-translate-x-[73vw]': courseView === 'curriculum',
                            })}>
                                {/* Chapters Bar */}
                                <div className='w-[30%] px-3 overflow-y-scroll scrollbar-hide'>
                                    <ul className='w-full flex flex-col gap-y-3 justify-start items-start '>
                                        {
                                            [...course.chapters].sort((c1, c2) => c1.position - c2.position).map((chapter, _) => (
                                                <li key={chapter.id} className='w-full cursor-pointer'>
                                                    <div 
                                                        className={cn('flex justify-between items-center py-3 px-2 hover:bg-mainColorHover',
                                                        'gap-x-2 hover:text-mainColorBold', {
                                                            'border-l-4 border-mainColor': currentChapter.id === chapter.id
                                                        })}
                                                    >
                                                        <span>
                                                            Chương { chapter.position }. { chapter.title }
                                                        </span>
                                                    </div>
                                                    <ul className='w-full flex flex-col pl-5 gap-y-3'>
                                                        {
                                                            [...chapter.lectures].sort((l1, l2) => l1.position - l2.position).map((lecture, _) => (
                                                                <li 
                                                                    key={lecture.id}
                                                                    onClick={() => handleClickLecture(lecture, chapter)}
                                                                >
                                                                    <div className={cn('p-2 text-sm hover:bg-mainColorHover', {
                                                                        'bg-mainColorHover': currentLecture.id === lecture.id
                                                                    })}>
                                                                        <span>
                                                                            Bài { lecture.position }. {lecture.title}
                                                                        </span>
                                                                    </div>
                                                                </li>
                                                            ))
                                                        }
                                                    </ul>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </div>
                                {/* End Chapters Bar */}

                                {/* Learning Lecture Content */}
                                <div className='flex flex-col flex-1 mb-10 mt-3'>
                                    {/* Video Lecture Container */}
                                    <VideoContainer videoUrl={ lectureQuery.data?.videoStorage?.url ?? currentLecture.videoStorage?.url ?? "" } />
                                    {/* End Video Lecture Container */}

                                    {/* Content */}
                                    <LectureContent lecture={lectureQuery.data || currentLecture} />
                                    {/* End Content */}
                                </div>
                                {/* End Learning Lecture Content */}
                            </div>
                            {/* End Curriculum Content */}
                        </div>
                        {/* End Content */}

                        {/* Action Box */}
                        {
                            course.status === CourseStatus.PENDING &&
                            <div className='w-full px-5 py-4 sticky bottom-0 left-0 border-t-[1px] border-gray-300 bg-white z-50'>
                                <Button 
                                    variant='danger' rounded='md' 
                                    className='float-right w-[15%] ml-5' 
                                    onClick={() => mutation.mutate(ResolveStatus.REJECT)}
                                >
                                    Từ chối
                                </Button>
                                <Button 
                                    variant='blueContainer' 
                                    rounded='md' 
                                    className='float-right w-[15%]'
                                    onClick={() => mutation.mutate(ResolveStatus.ACCEPT)}
                                >
                                    Phê duyệt
                                </Button>
                            </div>
                        }
                        {/* End Action Box */}
                    </div>
                    {/* End Modal */}
              </div>
            }
        </>
    )
}

export default CourseDetailModal
