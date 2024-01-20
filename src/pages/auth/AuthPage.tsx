import { useState } from 'react'
import Logo from '../../components/Logo'
import AUTHSTATE from '../../constants/authState.constant';
import SigninForm from '../../components/auth/SigninForm';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import SignupForm from '../../components/auth/SignupForm';

const AuthPage = ({ authState }: {authState: string}) => {
    const [currentState, setCurrentState] = useState<string | undefined>(authState);
    const location = useLocation();
    const from = location.state?.from?.pathname || "/"
    const handleSwitchAuthState = (state: string) => setCurrentState(state);
    const user = useSelector((state: RootState) => state.user.user)

    return (
        <div className='w-1/3 p-8 m-auto bg-white rounded-md border-[1px] border-gray-300 flex flex-col
        gap-5 justify-center items-center mt-5'>
            <Logo />

            <div className=''>
                { currentState === AUTHSTATE.LOGIN_USER 
                    && <SigninForm switchAuthState={() => handleSwitchAuthState(AUTHSTATE.REGISTER_USER) } from={from}/> }
                { currentState === AUTHSTATE.REGISTER_USER 
                    && <SignupForm switchAuthState={() => handleSwitchAuthState(AUTHSTATE.LOGIN_USER) } from={from}/> }
            </div>
        </div>
    )
}

export default AuthPage
