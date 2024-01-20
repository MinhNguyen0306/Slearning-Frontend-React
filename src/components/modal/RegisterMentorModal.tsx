import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../redux/store"
import { setAuthModalOpen } from "../../redux/features/appState/appState.slice";
import Logo from "../Logo";
import { XCircleIcon } from 'lucide-react';

const RegisterMentorModal = () => {
    const dispatch = useDispatch();
    const authModalOpen = useSelector((state: RootState) => state.appState.authModalOpen);

    const handleClose = () => dispatch(setAuthModalOpen(false))

    return (
        <>
            {
                authModalOpen &&
                <div className='h-screen w-screen fixed z-[99999] top-0 left-0 bg-gray-800 bg-opacity-50
                    grid place-items-center overflow-hidden'>
                    <div className='w-1/3 m-auto bg-white rounded-md border-[1px] border-gray-300 flex flex-col
                    justify-center items-center gap-2'>
                        <div className="self-end pt-2 pr-2 cursor-pointer">
                            <XCircleIcon className="hover:stroke-red-600" onClick={handleClose}/>
                        </div>
        
                        <Logo />
        
                        <form className='mb-8'>
                            <div>
                                
                            </div>
                        </form>
                    </div>
                </div> 
            }
        </>
    )
}

export default RegisterMentorModal
