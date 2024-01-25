import ReactQuill from "react-quill"

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

const HintBox = ({ onChange, hint }: { onChange: (v: string) => void, hint: string }) => {
    return (
        <>
            <p>
                Gợi ý sẽ được mở khóa khi người học chạy kết quả sai 2 lần. Gợi ý giúp người học nhanh chóng tìm được đáp
                án hơn là chỉ dựa trên nội dung bài giảng liên quan. Gợi ý chỉ đưa ra những mẹo nhỏ hoặc TIP làm bài
                chứ không đưa ra lời giải cho bài tập.
            </p>
            <ReactQuill
                theme='snow'
                value={hint}
                onChange={(e) => onChange(e)}
                placeholder="Thêm gợi ý"
                modules={modules}
                formats={formats}
            />
        </>
    )
}

export default HintBox
