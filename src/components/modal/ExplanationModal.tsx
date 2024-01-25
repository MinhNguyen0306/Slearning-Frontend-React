import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../redux/store"
import { setExplanationModalState } from "../../redux/features/appState/appState.slice";
import { XCircleIcon } from 'lucide-react';
import { Button } from "../Button";
import { useMutation } from "react-query";
import { toast } from 'react-toastify';
import initialState from "../../redux/features/appState/appState.selector";
import questionApi from "../../api/modules/question.api";
import ReactQuill from "react-quill";
import { useState } from "react";

const ExplanationModal = () => {
    const dispatch = useDispatch();
    const { open, questionId, explanation } = useSelector((state: RootState) => state.appState.explanationModalState);
    const [changedExplanation, setChangedExplanation] = useState<string>("")

    const handleClose = () => {
        dispatch(setExplanationModalState(initialState.explanationModalState))
    }

    const mutation = useMutation({
        mutationFn: (changedExplanation: string) => questionApi.addExplanation(questionId, changedExplanation),
        onSuccess: (data) => {
            if(data.error) {
                toast.error(data.error.message);
            } else {
                handleClose()
                toast.success("Cập nhật thành công")
            }
        },
        onError: (error: Error) => {
            toast.error(error.message);
        }
    })

    async function handleSubmit() {
        const data = await mutation.mutateAsync(changedExplanation)
        if(data.response) {
            toast.success("Da them giai thich cau hoi")
        }
        if(data.error) {
            toast.error("Them that bai")
        }
        handleClose()
    }

    return (
        <>
            {
                open &&
                <div className='h-screen w-screen fixed z-[99999] inset-0 bg-gray-800 bg-opacity-50
                    grid place-items-center overflow-hidden'>
                    <div className='w-1/2 m-auto bg-white rounded-md border-[1px] border-gray-300 flex flex-col
                    justify-center items-center gap-2'>
                        <div className="self-end pt-2 pr-2 cursor-pointer">
                            <XCircleIcon className="hover:stroke-red-600" onClick={handleClose}/>
                        </div>

                        <div 
                            className='flex flex-col max-h-[500px] overflow-scroll gap-y-5 mb-8 w-full px-10
                            [&>div>label]:font-bold [&>div>label]:mb-2'
                        >
                            <div className="flex flex-col">
                                <label htmlFor="about">Giải thích câu hỏi</label>
                                <ReactQuill 
                                    defaultValue={explanation}
                                    value={changedExplanation}
                                    theme='snow' 
                                    placeholder='Nhập vao'
                                    className='mb-4 overflow-scroll whitespace-normal break-words break-all'
                                />
                            </div>
                            <Button type="button" variant='blueContainer' onClick={handleSubmit}>
                                Lưu
                            </Button>
                        </div>
                    </div>
                </div> 
            }
        </>
    )
}

export default ExplanationModal
