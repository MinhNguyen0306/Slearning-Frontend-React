import { useState } from 'react'
import { Button } from '../Button'
import { useMutation, useQuery, useQueryClient } from 'react-query';
import progressApi from '../../api/modules/progress.api';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import questionApi from '../../api/modules/question.api';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import chapterApi from '../../api/modules/chapter.api';
import { setCompletedCoursePopupState } from '../../redux/features/appState/appState.slice';
import { QuestionType } from '../../types/payload/enums/QuestionType';

const TestContent = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const { courseId, chapterId } = useParams();
    const user = useSelector((state: RootState) => state.user.user);

    const [grade, setGrade] = useState<number>(0);
    const [questionAnswered, setQuestionAnswered] = useState<string[]>([]);

    const chapterQuery = useQuery({
        queryKey: ['currentChapter', chapterId],
        queryFn: () => {
            if(chapterId) {
                return chapterApi.getById(chapterId)
            } else {
                return Promise.reject();
            }
        },
        onSuccess: (data) => {
            if(data.response?.data) {
                return data.response.data
            }
            if(data.error) toast(data.error.response?.data.errorMessage)
        },
        onError: (error: Error) => {
            toast.error(error.message)
        }
    })   
    
    const submitTestMutation = useMutation({
        mutationFn: async () => {
            const lectureId= 
                chapterQuery.data?.response?.data.lectures.sort((l1, l2) => l1.position - l2.position)[chapterQuery.data.response.data
                    .lectures.length - 1].id;
            if(courseId && lectureId) {
                return progressApi.getNextProgress(user.id, courseId, lectureId, grade)
            } else {
                return Promise.reject();
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
                if(!data.response.data) {
                    toast.success("Chúc mừng bạn đã hoàn thành khóa học!")
                    if(courseId) {
                        dispatch(setCompletedCoursePopupState({ open: true, courseId: courseId }))
                    } else {
                        toast.error("Lỗi load Id khóa học")
                    }
                } else {
                    const lectureId= 
                        chapterQuery.data?.response?.data.lectures.sort((l1, l2) => l1.position - l2.position)[chapterQuery.data.response.data
                            .lectures.length - 1].id;
                    if(data.response.data.lecture.id === lectureId) {
                        toast.error("Bạn không đủ điểm để qua chương khác")
                    } else {
                        navigate(`/learning/${courseId}/lecture/${data.response.data.lecture.id}`)
                        toast.success("Bạn đã hoàn thành chương!")
                    }
                }
            }
        },
        onError: (error: Error) => {
            toast.error(error.message)
        } 
    })

    const chooseAnswerMutation = useMutation({
        mutationFn: ({ questionId, answerIds, shortAnswer }: {questionId: string, answerIds?: string[], shortAnswer?: string}) => {
            return questionApi.checkCorrectAnswer(questionId, answerIds, shortAnswer);
        },
        onError: (error: Error) => {
            toast.error(error.message)
        }
    })

    function handleChooseAnwer(questionType: QuestionType, questionId: string, answerId: string) {
        switch(questionType) {
            case 'SINGLE_CHOICE': {
                if(!questionAnswered.includes(questionId)) setQuestionAnswered(prev => [...prev, questionId])
                const answerIds = [answerId]
                const result = chooseAnswerMutation.mutateAsync({questionId: questionId, answerIds: answerIds})
                result.then(response => {
                    if(response.response?.data === true) {
                        toast.success("Đáp án đúng")
                        setGrade(prev => prev + 1)
                    } else {
                        if(questionAnswered?.includes(questionId)) {
                            setGrade(prev => prev - 1);
                        }
                        toast.error("Đáp án sai")
                    }
                })
                break;
            }
            case 'MULTIPLE_CHOICE': {
                const answers = document.getElementsByName(questionId)
                const answerIds: string[] = []
                for (var i=0;i<answers.length;i++){
                    const answered = answers[i] as HTMLInputElement
                    if(answered.checked) {
                        answerIds.push(answered.value)
                    }
                }
                if(answerIds.length >= 2) {
                    if(!questionAnswered.includes(questionId)) setQuestionAnswered(prev => [...prev, questionId])
                    const result = chooseAnswerMutation.mutateAsync({questionId: questionId, answerIds: answerIds})
                    result.then(response => {
                        if(response.response?.data === true) {
                            toast.success("Đáp án đúng")
                            setGrade(prev => prev + 1)
                        } else {
                            if(questionAnswered?.includes(questionId)) {
                                setGrade(prev => prev - 1);
                            }
                            toast.error("Đáp án sai")
                        }
                    })
                } else {
                    toast.warn("Chọn ít nhất 2 câu trả lời")
                }
                break;
            }
            case 'SHORT_ANSWER': {
                if(!questionAnswered.includes(questionId)) setQuestionAnswered(prev => [...prev, questionId])
                const answerIds = [answerId]
                const result = chooseAnswerMutation.mutateAsync({questionId: questionId, shortAnswer: answerId})
                result.then(response => {
                    if(response.response?.data === true) {
                        toast.success("Đáp án đúng")
                        setGrade(prev => prev + 1)
                    } else {
                        if(questionAnswered?.includes(questionId)) {
                            setGrade(prev => prev - 1);
                        }
                        toast.error("Đáp án sai")
                    }
                })
                break;
            }
        }
    }

    function submitTest() {
        if(chapterQuery.data?.response?.data) {
            submitTestMutation.mutate()
        }
    }  

    return (
        <>
            {
                courseId && user.id && chapterId 
                ?    <div className='flex flex-col'>
                        <h1 className='text-2xl font-bold'>Bài tập kiểm tra chương { chapterQuery.data?.response?.data.title }</h1>
                        <p className='mb-10 text-lg'>Đúng 70% số câu hỏi để đến chương kế tiếp</p>
                        {
                            chapterQuery.data && chapterQuery.data.response?.data.questions.map((question, index) => (
                                <div key={question.id} className='flex flex-col gap-y-2 mb-5'>
                                    <div className='flex items-center justify-start gap-x-3'>
                                        <span className='font-semibold'>Câu {index + 1}.</span>
                                        <span>{question.question} { question.questionType === 'MULTIPLE_CHOICE' 
                                                ? "Chọn đáp án đúng."
                                                : question.questionType === 'SINGLE_CHOICE'
                                                    ? "Chọn đáp án đúng nhất."
                                                    : "Nhập câu trả lời của bạn."
                                            }
                                        </span>
                                    </div>
                                    <ul>
                                        {
                                            question.answers.map((answer, _) => (
                                                <div key={answer.id} className='flex items-center justify-start gap-x-5'>
                                                    {
                                                        question.questionType === 'SINGLE_CHOICE' &&
                                                        <input 
                                                            type="radio" 
                                                            name={question.id}
                                                            id={answer.id}
                                                            value={answer.id}
                                                            onChange={(e) => handleChooseAnwer(question.questionType, question.id, e.target.value)}
                                                        />
                                                    }
                                                    {
                                                        question.questionType === "MULTIPLE_CHOICE" &&
                                                        <input 
                                                            type="checkbox" 
                                                            name={question.id}
                                                            id={answer.id}
                                                            value={answer.id}
                                                            onChange={(e) => handleChooseAnwer(question.questionType, question.id, e.target.value)}
                                                        />
                                                    }
                                                    {
                                                        question.questionType !== "SHORT_ANSWER" 
                                                            ?   <label htmlFor={answer.id}>{ answer.answer }</label>
                                                            :   <input
                                                                    type='text'
                                                                    placeholder='Nhập câu trả lời của bạn'
                                                                    autoComplete='off'
                                                                    className='w-1/2 py-2 px-5 outline-none border-[1px] border-gray-300 rounded-md'
                                                                    onChange={(e) => handleChooseAnwer(question.questionType, question.id, e.target.value)}
                                                                />
                                                    }
                                                </div>
                                            ))
                                        }
                                    </ul>
                                </div>
                            ))
                        }
                        {/* Submit box */}
                        <div className='fixed bottom-5 right-5 flex flex-col gap-y-3 shadow-lg shadow-slate-500  bg-blue-950 border
                        border-gray-300 rounded-lg p-5 text-white'>
                            <span>Ban da tra loi { questionAnswered.length } / { chapterQuery.data?.response?.data.questions.length } cau hoi</span>
                            <Button 
                                variant='warning' 
                                rounded='md' 
                                disabled={questionAnswered?.length !== chapterQuery.data?.response?.data.questions.length}
                                onClick={submitTest}
                            >
                                Submit
                            </Button>
                        </div>
                        {/* End submit box */}
                    </div>
                :   <div className='flex w-full justify-center items-center h-[calc(100vh-170px)]'>
                        <h1 className='font-semibold text-2xl'>Bạn chưa hoàn thành hết bài giảng của chương</h1>
                    </div>
            }
        </>
    )
}

export default TestContent
