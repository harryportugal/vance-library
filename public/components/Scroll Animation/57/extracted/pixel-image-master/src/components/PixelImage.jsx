"use client"


import React, { useEffect, useRef, Children, cloneElement, isValidElement } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)


const DEFAULT_PX_STEPS = [2, 5, 6, 8, 100]


const PixelImage = ({
  children,
  pxSteps = DEFAULT_PX_STEPS,
  triggerStart = 'top+=20% bottom',
  speed = 80,
  initialDelay = 300,
  className = '',
  style = {},
}) => {

  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const stateRef = useRef({ pxIndex: 0, imgRatio: 1, img: null })

  useEffect(()=>{

    const container = containerRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const hiddenImg = container.querySelector('img[data-pixel-src]')
    const state = stateRef.current

    if (!hiddenImg) return

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = hiddenImg.getAttribute('data-pixel-src') || hiddenImg.src
    state.img = img

    const render = () => {
      const { offsetWidth: cw, offsetHeight: ch } = container
      canvas.width = cw
      canvas.height = ch

      const w = cw * 1.05
      const h = ch * 1.05
      let newWidth = w, newHeight = h, newX = 0, newY = 0

      if (w / h > state.imgRatio) {
        newHeight = Math.round(w / state.imgRatio)
      } else {
        newWidth = Math.round(h * state.imgRatio)
        newX = (w - newWidth) / 2
      }

      const size = pxSteps[state.pxIndex] * .01
      ctx.imageSmoothingEnabled = size === 1
      ctx.clearRect(0, 0, cw, ch)
      ctx.drawImage(img, 0, 0, w * size, h * size)
      ctx.drawImage(canvas, 0, 0, w * size, h * size, newX, newY, newWidth, newHeight)
    }

    const animatePixels = ()=>{
      if (state.pxIndex < pxSteps.length){
        setTimeout(()=>{
          render()
          state.pxIndex ++
          animatePixels()
        }, 
        state.pxIndex === 0 ? initialDelay : speed
      )
      }
    }

    img.onload = ()=>{
      state.imgRatio = img.width / img.height
      render()

      window.addEventListener('resize', render)

      ScrollTrigger.create({
        trigger: container,
        start: triggerStart,
        onEnter: animatePixels,
        once: true,
      })
      
      ScrollTrigger.create({
        trigger: container,
        start: "top bottom",
        onEnter: ()=> gsap.set(container, { opacity: 1 }),
        once: true,
      })
    }

    return () => {
      window.removeEventListener('resize', render)
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }

  }, [pxSteps, triggerStart, speed, initialDelay])


  const wrappedChildren = Children.map(children, (child)=>{
    if (isValidElement(child) && (child.type === 'img' || child.type?.displayName === 'Image' || child.type?.name === 'Image')){
      return cloneElement(child, {
        'data-pixel-src': child.props.src,
        style: { ...child.props.style, position: 'absolute', opacity: 0, pointerEvents: 'none' },
      })
    }
  })



  return (
    <div ref={containerRef} className={`relative opacity-0 overflow-hidden ${className}`} style={style}>
      {wrappedChildren}
      <canvas ref={canvasRef} className='absolute size-full inset-0'></canvas>
    </div>
  )
}

export default PixelImage