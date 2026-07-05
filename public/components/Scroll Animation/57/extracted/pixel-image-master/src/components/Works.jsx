import React from 'react'
import PixelImage from './PixelImage'

const Works = () => {
    return (
        <section className='w-full px-[5vw] py-[10vw]'>
            <h2 className='text-[4vw] tracking-tighter font-medium mb-[5vw]'>Selected Works</h2>

            <div className='flex gap-4 mb-8'>
                <div className='w-5/12'>
                    <PixelImage className='h-[32vw] w-full'>
                        <img src="https://images.unsplash.com/photo-1745613846928-3ff838e4cd05?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="work" className="w-full h-full object-cover" />
                    </PixelImage>
                    <p className='mt-3 text-[1.3vw] text-black tracking-tighter font-mono'>Architecture Study — 2024</p>
                </div>
                <div className='w-2/12'></div>
                <div className='w-5/12 pt-[8vw]'>
                    <PixelImage className='h-[24vw] w-full'>
                        <img src="https://images.unsplash.com/photo-1772440428276-79f044085e53?q=80&w=686&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="work" className="w-full h-full object-cover" />
                    </PixelImage>
                    <p className='mt-3 text-[1.3vw] text-black tracking-tighter font-mono'>Urban Landscapes — 2024</p>
                </div>
            </div>

            <div className='flex gap-4 mt-[6vw]'>
                <div className='w-3/12'></div>
                <div className='w-4/12'>
                    <PixelImage className="h-[28vw] w-full">
                        <img src="https://images.unsplash.com/photo-1745613944320-1f14580bb0db?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="work" className="w-full h-full object-cover" />
                    </PixelImage>
                    <p className='mt-3 text-[1.3vw] text-black tracking-tighter font-mono'>Abstract Forms — 2023</p>
                </div>
                <div className='w-1/12'></div>
                <div className='w-4/12 pt-[12vw]'>
                    <PixelImage className="h-[36vw] w-full">
                        <img src="https://images.unsplash.com/photo-1772480476707-cc5170235189?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="work" className="w-full h-full object-cover" />
                    </PixelImage>
                    <p className='mt-3 text-[1.3vw] text-black tracking-tighter font-mono'>Light & Shadow — 2023</p>
                </div>
            </div>

            <div className='flex gap-4 mt-[6vw]'>
                <div className='w-3/12'>
                    <PixelImage className="h-[30vw] w-full">
                        <img src="https://images.unsplash.com/photo-1766852150180-e0ffbe7e3c36?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="work" className="w-full h-full object-cover" />
                    </PixelImage>
                    <p className='mt-3 text-[1.3vw] text-black tracking-tighter font-mono'>Mountain Peaks — 2023</p>
                </div>
                <div className='w-4/12'></div>
                <div className='w-5/12 pt-[10vw]'>
                    <PixelImage className="h-[20vw] w-full">
                        <img src="https://images.unsplash.com/photo-1723553495282-5fecd038e9c6?q=80&w=723&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="work" className="w-full h-full object-cover" />
                    </PixelImage>
                    <p className='mt-3 text-[1.3vw] text-black tracking-tighter font-mono'>Nature's Canvas — 2022</p>
                </div>
            </div>
        </section>
    )
}

export default Works