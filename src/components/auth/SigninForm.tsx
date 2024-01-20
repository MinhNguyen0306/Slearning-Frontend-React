import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { Button } from '../../components/Button'
import GoogleSVG from "../../assets/Google.svg"
import GithubSVG from "../../assets/Github.svg"
import { SigninSchema, signinSchema } from '../../types/system/SigninSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from 'react-query';
import authApi from '../../api/modules/auth.api';
import { LoginRequest } from '../../types/payload/request/LoginRequest';
import { Tooltip } from 'react-tooltip';
import { toast } from 'react-toastify';
import Loading from '../popup/Loading';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/features/user/user.slice';
import { useNavigate } from 'react-router-dom';

const SigninForm = ({ switchAuthState, from }: { switchAuthState: () => void, from: string }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [visiblePassword, setVisiblePassword] = useState<boolean>(false)
    const { register, handleSubmit, formState: { errors } } = useForm<SigninSchema>({
        resolver: zodResolver(signinSchema)
    })

    const mutation = useMutation({
        mutationFn: (loginRequest: LoginRequest) => authApi.login(loginRequest),
        onSuccess: (data) => {
            if(data.response) {
                dispatch(setUser(data.response.data));
                navigate(from, { replace: true });
                toast.success("Đăng nhập thành công");
            } else if(data.error) {
                toast.error(data.error.message || "Loi Api");
            }
        },
        onError: (error: Error) => {
            toast.error(error.message)
        }
    })

    const onSubmit: SubmitHandler<SigninSchema> = async (values) => {
        mutation.mutate(values);
    }

    return (
        <>
            { mutation.isLoading && <Loading /> }
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5 w-full mt-2'>
                <input
                    data-tooltip-id='emailError'
                    data-tooltip-content={errors.email?.message}
                    {...register('email')}
                    type='email'
                    id='email'
                    name='email'
                    placeholder='Email'
                    className='h-[40px] px-3 py-2 border-[1px] border-gray-500 rounded-sm outline-[1px] outline-gray-800'
                />
                {errors.email && <Tooltip id='emailError' />}

                <div className='relative h-[40px] border-[1px] border-gray-500 rounded-sm'>
                    <input
                        data-tooltip-id='passwordError'
                        data-tooltip-content={errors.password?.message}
                        {...register('password')}
                        type={visiblePassword ? 'text' : 'password'}
                        id='password'
                        name='password'
                        placeholder='Mật khẩu'
                        className='w-full h-full pl-3 pr-12 py-2 bg-transparent'
                    />
                    {errors.password && <Tooltip id='passwordError' content={errors.password.message}/>}

                    <div 
                        className='absolute right-1 top-1/2 -translate-y-1/2 p-1 cursor-pointer text-gray-600'
                        onClick={() => setVisiblePassword(prev => !prev)}
                    >
                        {visiblePassword ? <EyeIcon /> : <EyeOffIcon />}
                    </div>
                </div>

                <div className='flex flex-col items-center justify-start'>
                    <Button type='submit' variant='blueContainer' rounded='sm' className='w-full'>
                        Đăng nhập
                    </Button>
                    <span className='self-end text-secondColor mt-3 text-sm hover:text-blue-900 cursor-pointer'>
                        Quên mật khẩu
                    </span>
                    <span className='relative h-[1px] w-full bg-gray-300 text-gray-400 my-8 grid place-items-center'>
                        <span className='absolute left-1/2 -translate-x-1/2 bg-white px-3 py-2 text-center'>
                            Hoặc
                        </span>  
                    </span>
                    <div className='w-full grid grid-cols-2 gap-3'>
                        <Button variant='ghost' rounded='sm' className='border-2 border-transparent hover:border-black'>
                            <span className='flex items-center justify-center text-sm'>
                                <img src={GithubSVG} alt='Github SVG' className='w-8 h-8 mr-2'/>
                                Github
                            </span>
                        </Button>
                        <Button variant='ghost' rounded='sm' className='border-2 border-transparent hover:border-black'>
                            <span className='flex items-center justify-center text-sm'>
                                <img src={GoogleSVG} alt='Google SVG' className='w-8 h-8 mr-2'/> 
                                Google
                            </span>
                        </Button>
                    </div>

                    <span className='mt-5'>
                        Bạn chưa có tài khoản? 
                        <span 
                            className='text-secondColor hover:text-blue-800 hover:underline underline-offset-4 cursor-pointer font-bold' 
                            onClick={switchAuthState}
                        >
                            Đăng ký
                        </span>
                    </span>
                </div>
            </form>
        </>
    )
}

export default SigninForm
