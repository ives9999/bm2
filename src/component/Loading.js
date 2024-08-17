import {useContext} from 'react'
import BMContext from '../context/BMContext'
import { CircleSpinnerOverlay } from 'react-spinner-overlay'

function Loading() {
    const {isLoading} = useContext(BMContext)

    return isLoading && (
        <>
        <CircleSpinnerOverlay
            loading={isLoading} 
            color="#A9FF71"
            size={60}
            overlayColor="rgba(0,0,0,0.8)"
            message={<div className='text-Primary-300 mt-4 text-xl'>載入中...</div>}
        />
      </>
    )
}

export default Loading
