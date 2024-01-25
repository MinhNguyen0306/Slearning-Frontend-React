import { ChevronRightIcon, HomeIcon, PanelRightCloseIcon } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { RootState } from '../redux/store';
import { setCompletedCoursePopupState, setSidebarExpand } from '../redux/features/appState/appState.slice';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useEffect } from 'react';
import progressApi from '../api/modules/progress.api';
import { toast } from 'react-toastify';
import { cn } from '../util/utils';
import chapterApi from '../api/modules/chapter.api';
import { Button } from '../components/Button';
import CompletedCoursePopup from '../components/popup/CompletedCoursePopup';

const LearningPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation()
  const queryClient = useQueryClient();
  const { courseId, lectureId } = useParams();
  const { sidebarExpand } = useSelector((state: RootState) => state.appState);
  const user = useSelector((state: RootState) => state.user.user);

  const learningChapterQuery = useQuery({
    queryKey: ['learningChapter', lectureId],
    queryFn: async () => {
      if(lectureId) {
        const { response, error } = await chapterApi.getChapterOfLecture(lectureId)
        if(error) return Promise.reject()
        if(response) return response.data
      } else {
        return Promise.reject()
      }
    }
  })

  const currentProgressQuery = useQuery({
    queryKey: ['currentProgress', user.id, courseId],
    queryFn: () => {
        if(courseId) {
            return progressApi.getCurrentProgress(user.id, courseId);
        } else {
            return Promise.reject()
        }
    }
  })

  const getProgressOfLecture = useQuery({
    queryKey: ['progressOfLecture', user.id, lectureId],
    queryFn: () => {
        if(lectureId) {
            return progressApi.getProgressOfLecture(user.id, lectureId);
        } else {
            return Promise.reject()
        }
    }
  })

  const nextLectureMutation = useMutation({
    mutationFn: async () => {
      if(courseId && lectureId) {
        return progressApi.getNextProgress(user.id, courseId, lectureId)
      } else {
        return Promise.reject()
      }
    },
    onSettled() {
      queryClient.invalidateQueries("progressOfUser")
      queryClient.invalidateQueries("learningCourse")
      queryClient.invalidateQueries("currentProgress")
      queryClient.invalidateQueries("checkOpenTest")
    },
    onSuccess: (data) => {
      if(data.error) toast.error(data.error.response?.data.errorMessage)
      if(data.response) {
        console.log(data.response)
        if(!data.response.data) {
          toast.success("Chúc mừng bạn đã hoàn thành khóa học!")
          if(courseId) {
            dispatch(setCompletedCoursePopupState({ open: true, courseId: courseId }))
          } else {
            toast.error("Lỗi load Id khóa học")
          }
        } else {
          // Can xu ly refetch du lieu khi hoan thanh bai giang - chua hoan thanh
          if(getProgressOfLecture.data && !getProgressOfLecture.data.response?.data.completed) {
            toast.success("Bạn đã hoàn thành bài giảng!")
            console.log(data.response.data)
            const chapter = learningChapterQuery && learningChapterQuery.data
            const check = chapter &&  chapter.questions.length > 0 &&
              [...chapter.lectures].sort((l1, l2) => l1.position - l2.position)[chapter.lectures.length - 1].id === lectureId
            if(check) {
              navigate(`/learning/${courseId}/test/chapter/${chapter.id}`)
            } else {
              navigate(`/learning/${courseId}/lecture/${data.response.data.lecture.id}`)
            }
          } else {
            navigate(`/learning/${courseId}/lecture/${data.response.data.lecture.id}`)
          }
        }
      }
    },
    onError: (error: Error) => {
      toast.error(error.message)
    } 
  })

  function checkOpenQuestions() {
    if(learningChapterQuery.data) {
      const chapter = learningChapterQuery.data
      const hasQuestion = chapter.questions.length > 0
      const hasCompletedAllLectures = 
          [...chapter.lectures].sort((l1, l2) => l1.position - l2.position)[chapter.lectures.length - 1].id === lectureId && lectureId === currentProgressQuery.data?.response?.data.lecture.id && currentProgressQuery.data.response.data.completed
      if(hasQuestion && hasCompletedAllLectures) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  function handleCompleteLecture() {
    if(checkOpenQuestions()) {
      if(learningChapterQuery.data) {
        nextLectureMutation.mutate()
      }
    } else {
      nextLectureMutation.mutate()
    }
  }

  function checkCompletedLecture() {
    if(getProgressOfLecture.data?.response?.data.completed === true) {
      return true;
    } else {
      return false;
    }
  }

  useEffect(() => {
    if(checkOpenQuestions()) {
      if(learningChapterQuery.data) {
        navigate(`/learning/${courseId}/test/chapter/${learningChapterQuery.data.id}`)
      }
    }
  }, [])

  return (
    <>
      <CompletedCoursePopup />
      <div className={cn('h-[1000px] bg-white py-5 transition-all duration-300', {
        'px-20': !sidebarExpand,
        'px-10': sidebarExpand
      })}>
        {/* Navigation Bar */}
        <div className='flex gap-5 items-center justify-start'>
          {
            !sidebarExpand && (
              <span 
                className='text-blue-500 flex items-center gap-2 hover:text-blue-700
                my-5 cursor-pointer'
                onClick={() => dispatch(setSidebarExpand(true))}
              >
                <PanelRightCloseIcon />
                <span className='font-bold'>Mục lục</span>
              </span>
            )
          }
          <div className='flex justify-start items-center gap-2 text-sm'>
            <HomeIcon className='w-5 h-5 stroke-secondColor hover:stroke-blue-800 cursor-pointer'/>
            <ChevronRightIcon className='stroke-mainColorBold'/>
          </div>
          {
            !pathname.split("/").includes("test") &&
            <Button rounded='md' disabled={checkCompletedLecture()} onClick={handleCompleteLecture}>
              { checkCompletedLecture() ? "Đã hoàn thành bài giảng" : "Hoàn thành bài giảng" }
            </Button>
          }
        </div>
        {/* End Navigation Bar */}

        {/* Learning Lecture Content */}
        <div className='flex flex-col mb-10 mt-3'>
          <Outlet />
          {/* Test content */}
          {/* {
            learningChapterQuery.data && courseId && currentProgressQuery.data?.response
              ? <TestContent 
                  chapter={ learningChapterQuery.data } 
                  userId={user.id} 
                  courseId={courseId} 
                  open={checkOpenQuestions()} 
                  currentProgress={currentProgressQuery.data?.response?.data}
                />
              : <div className='w-full h-full animate-pulse from-slate-500 to-slate-200 bg-gradient-to-b'></div>
          } */}
          {/* End test content */}
        </div>
        {/* End Learning Lecture Content */}
      </div>
    </>
  )
}

export default LearningPage
