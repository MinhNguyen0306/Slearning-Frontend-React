import { useLocation, useNavigate } from 'react-router-dom';
import { learnerMenu } from '../constants/usermenu.constant';
import { Button } from './Button';
import Logo from './Logo'
import SearchBox from './SearchBox'
import { MailCheck, Bell, ChevronRightIcon, LogOutIcon } from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { logout } from '../redux/features/user/user.slice';
import { getImage } from '../util/utils';
import { useQuery } from 'react-query';
import categoryApi from '../api/modules/category.api';
import { toast } from 'react-toastify';

type Props = {
    role: 'admin' | 'instructor' | 'learner',
    isLoggin?: boolean
}

const Header = ({ role }: Props) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const { user, isAuthenticated } = useSelector((state: RootState) => state.user);

    const categoriesQuery = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const { response, error } = await categoryApi.getAll();
            if(response) return response.data
            if(error) {
                toast.error(error.response?.data.errorMessage ?? "Error when fetch categories");
                return Promise.reject();
            }
        },
        onError(error: Error) {
            toast.error(error.message ?? "Error when fetch categories");
        }
    })

    const subCategoriesQuery = useQuery({
        queryKey: ['subCategories'],
        queryFn: async () => {
            const { response, error } = await categoryApi.getAllSubCategories();
            if(response) return response.data
            if(error) {
                toast.error(error.response?.data.errorMessage ?? "Error when fetch subCategories");
                return Promise.reject();
            }
        },
        onError(error: Error) {
            toast.error(error.message ?? "Error when fetch subCategories");
        }
    })

    const topicsQuery = useQuery({
        queryKey: ['topics'],
        queryFn: async () => {
            const { response, error } = await categoryApi.getAllTopics();
            if(response) return response.data
            if(error) {
                toast.error(error.response?.data.errorMessage ?? "Error when fetch topics");
                return Promise.reject();
            }
        },
        onError(error: Error) {
            toast.error(error.message ?? "Error when fetch topics");
        }
    })

    function handleLogout() {
        dispatch(logout())
    }

    return (
        <nav className='w-full h-[80px] fixed left-0 top-0 border-b-2 shadow-shadowBottom z-[9999] bg-white'>
            <div className='w-[95%] h-full mx-auto flex gap-24 justify-between items-center'>
                {/* Left Header */}
                <div className='flex flex-2 justify-start gap-7'>
                    <Logo />

                    {/* Category Dropdown */}
                    {
                        role === 'learner' && (
                            <div className='relative w-fit h-full cursor-pointer text-sm group'>
                                <span className='px-5 leading-[80px] hover:text-secondColor'>Danh mục</span>
                                <div className='absolute top-[calc(100%+5rem)] mt-1 left-0 w-[200%] max-w-[300px] invisible opacity-0 transition-all 
                                duration-500 rounded-md border-[1px] border-gray-300 bg-white group-hover:opacity-100
                                group-hover:visible group-hover:top-[calc(100%+0.25rem)]'>
                                    <ul className='flex flex-col cursor-pointer'>
                                        {
                                            categoriesQuery.data?.content.map((category, _) => (
                                                <li key={category.id} className='relative sub-dropdown'>
                                                    <div className='flex items-center justify-between px-3 py-2'>
                                                        <span>
                                                            {category.title}
                                                        </span>
                                                        <ChevronRightIcon className='w-5 h-5' />
                                                    </div>
                                                    <ul className='absolute w-full border-[1px] border-gray-300 bg-white rounded-md
                                                    top-[calc(100%+5rem)] left-[calc(100%+0.25rem)] invisible opacity-0 transition-all duration-500
                                                    sub-dropdown-content'>
                                                        {
                                                            subCategoriesQuery.data?.content.filter(sub => sub.category.id === category.id).map((subcategory, _) => (
                                                                <li key={subcategory.id} className='relative sub-dropdown'>
                                                                    <div className='flex items-center justify-between px-3 py-2'>
                                                                        <span>
                                                                            {subcategory.title}
                                                                        </span>
                                                                        <ChevronRightIcon className='w-5 h-5' />
                                                                    </div>
                                                                    <ul className='absolute w-full border-[1px] border-gray-300 bg-white rounded-md
                                                                    top-[calc(100%+5rem)] left-[calc(100%+0.25rem)] invisible opacity-0 transition-all duration-500
                                                                    sub-dropdown-content'>
                                                                        {
                                                                            topicsQuery.data?.content.filter(topic => topic.subCategory.id === subcategory.id).map((topic, itopic) => (
                                                                                <li key={itopic}>
                                                                                    <div className='flex items-center justify-between px-3 py-2 hover:text-secondColor'>
                                                                                        <span>
                                                                                            {topic.title}
                                                                                        </span>
                                                                                        <ChevronRightIcon className='w-5 h-5' />
                                                                                    </div>
                                                                                </li>
                                                                            ))
                                                                        }
                                                                    </ul>
                                                                </li>
                                                            ))
                                                        }
                                                    </ul>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </div>
                            </div>
                        )
                    }
                    {/* End Category Dropdown */}
                </div>
                {/* End Left Header */}

                {/* Search Box */}
                {
                    role === 'learner' && <SearchBox />
                }
                {/* End Search Box */}

                {/* Right Header */}
                <ul className='flex flex-2 items-center justify-end gap-x-5 list-none cursor-pointer'>
                    {
                        isAuthenticated ? (
                            <li>
                                <ul className='flex items-center justify-end gap-x-5'>
                                    {
                                        role !== 'admin' && role === 'learner' && (
                                            <Button
                                                variant='warning'
                                                rounded='strong' 
                                                font='semibold'
                                                onClick={() => isAuthenticated && user.id && user.instructor
                                                    ? navigate("/instructor/courses/publishing") 
                                                    : navigate("/learner/profile")
                                                }
                                            >
                                                Trang người dạy
                                            </Button>
                                        )
                                    }
                                    <li className='hover:text-secondColor'>
                                        <MailCheck />
                                    </li>
                                    <li>
                                        <div className='relative hover:text-secondColor'>
                                            <Bell />
                                            <div 
                                                className=' absolute -top-1/2 -right-1 text-white bg-blue-500 rounded-full
                                                w-5 h-5 text-sm text-center'
                                            >
                                                0
                                            </div>
                                        </div>
                                    </li>
                                    <li className='relative group w-[40px] h-[40px] bg-black rounded-full text-center leading-[40px] font-extrabold text-white border-2'>
                                        {
                                            !user.avatar?.url
                                                ?   <span>{ user.fullName?.charAt(0) }</span>
                                                :   <img src={getImage(user.avatar ? user.avatar.url : "")} alt="" className='w-full h-full object-cover rounded-full'/>
                                        }
                                        <div className="absolute top-[calc(100%+5rem)] right-0 mt-1 z-50 py-2 rounded-md invisible opacity-0
                                            bg-white shadow-md shadow-gray-300 group-hover:visible group-hover:opacity-100 group-hover:top-full
                                            transition-all duration-500">
                                            <ul className='flex flex-col text-textColor font-normal text-sm'>
                                                {
                                                    learnerMenu.map((item, index) => (
                                                        <li key={index} onClick={() => item.path ? navigate(item.path) : null}>
                                                            <div className='flex items-center gap-2 cursor-pointer hover:bg-blue-100 px-4 py-3'>
                                                                <item.icon className='w-5 h-5 text-gray-500'/>
                                                                <span className='text-left whitespace-nowrap'>
                                                                    {item.display}
                                                                </span>
                                                            </div> 
                                                        </li>
                                                    ))
                                                }

                                                <li onClick={handleLogout}>
                                                    <div className='flex items-center gap-2 cursor-pointer hover:bg-blue-100 px-4 py-3'>
                                                        <LogOutIcon className='w-5 h-5 text-gray-500'/>
                                                        <span className='text-left whitespace-nowrap'>
                                                            Đăng xuất
                                                        </span>
                                                    </div> 
                                                </li>
                                            </ul>
                                        </div>
                                    </li>
                                </ul>
                            </li>
                        ) : (
                            <li>
                                <ul className='flex gap-x-6 justify-end'>
                                    {
                                        role !== 'admin' && role === 'learner' && (
                                            <Button
                                                variant='warning'
                                                rounded='strong' 
                                                font='semibold'
                                                onClick={() => navigate("/instructor/profile")}
                                            >
                                                Trang người dạy
                                            </Button>
                                        )
                                    }
                                    {
                                        role !== 'admin' && role === 'instructor' && (
                                            <Button 
                                                variant='warning'
                                                rounded='strong'
                                                font='semibold'
                                                onClick={() => navigate("/")}
                                            >
                                                Trang người học
                                            </Button>
                                        )
                                    }

                                    <Button rounded='md' onClick={() => navigate('auth', { state: { from: location }, replace: true})}>
                                        Đăng nhập
                                    </Button>
                                </ul>
                            </li>
                        )
                    }
                </ul>
                {/* End Right Header */}
            </div>
        </nav>
    )
}

export default Header