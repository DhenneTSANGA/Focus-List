import React from 'react'
import { SignUp } from '@clerk/nextjs'
const page = () => {
  return (
    <div className='flex justify-center items-center h-screen'>
        <SignUp />
    </div>
  )
}

export default page