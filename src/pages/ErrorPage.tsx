
const NotFoundPage = ({code}: {code: number}) => {
  return (
    <div>
      { code === 404 && <span>Not found 404</span> }
      { code === 401 && <span>Unauthorized 401</span> }
      { code === 403 && <span>Forbidden 403</span> }
    </div>
  )
}

export default NotFoundPage
