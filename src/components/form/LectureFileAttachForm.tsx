import { formatFileSize, getFileAttach, getFileExtension, getImage } from "../../util/utils";
import PDFICON from "../../assets/pdficon.png";
import EXCELICON from "../../assets/excellogo.png";
import WORDICON from "../../assets/wordlogo.png";
import { useMutation, useQuery, useQueryClient } from "react-query";
import lectureApi from "../../api/modules/lecture.api";
import { toast } from "react-toastify";
import { FolderPlusIcon, FolderXIcon } from "lucide-react";

const LectureFileAttachForm = ({ lectureId }: { lectureId: string }) => {
    const queryClient = useQueryClient();

    const { data } = useQuery({
        queryKey: ['fileAttachOfLecture', lectureId],
        queryFn: async () => {
            const { response, error } = await lectureApi.getFilesAttachOfLecture(lectureId)
            if(response) return response.data
            if(error) {
                toast.error(error.response?.data.errorMessage ? "Fetch files attach error: " + error.response?.data.errorMessage : "Fetch files attach error")
                return Promise.reject();
            }
        },
        onError(error: Error) {
            toast.error(`Fetch files attach error: ${error.message}`)
        }
    })

    function handleAddFiles(e: React.ChangeEvent<HTMLInputElement>) {
        if(e.target.files) {
            const formData = new FormData;
            for(let file of e.target.files) {
                formData.append("files", file);
            }
            uploadFileAttachMutation.mutate({ formData })
        }
    }

    const uploadFileAttachMutation = useMutation({
        mutationFn: ({ formData }: { formData: FormData }) => lectureApi.uploadLectureFileAttach(lectureId, formData),
        onSuccess(data) {
            if(data.response) {
                queryClient.invalidateQueries("fileAttachOfLecture")
                toast.success("Upload video thành công")
            } else {
                toast.error(data.error.message)
            }
        },
        onError(error: Error) {
            toast.error(error.message)
        }
    })

    const deleteFileAttachMutation = useMutation({
        mutationFn: () => lectureApi.deleteLectureFileAttach(lectureId),
        onSuccess(data) {
            if(data.response) {
                queryClient.invalidateQueries("fileAttachOfLecture")
                toast.success("Delete file thành công")
            } else {
                toast.error(data.error.message)
            }
        },
        onError(error: Error) {
            toast.error(error.message)
        }
    })

    function handleRemoveFile() {
        deleteFileAttachMutation.mutate()
    }

    return (
        <div className="flex flex-col w-full p-5 border-[1px] gap-3
        border-gray-300 bg-gray-100 rounded-md">
            <div className="flex justify-between items-center">
                <span className="font-semibold">Files bài giảng</span>
                <label htmlFor="attchedFiles" className="cursor-pointer">
                    <FolderPlusIcon />
                </label>
                <input 
                    type="file" 
                    id="attchedFiles"
                    name="attchedFiles"
                    accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    multiple={true}
                    hidden
                    onChange={(e) => handleAddFiles(e)}
                />
            </div>
            {
                data && data.length > 0 &&
                <ul className="w-full flex justify-start items-center flex-wrap gap-1">
                    {
                        data.map((file, index) => (
                            <li 
                                key={index}
                                className="w-[32.8%] rounded-sm border border-gray-400 p-1 flex justify-between
                                items-center bg-white gap-x-2 hover:border-gray-800 cursor-pointer
                                relative group"
                                // onClick={handleRemoveFile}
                            >
                                <img 
                                    src={
                                        getFileExtension(file.fileType) === 'pdf'
                                            ?   PDFICON
                                            : getFileExtension(file.fileType) === 'xlsx' || getFileExtension(file.fileType) === 'xls'
                                                ?   EXCELICON
                                                :   WORDICON
                                    }
                                    className="w-10 h-10"
                                />
                                <div className="flex-1 flex flex-col overflow-hidden text-xs">
                                    <span className="font-semibold text-ellipsis whitespace-nowrap overflow-hidden">
                                        { file.fileName }
                                    </span>
                                    <span className="text-[0.65rem] text-gray-400">
                                        { formatFileSize(file.fileSize) }
                                    </span>
                                </div>
                                <em className="absolute inset-0 w-full h-full bg-gray-600 bg-opacity-50
                                place-items-center hidden group group-hover:grid">
                                    {/* <FolderXIcon /> */}
                                    <iframe 
                                        src={`http://docs.google.com/gview?url=http://localhost:9090/api/v1/files/download/file-attach/&embedded=true`} 
                                        width='100%' 
                                        height='100%'
                                    ></iframe>
                                </em>
                            </li>
                        ))
                    }
                </ul>
            }
        </div> 
    )
}

export default LectureFileAttachForm
