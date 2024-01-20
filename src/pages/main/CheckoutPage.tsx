import { useEffect, useState } from 'react';
import { Button } from '../../components/Button';
import paymentApi from '../../api/modules/payment.api';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import courseApi from '../../api/modules/course.api';
import useQueryString from '../../hooks/useQueryString';
import { getImage } from '../../util/utils';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { courseId } = useQueryString();
    const userId = useSelector((user: RootState) => user.user.user.id)
    const from = useLocation().state.from;

    const [method, setMethod] = useState<"vnpay" | "momo">('vnpay')

    const courseCheckoutQuery = useQuery({
        queryKey: ['courseCheckout', courseId],
        queryFn: async () => {
            if(courseId) {
                const { response, error } = await courseApi.getById(courseId);
                if(response) {
                    return response.data
                } else {
                    toast.error(error.message)
                }
            } else {
                toast.error("Khong the lay ID khoa hoc")
                navigate(from, { replace: true })
            }
        }
    })

    const handlePayment = async () => {
        try {
            if(!courseCheckoutQuery.data) {
                navigate(from, { replace: true })
            } else {
                if(method === 'vnpay') {
                    const { response, error } = await paymentApi.vnpay(courseCheckoutQuery.data.price, courseId, userId)
                    if(response) {
                        window.location.href = response.data
                    } else {
                        toast.error(error.message)
                    }
                }
            }
        } catch (error) {
            toast.error("Loi he thong")
        }
    }

    useEffect(() => {
        if(!userId) navigate("/auth", { replace: true })
        if(!courseId) navigate(from, { replace: true })
    }, [])

    return (
        <div className='w-full h-[1000px] p-10'>
            <div className='flex w-full'>
                {/* Left content */}
                <div className='flex-1 flex flex-col gap-y-10 items-start justify-start px-10 py-20 bg-white'>
                    <h1 className='font-bold text-3xl'>Checkout</h1>
                    <div className='flex flex-col gap-y-2 w-full x'>
                        <h2 className='font-bold text-xl mb-2'>
                            Chon phuong thuc thanh toan
                        </h2>
                        <div className='w-full flex gap-x-3 border border-gray-500 rounded-lg px-2 py-1 bg-blue-50'>
                            <input type="radio" id='vnpay' name='method' defaultChecked onChange={() => setMethod("vnpay")} />
                            <label htmlFor="vnpay" className='flex-1'>
                                <img 
                                    src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Icon-VNPAY-QR.png" 
                                    alt="VNpay logo"
                                    className='w-[35px] h-[35px] inline-block mr-3' 
                                />
                                <span className='inline-block font-bold'>VNPAY</span>
                            </label>
                        </div>
                        <div className='w-full flex gap-x-3 border border-gray-500 rounded-lg px-2 py-1 bg-blue-50'>
                            <input type="radio" id='momo' name='method' onChange={() => setMethod('momo')}/>
                            <label htmlFor="momo" className='flex-1'>
                                <img 
                                    src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" 
                                    alt="Momo logo"
                                    className='w-[35px] h-[35px] inline-block mr-3' 
                                />
                                <span className='inline-block font-bold'>MOMO</span>
                            </label>
                        </div>
                    </div>
                    <div className='flex flex-col gap-y-2 w-full'>
                        <h2 className='font-bold mb-2 text-xl'>
                            Thông tin chi tiết giao dịch
                        </h2>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-x-2">
                                <img src={getImage(courseCheckoutQuery.data?.image?.url ?? "")} alt="" className="max-w-[10%] rounded-sm" />
                                <span className="max-w-[50%] overflow-hidden text-ellipsis font-semibold whitespace-nowrap">
                                    { courseCheckoutQuery.data?.title }
                                </span>
                            </div>
                            <span className='whitespace-nowrap'>{ courseCheckoutQuery.data?.price } VNĐ</span>
                        </div>
                    </div>
                </div>
                {/* End left content */}

                {/* Right content */}
                <div className='flex-1 flex flex-col gap-y-5 items-start justify-start bg-gray-200 px-10 py-20'>
                    <div className='flex flex-col gap-y-3 w-1/2 '>
                        <h2 className='font-bold text-2xl mb-5'>Tổng kết thanh toán</h2>
                        <div className='flex justify-between items-center'>
                            <span>Giá gốc:</span>
                            <span>{ courseCheckoutQuery.data?.price } VNĐ</span>
                        </div>
                        <i className='w-full h-[1px] bg-black'></i>
                        <div className='flex justify-between items-center mb-5'>
                            <span className='font-bold text-lg'>Tổng cộng:</span>
                            <span className='font-bold'>{ courseCheckoutQuery.data?.price } VNĐ</span>
                        </div>
                        <Button variant='blueContainer' rounded='sm' size='lg' className='w-full' onClick={handlePayment}>
                            Hoàn tất thanh toán
                        </Button>
                    </div>
                </div>
                {/* End right content */}
            </div>
        </div>
    )
}

export default CheckoutPage
