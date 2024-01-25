import { ArrowLeftIcon, ArrowRightIcon, ArrowUpIcon, CheckCircle2Icon, Loader2Icon, PlayCircleIcon } from "lucide-react"
import CodeEditorWindow from "../../components/common/CodeEditorWindow"
import { useState } from "react";
import { LanguageOption, languageOptions } from "../../constants/languageOptions";
import { Button } from "../../components/Button";
import { cn } from "../../util/utils";
import axios from "axios";
import { toast } from "react-toastify";
import OutputWindow from "../../components/common/OutputWindow";
import { useMutation, useQuery } from "react-query";
import codingApi from "../../api/modules/coding.api";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import CodingActionContent from "../../components/common/learning/CodingActionContent";

const CodingExercisePage = () => {
    const { exId } = useParams()
    const user = useSelector((state: RootState) => state.user.user)

    const [code, setCode] = useState<string>("");
    const [theme, setTheme] = useState<string>("vs-dark");
    const [language, setLanguage] = useState<LanguageOption>(languageOptions[0]);
    const [customInput, setCustomInput] = useState("");
    const [outputDetails, setOutputDetails] = useState<any>(null);
    const [processing, setProcessing] = useState<boolean>(false);
    const [lineCount, setLineCount] = useState<number>();
    const [expandOutput, setExpandOutput] = useState<boolean>(false);
    const [guideExpand, setGuideExpand] = useState<boolean>(true);

    const exQuery = useQuery({
        queryKey: ['exQuery'],
        queryFn: async () => {
            if(exId) {
                const { response, error } = await codingApi.getById(Number(exId))
                if(response) return response.data
                if(error) return Promise.reject()
            } else {
                return Promise.reject()
            }
        }
    })

    const trackingQuery = useQuery({
        queryKey: ['trackingQuery', user.id, exId],
        queryFn: async () => {
            if(exId) {
                const { response, error } = await codingApi.getTrackingExOfUser(user.id, Number(exId));
                if(response) return response.data
                if(error) return Promise.reject()
            } else {
                return Promise.reject()
            }
        }
    })

    const updateUserCoding = useMutation({
        mutationKey: ['updateUserCoding'],
        mutationFn: async () => {
            if(trackingQuery.data) {
                return codingApi.updateUserCoding(trackingQuery.data.id, code)
            } else {
                return Promise.reject()
            }
        }
    })

    const handleCompile = async () => {
        setProcessing(true);
        const codeExcuted = exQuery.data?.evaluation + "\r\n\n" + code;

        const options = {
            method: 'POST',
            url: 'https://judge0-ce.p.rapidapi.com/submissions',
            params: {
                base64_encoded: 'true',
                fields: '*'
            },
            headers: {
                'content-type': 'application/json',
                'Content-Type': 'application/json',
                'X-RapidAPI-Key': 'f67425d6eamsh04a78c52a9182a1p17bb04jsn4b1c58cd1f97',
                'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
            },
            data: {
                language_id: language.id,
                source_code: btoa(codeExcuted),
                stdin: btoa(customInput),
            }
        };

        try {
            const response = await axios.request(options);
            console.log(response.data);
            if(response.data) {
                checkStatus(response.data.token)
            }
        } catch (error) {
            console.error(error);
        }
    };

    const checkStatus = async (token: string) => {
        const options = {
            method: 'GET',
            url: `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
            params: {
                base64_encoded: 'true',
                fields: '*'
            },
            headers: {
                'X-RapidAPI-Key': 'f67425d6eamsh04a78c52a9182a1p17bb04jsn4b1c58cd1f97',
                'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
            }
        };
        try {
            let response = await axios.request(options);
            let statusId = response.data.status?.id;
        
            // Processed - we have a result
            if (statusId === 1 || statusId === 2) {
                // still processing
                setTimeout(() => {
                checkStatus(token)
                }, 2000)
                return;
            } else {
                setProcessing(false)
                setOutputDetails(response.data)
                setExpandOutput(true)
                // toast.success(`Thực thi thành công!`)
                console.log('response.data', response.data)
                return;
            }
        } catch (err) {
            console.log("err", err);
            setProcessing(false);
            toast.error("Thuc thi loi")
        }
    };

    const onChange = (action: string, data: string) => {
        switch (action) {
          case "code": {
            setCode(data);
            updateUserCoding.mutate()
            break;
          }
          default: {
            console.warn("case not handled!", action, data);
          }
        }
    };

    return (
        <div className="flex flex-col">
            <div className="flex border-b border-b-gray-300">
                <div className={cn("flex flex-col bg-white transition-all duration-300", {
                    "w-[40%] opacity-100": guideExpand,
                    "w-0 opacity-0 overflow-hidden whitespace-nowrap": !guideExpand
                })}>
                    <div className="px-5 border-b border-b-gray-300 flex justify-between items-center">
                        <span className="text-sm py-2 shadow-[inset_0px_-4px_0px_0px_rgba(0,0,0,0.75)]">
                            Hướng dẫn
                        </span>
                        <ArrowLeftIcon 
                            className="stroke-gray-500 stroke-[1.25px] cursor-pointer"
                            onClick={() => setGuideExpand(prev => !prev)}
                        />
                    </div>
                    <div className="w-full p-5 flex flex-col gap-y-5 overflow-y-scroll overflow-x-hidden break-words break-all
                    text-sm">
                        <h1 className="font-semibold text-lg">{ exQuery.data?.title }</h1>
                        <p dangerouslySetInnerHTML={{ __html: exQuery.data ? exQuery.data.instruction : "" }} />
                        <div className="border border-gray-300 p-3 flex flex-col text-left break-words bg-sky-50">
                            <h3 className="text-sm mb-2">Chủ đề này được đề cập trong</h3>
                            <span className="text-mainColor hover:text-blue-800 font-semibold">
                                Bài giảng số {exQuery.data?.lecture.position}: {exQuery.data?.lecture.title}
                            </span>
                        </div>
                    </div>  
                </div>
                <div className={cn("relative duration-300 transition-all bg-gray-900", {
                    'w-[60%]': guideExpand,
                    'w-full': !guideExpand
                })}>
                    <div className="bg-gray-900 text-white flex items-center">
                        {
                            !guideExpand &&
                            <div className="h-full w-[50px] bg-white text-black grid place-items-center py-2 cursor-pointer"
                            onClick={() => setGuideExpand(prev => !prev)}>
                                <ArrowRightIcon />
                            </div>
                        }
                        <span className="py-2 px-5">{exQuery.data?.title}.{language.value}</span>
                    </div>
                    <CodeEditorWindow
                        code={code}
                        onChange={onChange}
                        setLineCount={(e) => setLineCount(e)}
                        language={language?.value}
                        theme={theme}
                        defaultValue={
                            (trackingQuery.data?.userCoding && trackingQuery.data.userCoding !== "")
                                ?   trackingQuery.data.userCoding
                                :   exQuery.data?.codeStarter
                        }
                    />

                    {/* Action Content */}
                    <div className="absolute bottom-0 left-0 w-full flex flex-col text-sm">
                        <div className="flex justify-between px-5 py-2 bg-gray-950">
                            <div className="flex items-center justify-start gap-x-5">
                                <Button variant={'white'} disabled={!code || code === "" || processing}>
                                    <div className="flex items-center justify-center gap-x-2">
                                        {
                                            processing
                                                ?   <Loader2Icon className="w-5 h-5 animate-spin"/>
                                                :   <PlayCircleIcon className="w-5 h-5" />
                                        }
                                        <span className="font-semibold text-gray-950" onClick={handleCompile}>
                                            {
                                                processing ? "Đang xử lý" : "Chạy bài kiểm tra"
                                            }
                                        </span>
                                    </div>
                                </Button>
                                <span className="text-white font-semibold cursor-pointer">Thiết lập lại</span>
                            </div>
                            <div className="flex items-center justify-end text-white text-sm font-light">
                                { updateUserCoding.isLoading && <Loader2Icon className="w-5 h-5 animate-spin"/> }
                                {
                                    updateUserCoding.isLoading
                                        ?   <span className="pr-5">Đang lưu thay đổi</span>
                                        :   updateUserCoding.isSuccess
                                            ?   <span className="pr-5">Đã lưu thay đổi</span>
                                            :   <span className="pr-5">Chưa lưu thay đổi</span>
                                }
                                <div className="h-1/2 w-[1px] bg-white"></div>
                                <span className="pl-5">Dòng {lineCount}</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center px-5 py-2 bg-gray-800">
                            <div className="flex items-center justify-start gap-x-5">
                                <span className="text-white text-sm font-semibold">Kết quả: </span>
                                {
                                    outputDetails &&
                                    <>
                                        {
                                            outputDetails.status_id === 3 && atob(outputDetails.stdout) === exQuery.data?.result
                                                ?    <span className="bg-green-100 flex items-center justify-center gap-x-3 text-sm px-3
                                                    py-1 rounded-sm border border-green-500 text-green-600">
                                                        <span>Thành công</span>
                                                        <CheckCircle2Icon className="w-4 h-4 fill-green-500 stroke-white" />
                                                    </span>
                                                :   <span className="border border-red-500 bg-red-200 text-sm px-3 rounded-sm">
                                                        Thất bại
                                                    </span>
                                        }
                                        <span>Thoi gian: { outputDetails?.time }</span>
                                    </>
                                }
                            </div>
                            <ArrowUpIcon className={cn("w-6 h-6 stroke-white cursor-pointer", {
                                'rotate-180': expandOutput
                            })} onClick={() => setExpandOutput(prev => !prev)}/>
                        </div>
                        <OutputWindow 
                            outputDetails={outputDetails}
                            expandOutput={expandOutput}
                        />
                    </div>
                    {/* End Action Content */}
                </div>
            </div>
            <CodingActionContent codingEx={exQuery.data} />
        </div>
    )
}

export default CodingExercisePage
