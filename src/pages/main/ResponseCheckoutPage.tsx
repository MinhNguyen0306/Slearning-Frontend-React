import { useEffect } from "react";
import successpng from "../../assets/success.png";
import useQueryString from "../../hooks/useQueryString"
import { Button } from "../../components/Button";
import paymentApi from "../../api/modules/payment.api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const ResponseCheckoutPage = () => {
    const navigate = useNavigate();
    const { vnp_Amount, 
            vnp_BankCode, 
            vnp_BankTranNo, 
            vnp_CardType, 
            vnp_OrderInfo, 
            vnp_PayDate, 
            vnp_ResponseCode,
            vnp_SecureHash, 
            vnp_TmnCode, 
            vnp_TransactionNo, 
            vnp_TransactionStatus, 
            vnp_TxnRef 
    } = useQueryString();
    const user = useSelector((state: RootState) => state.user.user);
    
    const requestPayment = async () => {
        const { response, error } = await paymentApi.createVnpayPayment({
            vnp_Amount,
            vnp_BankCode, 
            vnp_BankTranNo, 
            vnp_CardType,
            vnp_OrderInfo, 
            vnp_PayDate, 
            vnp_ResponseCode , 
            vnp_SecureHash, 
            vnp_TmnCode, 
            vnp_TransactionNo, 
            vnp_TransactionStatus, 
            vnp_TxnRef,
        });
        if(response) {
            console.log(response)
        }
        if(error) toast.error(error.message)
    }

    const resolvePaymentAdmin = async () => {
        const { response, error } = await paymentApi.resolveAdminVnpayPayment({
            vnp_Amount,
            vnp_BankCode, 
            vnp_BankTranNo, 
            vnp_CardType,
            vnp_OrderInfo, 
            vnp_PayDate, 
            vnp_ResponseCode , 
            vnp_SecureHash, 
            vnp_TmnCode, 
            vnp_TransactionNo, 
            vnp_TransactionStatus, 
            vnp_TxnRef,
        });
        if(response) {
            console.log(response)
        }
        if(error) toast.error(error.message)
    }

    function checkRole() {
        const checkRole = user.roles.some(role => role.role === 'admin')
        return checkRole;
    }

    useEffect(() => {
        if(checkRole()) {
            resolvePaymentAdmin()
        } else {
            requestPayment()
        }
    }, [])

    return (
        <div className="w-full h-[calc(100vh-80px)] flex justify-between items-center">
            <div className="flex flex-col gap-y-10">
                {
                    vnp_ResponseCode == '00' 
                        ?   <div>
                                <span className="font-bold text-5xl">Giao dịch thành công</span>
                                <p className="mt-3 text-lg">
                                    {
                                        !checkRole()
                                            ? "Bạn đã thực hiện thành công giao dịch. Chuyển đến phần khóa học đã mua hoặc quay về trang chủ!"
                                            : "Bạn đã thanh toán cho người dạy. Tiếp tục xử lý thanh toán hoặc quay về trang chính!"
                                    }
                                </p>
                            </div>
                        :   <span className="font-bold text-5xl">Giao dịch thất bại</span>
                }
                <div className="flex items-center gap-x-5">
                    {
                        checkRole()
                            ?   <Button variant='blueContainer' rounded='md' onClick={() => navigate("/admin/users", { replace: true })}>
                                    Về trang chính
                                </Button>
                            :    <Button variant='blueContainer' rounded='md' onClick={() => navigate("/", { replace: true })}>
                                    Về trang chủ
                                </Button>
                    }
                    {
                        checkRole()
                            ?   <Button variant='blueContainer' rounded='md' onClick={() => navigate("/admin/payments", { replace: true })}>
                                    Tiếp tục thanh toán
                                </Button>
                            :    <Button variant='blueContainer' rounded='md' onClick={() => navigate("/learner/my-learning", { replace: true })}>
                                    Xem khóa học
                                </Button>
                    }
                </div>
            </div>
            <div className="px-5">
                <img src={vnp_ResponseCode == '00' ? successpng : "https://static.vecteezy.com/system/resources/thumbnails/016/458/226/small/fail-3d-word-text-png.png"} alt="" />
            </div>
        </div>
    )
}

export default ResponseCheckoutPage
