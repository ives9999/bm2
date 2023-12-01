import {useContext} from 'react'
import LoadingContext from '../context/LoadingContext'
import { CircleSpinnerOverlay } from 'react-spinner-overlay'

function Loading() {
    const {isLoading} = useContext(LoadingContext)

    return isLoading && (
        <>
        <CircleSpinnerOverlay
            loading={isLoading} 
            color="#A9FF71"
            size={60}
            overlayColor="rgba(0,0,0,0.8)"
            message={<div className='text-Primary mt-4 text-xl'>載入中...</div>}
        />
      </>
    )
}

export default Loading
