import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setActiveState } from '../redux/features/appState/appState.slice'

type Props = {
    state: string,
    children: JSX.Element
}

const PageWrapper = ({ state, children } : Props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0)
    dispatch(setActiveState(state))
  }, [state, dispatch])

  return (
    children
  )
}

export default PageWrapper
