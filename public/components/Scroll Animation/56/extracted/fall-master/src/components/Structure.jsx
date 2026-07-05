import Image from 'next/image'
import React from 'react'
import Fall from './Fall'

export default function Structure() {
    return (
        <div className='w-full'>
            <section className='h-screen w-full relative overflow-clip'>
                <Image src="/assets/img1.png" alt="background" height={1000} width={1000} className='size-full object-cover ' />
                <div className='size-full absolute inset-0 flex items-center justify-center'>
                    <Fall>
                        <h1 className='text-[9vw] text-white text-center leading-none tracking-tight'>Chase Your Dreams, <br /> Never Look Back</h1>
                    </Fall>
                </div>
            </section>
            <section className=' h-screen w-full flex items-center justify-center overflow-clip'>

                <Fall color='#005E53'>
                    <h2 className=' text-center text-[4vw] leading-none tracking-tight mx-auto w-[60%]'>Dreams are the compass that
                        guide your soul, Follow them
                        boldly and you'll reach your goal
                        . Keep moving forward.</h2>
                </Fall>
            </section>
        </div>
    )
}
