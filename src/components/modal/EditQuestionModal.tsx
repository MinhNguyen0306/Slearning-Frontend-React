import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../redux/store";
import { Edit3Icon, PlusCircleIcon, SaveIcon, XCircleIcon, XIcon } from "lucide-react";
import { setEditQuestionModal } from "../../redux/features/appState/appState.slice";
import initialState from "../../redux/features/appState/appState.selector";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import AnswerItem from "../AnswerItem";
import { Tooltip } from "react-tooltip";
import { AnswerSchema, answerSchema } from "../../types/system/AnswerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { cn } from "../../util/utils";
import { useMutation, useQuery, useQueryClient } from "react-query";
import questionApi from "../../api/modules/question.api";
import { Button } from "../Button";
import { EditQuestionSchema, editQuestionSchema } from "../../types/zod/EditQuestionSchema";
import ReactQuill from "react-quill";

const EditQuestionModal = () => {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const [isEditQuestion, setIsEditQuestion] = useState<boolean>(false);
    const [isAddingAnswer, setIsAddingAnswer] = useState<boolean>(false);

    const { open, question } = useSelector((state: RootState) => state.appState.editQuestionModalOpen)

    const questionQuery = useQuery({
        queryKey: ['questionEditting', question.id],
        queryFn: async () => {
            const { response, error } = await questionApi.getById(question.id)
            if(response) return response.data
            if(error) {
                toast.error(error.response?.data.errorMessage ?? "Lay du lieu cau hoi that bai")
                return Promise.reject()
            }
        }
    })

    const { register, handleSubmit, formState: { isValid, isSubmitting, errors } } = useForm<EditQuestionSchema>({
        resolver: zodResolver(editQuestionSchema)
    })

    const addAnswerForm = useForm<AnswerSchema>({
        resolver: zodResolver(answerSchema)
    })

    const onSubmitAddAnswer: SubmitHandler<AnswerSchema> = async (values) => {
        addAnswerMutation.mutate(values.answer)
    }

    const addAnswerMutation = useMutation({
        mutationKey: ['addAnswer', question.id],
        mutationFn: (answerTitle: string) => questionApi.createAnswer(question.id, answerTitle),
        onSuccess(data) {
            if(data.response) {
                toast.success("Đã thêm câu trả lời")
                queryClient.invalidateQueries("questionEditting")
                queryClient.invalidateQueries("courseCreating")
            }
            if(data.error) toast.error(data.error.response?.data.errorMessage ?? "Thêm câu trả lời thất bại")
        },
        onSettled() {
            setIsAddingAnswer(false)
        }
    })

    const editQuestionMuTation = useMutation({
        mutationKey: ['editQuestion', question.id],
        mutationFn: async (questionTitle: string) => {
            if(questionTitle.trim() === "") {
                toast.error("Không được chứa toàn khoảng trắng")
                return Promise.reject();
            } else {
                return questionApi.editQuestion(question.id, questionTitle)
            }
        },
        onSuccess(data) {
            if(data.response) {
                toast.success("Đã sửa câu hỏi")
                queryClient.invalidateQueries("questionEditting")
                queryClient.invalidateQueries("courseCreating")
            }
            if(data.error) toast.success(data.error.response?.data.errorMessage ?? "Sửa câu hỏi thất bại")
        },
        onError(error: Error) {
            toast.error(error.message)
        }
    })

    const onSubmitQuestion: SubmitHandler<EditQuestionSchema> = async (values) => {
        editQuestionMuTation.mutate(values.question)
        setIsEditQuestion(false)
    }

    function handleClose() {
        setIsEditQuestion(false)
        dispatch(setEditQuestionModal(initialState.editQuestionModalOpen))
    }

    function handleEditQuestion() {
        setIsEditQuestion(prev => !prev)
    }

    return (
        <>
            {
                open &&
                <div className='h-screen w-screen fixed z-[99999] top-0 left-0 bg-gray-800 bg-opacity-50
                    grid place-items-center overflow-hidden'>
                    <div className='w-1/3 m-auto bg-white rounded-md border-[1px] border-gray-300 flex flex-col
                    justify-start items-center gap-2 overflow-y-scroll'>
                        <div className="self-end pt-2 pr-2 cursor-pointer">
                            <XCircleIcon className="hover:stroke-red-600" onClick={handleClose}/>
                        </div>

                        <div className="p-5 flex flex-col gap-2 overflow-y-auto scrollbar-hide w-full">
                            <div className="w-full h-16 bg-sky-100 rounded-md grid place-items-center px-8">
                                {
                                    isEditQuestion
                                        ?   
                                        <form onSubmit={handleSubmit(onSubmitQuestion)} className="w-full flex justify-between items-center gap-x-1">
                                            <input
                                                {...register('question')}
                                                data-tooltip-id='question'
                                                data-tooltip-content={ errors.question?.message }
                                                type='text'
                                                placeholder='Nhập câu hỏi'
                                                disabled={isSubmitting}
                                                autoComplete="off"
                                                className='flex-1 w-full py-2 px-5 outline-none border-[1px] border-gray-500
                                                rounded-md'
                                                
                                            />
                                            <Tooltip id='question'/>

                                            <button 
                                                type="submit"
                                                disabled={!isValid}
                                                className={cn("w-8 h-8 rounded-full grid place-items-center", {
                                                    "hover:bg-slate-300 cursor-pointer": isValid,
                                                    "text-slate-400": !isValid
                                                })}
                                            >
                                                <SaveIcon />
                                            </button>

                                            <div 
                                                className="w-8 h-8 rounded-full hover:bg-slate-300 grid place-items-center cursor-pointer"
                                                onClick={handleEditQuestion}
                                            >
                                                <XIcon />
                                            </div>
                                        </form>
                                        :   <div className="flex items-center justify-center gap-x-3 font-semibold text-lg">
                                                <span className="break-words break-all">
                                                    { questionQuery.data?.question }
                                                </span>
                                                <div 
                                                    className="w-8 h-8 rounded-full hover:bg-slate-300 grid place-items-center cursor-pointer"
                                                    onClick={handleEditQuestion}
                                                >
                                                    <Edit3Icon />
                                                </div>
                                            </div>
                                }
                            </div>

                            <ul className="flex flex-col gap-y-3 items-start justify-start mb-5">
                                {
                                    questionQuery.data && questionQuery.data.answers.map((answer, _) => (
                                        <AnswerItem key={answer.id} answer={answer} question={question} />
                                    ))
                                }
                            </ul>

                            <form 
                                onSubmit={addAnswerForm.handleSubmit(onSubmitAddAnswer)} 
                                className={cn('flex w-full gap-x-1 bg-white p-1 border border-gray-400 rounded-md', {
                                    'hidden': !isAddingAnswer
                                })}
                            >
                                <input 
                                    {...addAnswerForm.register('answer')}
                                    type="text" 
                                    autoComplete='off'
                                    className='flex-1 outline-none px-3'
                                />
                                
                                <button 
                                    type="submit"
                                    disabled={!addAnswerForm.formState.isValid}
                                    className={cn("w-8 h-8 rounded-full grid place-items-center", {
                                        "hover:bg-slate-300 cursor-pointer": addAnswerForm.formState.isValid,
                                        "text-slate-400": !addAnswerForm.formState.isValid
                                    })}
                                >
                                    <SaveIcon />
                                </button>
                                <div 
                                    className='w-8 h-8 rounded-full grid place-items-center hover:bg-slate-300 cursor-pointer' 
                                    onClick={() => setIsAddingAnswer(false)}
                                >
                                    <XIcon className='w-5 h-5'/>
                                </div>
                            </form>
                                        
                            <Button variant='blueContainer' rounded='md' onClick={() => setIsAddingAnswer(prev => !prev)}>
                                <div className="flex items-center justify-center gap-x-2">
                                    <PlusCircleIcon />
                                    <span>Thêm câu trả lời</span>
                                </div>
                            </Button>
                        </div>
                        {/* <div className="py-5 gap-x-3 px-2">
                            <div className="col-span-1 flex flex-col justify-start">
                                <h2 className="font-semibold text-center mb-2 text-lg">Giải thích cho câu hỏi</h2>
                                <ReactQuill 
                                    theme='snow' 
                                    placeholder='Nhập vào' 
                                    className='mb-4'
                                />
                            </div>
                        </div> */}
                    </div>
                </div> 
            }
        </>
    )
}

export default EditQuestionModal
