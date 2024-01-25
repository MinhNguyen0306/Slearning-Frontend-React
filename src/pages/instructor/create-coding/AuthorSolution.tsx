import { ArrowDownIcon, CheckCircle2Icon, Loader2Icon, PlayCircle, PlayCircleIcon, RotateCcwIcon } from "lucide-react"
import CodeEditorWindow from "../../../components/common/CodeEditorWindow"
import { useEffect, useRef, useState } from "react";
import { LanguageOption, languageOptions } from "../../../constants/languageOptions";
import { cn } from "../../../util/utils";
import { Button } from "../../../components/Button";
import axios from "axios";
import { toast } from "react-toastify";
import OutputWindow from "../../../components/common/OutputWindow";
import { useMutation, useQuery } from "react-query";
import codingApi from "../../../api/modules/coding.api";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const AuthorSolution = () => {
    const navigate = useNavigate();
    const { id, quizId } = useParams();
    const { state } = useLocation();
    const from = useRef<string>(state.from)
    const courseId = useRef<string>();
    const exId = useRef<number>()

    const [codeSolution, setCodeSolution] = useState<string>("");
    const [codeSetup, setCodeSetup] = useState<string>("");

    const [lineCountSolution, setLineCountSolution] = useState<number>();
    const [lineCountSetup, setLineCountSetup] = useState<number>();

    const [theme, setTheme] = useState<string>("vs-dark");
    const [language, setLanguage] = useState<LanguageOption>(languageOptions[0]);
    const [outputDetails, setOutputDetails] = useState<any>(null);
    const [customInput, setCustomInput] = useState("");
    const [processing, setProcessing] = useState<boolean>(false);
    const [expandOutput, setExpandOutput] = useState<boolean>(false);
    const [guideExpand, setGuideExpand] = useState<boolean>(true);

    const exQuery = useQuery({
        queryKey: ['exQuery'],
        queryFn: async () => {
            if(exId.current) {
                const { response, error } = await codingApi.getById(exId.current)
                if(response) return response.data
                if(error) return Promise.reject()
            } else {
                return Promise.reject()
            }
        }
    })

    const onChangeCodeSolution = (action: string, data: string) => {
        switch (action) {
          case "code": {
            setCodeSolution(data);
            break;
          }
          default: {
            console.warn("case not handled!", action, data);
          }
        }
    };

    const onChangeCodeSetup = (action: string, data: string) => {
        switch (action) {
          case "code": {
            setCodeSetup(data);
            break;
          }
          default: {
            console.warn("case not handled!", action, data);
          }
        }
    };

    const handleCompile = async () => {
        setProcessing(true);
        const codeExcuted = codeSetup + "\r\n\n" + codeSolution;

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
                toast.success(`Thực thi thành công!`)
                console.log('response.data', response.data)
                return;
            }
        } catch (err) {
            console.log("err", err);
            setProcessing(false);
            toast.error("Thực thi lỗi")
        }
    };

    const addSolutionMutation = useMutation({
        mutationKey: ['addSolution', exId],
        mutationFn: async () => {
            const result = atob(outputDetails.stdout)
            if(result !== null && exId.current) {
                return codingApi.addAuthorSolution(exId.current, codeSolution, codeSetup, result)
            } else {
                toast.error("Kết quả không hợp lệ!")
                return Promise.reject();
            }
        },
        onSuccess(data) {
            if(data.response) {
                toast.success("Đã thêm solution")
                navigate(`/instructor/courses/${courseId.current}/coding-exercise/${exId.current}/guide-learners`, {
                    state: from.current
                })
            }
            if(data.error) toast.error(data.error.response?.data.errorMessage ?? "That bai!")
        },
        onError(error: Error) {
            toast.error(error.message)
        }
    })

    useEffect(() => {
        if(outputDetails && outputDetails.status_id) {
            if(outputDetails.status_id === 3 && courseId.current && exId.current) {
                addSolutionMutation.mutate()
            }
        }
    }, [outputDetails])

    useEffect(() => {
        courseId.current = id
        exId.current = Number(quizId)
    }, [id, quizId])

    return (
        <>
            <div className="flex flex-col w-screen z-50 fixed bottom-[55px] left-0">
                <div className="w-full bg-black px-5 py-3 shadow-[0px_-15px_15px_0px_rgba(0,0,0,0.75)]
                border-b-2 border-b-gray-300">
                    <Button variant={'white'} disabled={!codeSolution || codeSolution === "" || processing}>
                        <div className="flex items-center justify-center gap-x-2">
                            {
                                processing
                                    ?   <Loader2Icon className="w-5 h-5 animate-spin"/>
                                    :   <PlayCircleIcon className="w-5 h-5" />
                            }
                            <span className="font-semibold text-gray-950" onClick={handleCompile}>
                                {
                                    processing ? "Đang xử lý" : "Chạy chương trình"
                                }
                            </span>
                        </div>
                    </Button>
                </div>
                <div className="bg-stone-800 px-5 py-2 flex justify-between items-center">
                    <div className="flex justify-start items-center gap-x-3 text-white">
                        <span className="text-white text-sm font-semibold">Kết quả: </span>
                        {
                            outputDetails &&
                            <>
                                {
                                    outputDetails.status_id === 3 
                                        ?    <span className="bg-green-100 flex items-center justify-center gap-x-3 text-sm px-3
                                            py-1 rounded-sm border border-green-500 text-green-600">
                                                <span>Thành công</span>
                                                <CheckCircle2Icon className="w-4 h-4 fill-green-500 stroke-white" />
                                            </span>
                                        :   <span className="border border-red-500 bg-red-200 text-sm px-3 rounded-sm">
                                                Thất bại
                                            </span>
                                }
                                <span>Thời gian: { outputDetails?.time }</span>
                            </>
                        }
                    </div>
                    <ArrowDownIcon className={cn("stroke-white cursor-pointer", {
                        'rotate-180': !expandOutput
                    })} onClick={() => setExpandOutput(prev => !prev)}/>
                </div>
                <OutputWindow 
                    outputDetails={outputDetails}
                    expandOutput={expandOutput}
                />
            </div>
            <div className="bg-black text-white grid grid-cols-2">
                <div className="flex flex-col col-span-1">
                    <div className="bg-stone-800 px-5 py-2 flex justify-between items-center text-white
                    border-b border-b-gray-500">
                        <span className="font-semibold">Giải pháp</span>
                        <div className="flex items-center justify-end gap-x-3">
                            <RotateCcwIcon className="w-5 h-5"/>
                        </div>
                    </div>
                    <div className="bg-stone-800 px-5 py-2 flex justify-between items-center text-white text-sm
                    border-b border-b-gray-500">
                        <span>solution.java</span>
                    </div>
                    <CodeEditorWindow 
                        code={codeSolution}
                        onChange={onChangeCodeSolution}
                        setLineCount={(e) => setLineCountSolution(e)}
                        language={language?.value}
                        theme={theme}
                        defaultValue={exQuery.data?.solution}
                    />
                </div>
                <div className="flex flex-col col-span-1 border-l border-l-gray-300">
                    <div className="bg-stone-800 px-5 py-2 flex justify-between items-center text-white
                    border-b border-b-gray-500">
                        <span className="font-semibold">Cài đặt sẵn (Tùy chọn)</span>
                        <div className="flex items-center justify-end gap-x-3">
                            <RotateCcwIcon className="w-5 h-5"/>
                        </div>
                    </div>
                    <div className="bg-stone-800 px-5 py-2 flex justify-between items-center text-white text-sm
                    border-b border-b-gray-500">
                        <span>setup.java</span>
                    </div>
                    <CodeEditorWindow 
                        code={codeSetup}
                        onChange={onChangeCodeSetup}
                        setLineCount={(e) => setLineCountSetup(e)}
                        language={language?.value}
                        theme={theme}
                        defaultValue={exQuery.data?.evaluation}
                    />
                </div>
            </div>
        </>
    )
}

export default AuthorSolution
