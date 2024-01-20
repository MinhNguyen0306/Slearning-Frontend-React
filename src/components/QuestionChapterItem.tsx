import { ChevronDownIcon, Loader2Icon } from 'lucide-react'
import { useState } from 'react'
import { Button } from './Button'
import { cn } from '../util/utils'
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod'
import QuestionItem from './QuestionItem'
import { Tooltip } from 'react-tooltip'
import { useMutation, useQueryClient } from 'react-query'
import questionApi from '../api/modules/question.api'
import { Chapter } from '../types/model/Chapter'
import { toast } from 'react-toastify'
import { QuestionSchema, questionSchema } from '../types/zod/QuestionSchema'
import { QuestionType } from '../types/payload/enums/QuestionType';

const QuestionChapterItem = ({ chapter }: { chapter: Chapter }) => {
    const queryClient = useQueryClient();
    const [isExpand, setIsExpand] = useState<boolean>(false);
    const [isAddingAnswer, setIsAddingAnswer] = useState<boolean>(false);
    const [questionType, setQuestionType] = useState<QuestionType>(QuestionType.SINGLE_CHOICE);

    const { register, handleSubmit, formState: { isValid, isSubmitting, errors } } = useForm<QuestionSchema>({
        resolver: zodResolver(questionSchema)
    })

    const mutationCreateQuestion = useMutation({
        mutationFn: ({ question, answers }: {question: string, answers: string[]}) => questionApi.create(chapter.id, question, questionType, answers),
        onSuccess(data) {
            if(data.response) {
                queryClient.invalidateQueries("courseCreating")
                setIsExpand(false)
                setIsAddingAnswer(false)
                toast.success("Đã tạo câu hỏi");
            } else {
                toast.error(data.error.response?.data.errorMessage ?? "Tạo câu hỏi thất bại")
            }
        },
        onError(error: Error) {
            toast.error(error.message)
        }
    })

    const onSubmitQuestion: SubmitHandler<QuestionSchema> = async(values) => {
        console.log(values)
        let answers: string[] = []
        if(questionType === 'SHORT_ANSWER') {
            answers = [values.answer1]
        } else {
            answers = [values.answer1, values.answer2]
        }
        const submitData = { question: values.question, answers }
        mutationCreateQuestion.mutate(submitData)
    }

    function handleAddingAnswer(e: React.MouseEvent<HTMLButtonElement>) {
        e.stopPropagation()
        setIsExpand(prev => !prev)
        setIsAddingAnswer(prev => !prev)
    }

    function handleExpand() {
        setIsExpand(prev => !prev)
        setIsAddingAnswer(false)
    }

    function handleChangeQuestionType() {
        switch(questionType) {
            case QuestionType.SINGLE_CHOICE:
                setQuestionType(QuestionType.MULTIPLE_CHOICE)
                break;
            case QuestionType.MULTIPLE_CHOICE:
                setQuestionType(QuestionType.SHORT_ANSWER)
                break;
            case QuestionType.SHORT_ANSWER:
                setQuestionType(QuestionType.SINGLE_CHOICE)
                break;
        }
    }

    return (
        <div className='relative bg-white border-[1px] border-gray-300 rounded-md'>
            <div 
                className={cn('flex justify-between items-center py-2 px-5 border-b-[1px] border-gray-300 bg-gray-200',
                'cursor-pointer', {
                    "border-none": isExpand === false
                })}
                onClick={handleExpand}
            >
                <div className='h-full flex items-center justify-start gap-3 flex-1'>
                    <span className='font-semibold'>
                        Chương { chapter.position }.
                    </span>
                    <span className='flex-1'>
                        { chapter.title }
                    </span>
                </div>
                <div className='flex items-center justify-end gap-5'>
                    <Button variant='blueOutline' rounded='lg' onClick={handleAddingAnswer}>
                        Thêm câu hỏi
                    </Button>
                    <ChevronDownIcon className={cn('transition-transform duration-500',{
                        "rotate-180": isExpand
                        })}
                        onClick={handleExpand}
                    />
                </div>
            </div>

            <form 
                onSubmit={handleSubmit(onSubmitQuestion)} 
                className={cn('flex flex-col px-5 my-5 gap-3', {
                    "hidden": !isAddingAnswer
                })}
            >
                <input
                    {...register('question')}
                    data-tooltip-id='question'
                    data-tooltip-content={errors.question?.message}
                    type='text'
                    placeholder='Nhập câu hỏi'
                    disabled={isSubmitting}
                    autoComplete='off'
                    className='w-full py-2 px-5 outline-none border-[1px] border-gray-300 rounded-md'
                />
                <Tooltip id='question' />

                <input
                    {...register('answer1')}
                    data-tooltip-id='answer1'
                    data-tooltip-content={errors.answer1?.message}
                    type='text'
                    placeholder='Nhập câu trả lời 1'
                    disabled={isSubmitting}
                    autoComplete='off'
                    className='w-full py-2 px-5 outline-none border-[1px] border-gray-300 rounded-md'
                />
                <Tooltip id='answer1' />

                {
                    questionType !== 'SHORT_ANSWER' &&
                    <div>
                         <input
                            {...register('answer2')}
                            data-tooltip-id='answer2'
                            data-tooltip-content={errors.answer2?.message}
                            type='text'
                            placeholder='Nhập câu trả lời 2'
                            disabled={isSubmitting}
                            autoComplete='off'
                            className='w-full py-2 px-5 outline-none border-[1px] border-gray-300 rounded-md'
                        />
                        <Tooltip id='answer2' />
                    </div>
                }

                <div className='flex justify-between items-center'>
                    <Button type='button' rounded='md'variant='light' onClick={handleChangeQuestionType}>
                        {
                            questionType === 'SINGLE_CHOICE'
                                ?   "Lựa chọn duy nhất"
                                :   questionType === "MULTIPLE_CHOICE"
                                    ?   "Nhiều lựa chọn"
                                    :   "Điền câu trả lời"
                        }
                    </Button>
                    <Button disabled={questionType !== 'SHORT_ANSWER' && (isSubmitting || !isValid)} type='submit' rounded='md'>
                        { mutationCreateQuestion.isLoading ? <Loader2Icon className='animate-spin' />: <span>Lưu</span> }
                    </Button>
                </div>
            </form>

            <ul className={cn('w-full flex flex-col gap-2 items-center justify-start list-none p-5 transition-all duration-500', {
                "hidden": isExpand === false
            })}>
                {
                    chapter.questions.map((question, index) => (
                        <li key={index} className='w-full'>
                            <QuestionItem question={question} />
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}

export default QuestionChapterItem
