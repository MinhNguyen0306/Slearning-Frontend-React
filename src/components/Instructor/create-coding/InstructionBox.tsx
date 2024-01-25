import ReactQuill from 'react-quill'

const modules = {
  toolbar: [
    [{ 'header': [1, 2, false] }],
    ['bold', 'italic', 'underline','strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
    ['link', 'image', 'code-block'],
    ['clean']
  ]
}
  
const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image', 'code-block'
]

const InstructionBox = ({ onChange, instruction }: { onChange: (v: string) => void, instruction: string }) => {
    return (
        <>
            <p>
                Cung cấp các chỉ dẫn ban đầu để người học biết họ cần phải làm gì để giải quyết bài tập.
                Sử dụng đúng ngữ pháp, tránh sai sót.
            </p>
            <ReactQuill
                theme='snow'
                value={instruction}
                onChange={(e) => onChange(e)}
                placeholder='Thêm chỉ dẫn'
                modules={modules}
                formats={formats}
            />
        </>
    )
}

export default InstructionBox
