import { Edit3Icon, SaveIcon, XIcon } from 'lucide-react'
import { Answer } from '../types/model/Answer'
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import questionApi from '../api/modules/question.api';
import { SubmitHandler, useForm } from 'react-hook-form';
import { AnswerSchema, answerSchema } from '../types/system/AnswerSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '../util/utils';
import { Tooltip } from 'react-tooltip';
import { toast } from 'react-toastify';
import { Question } from '../types/model/Question';

const AnswerItem = ({ answer, question }: { answer: Answer, question: Question }) => {
    const queryClient = useQueryClient();
    const [isEditAnswer, setIsEditAnswer] = useState<boolean>(false);
    const [answerTi, setAnswerTi] = useState<string>(answer.answer);

    const { register, handleSubmit, formState: { isSubmitting, isValid, errors } } = useForm<AnswerSchema>({
        resolver: zodResolver(answerSchema)
    })

    const changeCorrectQuestionMutation = useMutation({
        mutationKey: ['changeCorrectQuestion', answer.id],
        mutationFn: async () => {
            return questionApi.chooseCorrectAnswer(answer.id)
        },
        onSuccess(data) {
            if(data.response) {
                queryClient.invalidateQueries('answerItem')
            }
        },
    })

    const editAnswerMutation = useMutation({
        mutationKey: ['editAnswer', answer.id],
        mutationFn: (answerTitle: string) => questionApi.editAnswer(answer.id, answerTitle),
        onSuccess(data) {
            if(data.response) {
                toast.success("Đã sửa câu hỏi")
                setAnswerTi(data.response.data.answer)
            }
            if(data.error) toast.error(data.error.response?.data.errorMessage ?? "Sửa câu hỏi thất bại")
        },
        onSettled() {
            setIsEditAnswer(false)
        }
    })

    function handleEditAnswer(e: React.MouseEvent) {
        e.stopPropagation()
        setIsEditAnswer(prev => !prev)
    }

    function handleChangeCorrect() {
        switch(question.questionType) {
            case 'SINGLE_CHOICE': {
                if(!answer.correct) {
                    changeCorrectQuestionMutation.mutate()
                } 
                break;
            }
            case 'MULTIPLE_CHOICE': {
                changeCorrectQuestionMutation.mutate()
                break;
            }
        }
    }

    const onSubmitAnswer: SubmitHandler<AnswerSchema> = async (values) => {
        editAnswerMutation.mutate(values.answer)
    }

    return (
        <div className='w-full rounded-md bg-slate-100 flex justify-start items-center gap-x-3
        px-3 py-2'>
            {
                !isEditAnswer && 
                <div className='flex flex-1 items-center justify-start gap-x-3'>
                    {
                        question.questionType === "SINGLE_CHOICE" &&
                        <input 
                            type="radio" 
                            id={answer.id}
                            name={question.question}
                            defaultChecked={ answer.correct }
                            onChange={handleChangeCorrect}
                        />
                    }
                    {
                        question.questionType === "MULTIPLE_CHOICE" &&
                        <input 
                            type="checkbox" 
                            id={answer.id}
                            name={question.question}
                            defaultChecked={ answer.correct }
                            onChange={handleChangeCorrect}
                        />

                    }
                    <label htmlFor={answer.id} className='break-all break-words'>
                        { answerTi ? answerTi : answer.answer }
                    </label>
                </div>
            }
            {
                isEditAnswer &&
                <form onSubmit={handleSubmit(onSubmitAnswer)} className='flex w-full gap-x-1'>
                    <input 
                        {...register('answer')}
                        data-tooltip-id={answer.id}
                        data-tooltip-content={errors.answer?.message}
                        type="text" 
                        autoComplete='off'
                        className='flex-1 outline-none border border-gray-400 rounded-md px-3'
                    />
                    <Tooltip id={answer.id} />
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
                        className='w-8 h-8 rounded-full grid place-items-center hover:bg-slate-300 cursor-pointer' 
                        onClick={handleEditAnswer}
                    >
                        <XIcon className='w-5 h-5'/>
                    </div>
                </form>
            }
            {
                !isEditAnswer &&
                <div className='w-8 h-8 rounded-full grid place-items-center hover:bg-slate-300 cursor-pointer' onClick={handleEditAnswer}>
                    <Edit3Icon className='w-5 h-5'/>
                </div>
            }
        </div>
    )
}

export default AnswerItem
