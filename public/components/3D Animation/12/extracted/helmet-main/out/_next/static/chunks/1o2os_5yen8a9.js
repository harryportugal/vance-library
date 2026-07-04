(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,7544,e=>{"use strict";var t=e.i(43476),r=e.i(43257),n=e.i(81778),u=e.i(78140),i=e.i(47071),a=e.i(75056),o=e.i(25234),l=e.i(71645),c=e.i(90072);function s({targetCenterUv:e}){let r=(0,l.useRef)(null),n=(0,l.useMemo)(()=>({uGridScale:{value:28},uLineWidth:{value:.5},uEdgeWidth:{value:.14},uEdgeAmp:{value:1.35},uCenterRadius:{value:.22},uCenterAmp:{value:.9},uCenter:{value:new c.Vector2(.5,.5)},uTime:{value:0},uScrollSpeed:{value:.01},uResolution:{value:new c.Vector2(1,1)}}),[]);return(0,o.useFrame)(t=>{let n=r.current;if(!n)return;let u=n.material;u.uniforms.uTime.value=t.clock.getElapsedTime(),u.uniforms.uCenter.value.lerp(e.current,.08)}),(0,t.jsxs)("mesh",{ref:r,position:[0,0,-5.2],children:[(0,t.jsx)("planeGeometry",{args:[18,18,512,512]}),(0,t.jsx)("shaderMaterial",{attach:"material",args:[{uniforms:n,vertexShader:`
                varying vec2 vUv;
                
                uniform float uEdgeWidth;
                uniform float uEdgeAmp;
                uniform float uCenterRadius;
                uniform float uCenterAmp;
                uniform vec2 uCenter;

                void main() {
                  vUv = uv;

                  vec3 p = position;

                  float dEdge = min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y));
                  float edgeMask = 1.0 - smoothstep(0.0, uEdgeWidth, dEdge);

                  float dCenter = distance(vUv, uCenter);
                  float centerMask = 1.0 - smoothstep(0.0, uCenterRadius, dCenter);

                  float zOffset = edgeMask * uEdgeAmp + centerMask * uCenterAmp;
                  p.z += zOffset;

                  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
                }
              `,fragmentShader:`
                varying vec2 vUv;
                
                uniform float uGridScale;
                uniform float uLineWidth;
                uniform float uTime;
                uniform float uScrollSpeed;
                uniform vec2 uResolution;

                float gridLine(float coord, float width) {
                  float fw = fwidth(coord);
                  float p = abs(fract(coord - 0.5) - 0.5);
                  return 1.0 - smoothstep(width * fw, (width + 1.0) * fw, p);
                }

                void main() {
                  vec2 uv = (vUv + vec2(uTime * uScrollSpeed, 0.0)) * uGridScale;
                  float gx = gridLine(uv.x, uLineWidth);
                  float gy = gridLine(uv.y, uLineWidth);
                  float g = max(gx, gy);

                  vec3 base = vec3(0.);
                  vec3 line = vec3(0.1);
                  vec3 col = mix(base, line, g);
                  gl_FragColor = vec4(col, 1.);
                }
              `,side:c.DoubleSide}]})]})}function m({tubeAngleRef:e}){let r=(0,u.useGLTF)("/models/helmet.glb"),n=(0,l.useMemo)(()=>r.scene.clone(!0),[r.scene]),i=(0,l.useRef)(null),a=(0,l.useMemo)(()=>({x:Math.PI/8,y:Math.PI/2}),[]),s=(0,l.useMemo)(()=>new c.MeshPhysicalMaterial({transmission:1,thickness:10,roughness:0,metalness:.1,ior:1.9,dispersion:1,clearcoat:.1,clearcoatRoughness:1.1,iridescenceThicknessRange:[100,400],color:"transparent",transparent:!0,depthWrite:!0}),[]);return(0,l.useEffect)(()=>(n.traverse(e=>{e instanceof c.Mesh&&(e.scale.set(.7,.7,.7),e.material=s,e.material.needsUpdate=!0)}),()=>{s.dispose()}),[n,s]),(0,o.useFrame)(()=>{let t=i.current;t&&(t.rotation.x=a.x,t.rotation.y=a.y-e.current)}),(0,t.jsx)("primitive",{ref:i,object:n,rotation:[a.x,a.y,0]})}function f({scrollTargetRef:e,spinVelocityRef:r,naturalDirRef:n,tubeAngleRef:u,rotationSpeedScaleTargetRef:a,rotationSpeedScaleLerpRef:s,baseSpeedRef:m,rows:d,cols:p,onHoverStart:v,onHoverMove:g,onHoverEnd:h}){let x=(0,l.useRef)(null),j=(0,l.useRef)([]),R=(0,l.useRef)(0),b=(0,l.useRef)(0),y=(0,l.useRef)(1),M=(0,l.useMemo)(()=>["/tube/im1.jpg","/tube/im3.jpg","/tube/im2.jpg","/tube/im4.jpg","/tube/im5.jpg","/tube/im6.jpg","/tube/im7.jpg","/tube/im8.jpg","/tube/im9.jpg"],[]),C=(0,i.useTexture)(M),P=(0,l.useMemo)(()=>{let e={"/tube/im1.jpg":"Project 1","/tube/im2.jpg":"Project 2","/tube/im3.jpg":"Project 3","/tube/im4.jpg":"Project 4","/tube/im5.jpg":"Project 5","/tube/im6.jpg":"Project 6","/tube/im7.jpg":"Project 7","/tube/im8.jpg":"Project 8","/tube/im9.jpg":"Project 9"};return M.map(t=>e[t]??t)},[M]),S=2.7*d,E=3*d,A=(0,l.useMemo)(()=>{let e=[];for(let t=0;t<d;t++){let r=d<=1?0:t/(d-1);e.push(.65+.9*r)}return e},[d]),T=(0,l.useMemo)(()=>{let e=[];for(let t=0;t<E;t++){let r=(t-(E-1)/2)*2.7,n=t%d,u=.5*(n%2!=0);e.push({rowIndex:t,y:r,baseRow:n,rowOffset:u})}return e},[d,E,2.7]);return(0,o.useFrame)((t,i)=>{R.current+=(e.current-R.current)*.12,R.current>S/2?(R.current-=S,e.current-=S):R.current<-S/2&&(R.current+=S,e.current+=S),r.current*=Math.pow(.92,60*i),r.current=Math.max(-2,Math.min(2,r.current)),y.current+=(a.current-y.current)*s.current;let o=i*y.current,l=n.current*m.current;b.current+=(l+r.current)*o,u.current=b.current;let c=x.current;if(c){c.position.y=-R.current;for(let e=0;e<E;e++){let t=j.current[e];if(!t)continue;let r=e%d;t.rotation.y=b.current*A[r]}}}),(0,t.jsx)("group",{ref:x,children:T.map(({rowIndex:e,y:r,baseRow:n,rowOffset:u})=>(0,t.jsx)("group",{position:[0,r,0],ref:t=>{j.current[e]=t},children:Array.from({length:p}).map((e,r)=>{let i=(r+u)/p*Math.PI*2,a=4*Math.cos(i),o=4*Math.sin(i),l=-(i+Math.PI/2),s=(n*p+r)%M.length,m=P[s]??"";return(0,t.jsxs)("mesh",{position:[a,0,o],rotation:[0,l,0],onPointerOver:e=>{e.stopPropagation(),v(m,e)},onPointerMove:e=>{e.stopPropagation(),g(e)},onPointerOut:e=>{e.stopPropagation(),h()},children:[(0,t.jsx)("planeGeometry",{args:[.72,1]}),(0,t.jsx)("meshBasicMaterial",{map:C[s],toneMapped:!1,side:c.DoubleSide})]},r)})},e))})}u.useGLTF.preload("/models/helmet.glb"),e.s(["FiberScene",0,function(){let e=(0,l.useRef)(null),u=(0,l.useRef)(new c.Vector2(.5,.5)),i=(0,l.useRef)(0),o=(0,l.useRef)(0),d=(0,l.useRef)(1),p=(0,l.useRef)(0),v=(0,l.useRef)(.25),g=(0,l.useRef)(!0),h=(0,l.useRef)(.35),x=(0,l.useRef)(1),j=(0,l.useRef)(.12),[R,b]=(0,l.useState)(null),y=(0,l.useRef)(null),M=(0,l.useRef)({x:0,y:0}),C=(0,l.useRef)({x:0,y:0}),P=(0,l.useRef)(null),S=(0,l.useRef)(null),E=(0,l.useRef)({x:0,y:0}),A=(0,l.useRef)({x:0,y:0}),T=(0,l.useRef)(!1),k=(0,l.useRef)(null),w=(0,l.useCallback)((t,r)=>{let n=e.current?.getBoundingClientRect();n&&(M.current={x:t-n.left,y:r-n.top})},[]);(0,l.useEffect)(()=>{let e=()=>{let t=y.current;if(t){C.current.x+=(M.current.x-C.current.x)*.18,C.current.y+=(M.current.y-C.current.y)*.18;let e=C.current.x+12,r=C.current.y-18;t.style.transform=`translate3d(${e.toFixed(2)}px, ${r.toFixed(2)}px, 0)`}P.current=requestAnimationFrame(e)};return P.current=requestAnimationFrame(e),()=>{null!=P.current&&cancelAnimationFrame(P.current)}},[]),(0,l.useEffect)(()=>{let e=()=>{let t=S.current;if(t){A.current.x+=(E.current.x-A.current.x)*.14,A.current.y+=(E.current.y-A.current.y)*.14;let e=A.current.x+8,r=A.current.y+8;t.style.transform=`translate3d(${e.toFixed(2)}px, ${r.toFixed(2)}px, 0) translate(-50%, -50%)`,t.style.opacity=T.current?"1":"0"}k.current=requestAnimationFrame(e)};return k.current=requestAnimationFrame(e),()=>{null!=k.current&&cancelAnimationFrame(k.current)}},[]);let F=(0,l.useCallback)((e,t)=>{b(e),w(t.nativeEvent.clientX,t.nativeEvent.clientY),g.current&&(x.current=h.current),C.current={...M.current}},[w]),L=(0,l.useCallback)(e=>{w(e.nativeEvent.clientX,e.nativeEvent.clientY)},[w]),U=(0,l.useCallback)(()=>{b(null),x.current=1},[]),W=(0,l.useCallback)(e=>{let t=e.currentTarget.getBoundingClientRect();E.current={x:e.clientX-t.left,y:e.clientY-t.top},A.current={...E.current},T.current=!0},[]),Y=(0,l.useCallback)(e=>{let t=e.currentTarget.getBoundingClientRect();if(t.width<=0||t.height<=0)return;E.current={x:e.clientX-t.left,y:e.clientY-t.top};let r=(e.clientX-t.left)/t.width,n=(e.clientY-t.top)/t.height,i=Math.min(1,Math.max(0,r)),a=Math.min(1,Math.max(0,n));u.current.set(Math.min(1,Math.max(0,.5+(i-.5)*.4)),Math.min(1,Math.max(0,.5+(1-a-.5)*.4)))},[]),G=(0,l.useCallback)(()=>{u.current.set(.5,.5),U(),T.current=!1},[U]),B=(0,l.useCallback)(e=>{i.current+=.002*e.deltaY,o.current+=.004*e.deltaY,e.deltaY<0?d.current=-1:e.deltaY>0&&(d.current=1)},[]);return(0,t.jsxs)("div",{className:"sceneRoot",ref:e,onPointerEnter:W,onPointerMove:Y,onPointerLeave:G,onWheel:B,children:[(0,t.jsx)(a.Canvas,{camera:{position:[0,0,6.5],fov:50},onCreated:({camera:e})=>{e.lookAt(0,0,0)},children:(0,t.jsxs)(l.Suspense,{fallback:null,children:[(0,t.jsx)("ambientLight",{intensity:.5}),(0,t.jsx)("directionalLight",{position:[5,5,5],intensity:1}),(0,t.jsx)(r.Environment,{preset:"studio",blur:10.5}),(0,t.jsx)(s,{targetCenterUv:u}),(0,t.jsx)(f,{scrollTargetRef:i,spinVelocityRef:o,naturalDirRef:d,tubeAngleRef:p,rotationSpeedScaleTargetRef:x,rotationSpeedScaleLerpRef:j,baseSpeedRef:v,rows:5,cols:12,onHoverStart:F,onHoverMove:L,onHoverEnd:U}),(0,t.jsx)(m,{tubeAngleRef:p})]})}),(0,t.jsx)("div",{className:"whiteEdgeGradient","aria-hidden":"true"}),R&&(0,t.jsx)("div",{className:"projectTooltip",ref:y,role:"status","aria-live":"polite",children:R}),(0,t.jsx)("div",{className:"customCursor",ref:S,"aria-hidden":"true"}),(0,t.jsx)(n.Loader,{})]})}])}]);