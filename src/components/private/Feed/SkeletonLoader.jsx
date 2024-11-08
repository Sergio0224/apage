import React from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const SkeletonLoader = () => {
    return (
        <div className='border-2 p-4 w-full flex flex-col gap-2 rounded-xl'>
            <div className='flex justify-between items-center'>
                <div className='flex items-center gap-2'>
                    <span><Skeleton className='w-14 h-14' circle={true} /></span>
                    <span><Skeleton className='w-20 h-5' /></span>
                </div>
                <button><Skeleton className='w-20 h-10 rounded-md' /></button>
            </div>
            <div>
                <Skeleton />
            </div>
        </div>
    )
}

export default SkeletonLoader