import React from 'react'

const Loading = ({loadMessage}: {loadMessage?: string | null}) => {
    return (
        <div className='grow place-items-center flex gap-x-2 justify-center'>
            <span className="loading loading-spinner loading-md"></span>
            { !loadMessage && 'Please wait...'}
            { !!loadMessage && loadMessage}
        </div>
    )
}
export default Loading
