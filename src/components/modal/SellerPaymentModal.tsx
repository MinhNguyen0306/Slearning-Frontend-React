import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../redux/store"
import { useState } from "react"
import { Button } from "../Button"
import { XCircleIcon } from "lucide-react"
import { setSellerPaymentModalOpen } from "../../redux/features/appState/appState.slice"
import { useMutation } from "react-query"
import paymentApi from "../../api/modules/payment.api"
import { toast } from "react-toastify"

const SellerPaymentModal = () => {
    const dispatch = useDispatch();
    const openState = useSelector((state: RootState) => state.appState.sellerPaymentModalOpen)
    const user = useSelector((state: RootState) => state.user.user)
    const [paymentType, setPaymentType] = useState<'all' | 'part'>('all')
    const [amount, setAmount] = useState<number>()

    const mutation = useMutation({
        mutationKey: ['withdrawMoney', user.id],
        mutationFn: (amount: number) => paymentApi.withdrawMoney(user.id, amount),
        onSuccess(data) {
            if(data.response) toast.success("Đã gửi yêu cầu rút tiền")
            if(data.error) toast.error(data.error.response?.data.errorMessage ?? "Yêu cầu rút tiền thất bại")
            handleClose()
        },
        onError(error: Error) {
            toast.error(error.message)
        }
    })

    function handleWithdrawMoney() {
        switch (paymentType) {
            case 'all': {
                mutation.mutate(user.accountBalance.userBalance)
                break;
            }
            case 'part': {
                if(!amount) toast.warn("Bạn chưa nhập số tiền cần rút")
                else if(amount < 1000) toast.warn("Số tiền rút ít nhất là 1000")
                else if(amount > user.accountBalance.userBalance) toast.warn("Số dư không đủ")
                else mutation.mutate(amount)
                break;
            }
        }
    }

    function handleChangePaymentType() {
        if(paymentType === 'all') {
            setPaymentType('part')
        } else {
            setPaymentType('all')
        }
    }

    function handleClose() {
        dispatch(setSellerPaymentModalOpen(false))
        setAmount(undefined)
        setPaymentType('all')
    }

    return (
        <>
            {
                openState &&
                <div className="h-screen w-screen fixed z-[99999] inset-0 bg-gray-800 bg-opacity-50
                grid place-items-center overflow-hidden">
                    <div className="w-1/4 m-auto bg-white rounded-md border-[1px] border-gray-300 flex flex-col
                    justify-center items-center gap-y-5 px-5  pb-5">
                        <div className="self-end pt-3 cursor-pointer">
                            <XCircleIcon className="hover:stroke-red-600" onClick={handleClose}/>
                        </div>

                        <Button variant={'light'} rounded={'md'} onClick={handleChangePaymentType} className="w-full">
                            { paymentType === 'all' ? "Tất cả số dư" : "Một phần" }
                        </Button>
                        {
                            paymentType !== 'all' &&
                            <input 
                                type="number"
                                placeholder="Nhập số tiền cần rút"
                                className="px-3 py-2 border border-gray-300 rounded-md outline-none w-full" 
                                onChange={(e) => setAmount(Number(e.target.value))}
                            />
                        }
                        <Button variant={'blueContainer'} rounded={'md'} className="w-full" onClick={handleWithdrawMoney}>
                            Gửi yêu cầu
                        </Button>
                    </div>
                </div>
            }
        </>
    )
}

export default SellerPaymentModal
