module.exports=[58313,a=>{"use strict";var b=a.i(87924),c=a.i(1236),d=a.i(37120),e=a.i(19163),f=a.i(94936),g=a.i(10129),h=a.i(19184),i=a.i(72131),j=a.i(35258);function k({targetCenterUv:a}){let c=(0,i.useRef)(null),d=(0,i.useMemo)(()=>({uGridScale:{value:28},uLineWidth:{value:.5},uEdgeWidth:{value:.14},uEdgeAmp:{value:1.35},uCenterRadius:{value:.22},uCenterAmp:{value:.9},uCenter:{value:new j.Vector2(.5,.5)},uTime:{value:0},uScrollSpeed:{value:.01},uResolution:{value:new j.Vector2(1,1)}}),[]);return(0,h.useFrame)(b=>{let d=c.current;if(!d)return;let e=d.material;e.uniforms.uTime.value=b.clock.getElapsedTime(),e.uniforms.uCenter.value.lerp(a.current,.08)}),(0,b.jsxs)("mesh",{ref:c,position:[0,0,-5.2],children:[(0,b.jsx)("planeGeometry",{args:[18,18,512,512]}),(0,b.jsx)("shaderMaterial",{attach:"material",args:[{uniforms:d,vertexShader:`
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
              `,side:j.DoubleSide}]})]})}function l({tubeAngleRef:a}){let c=(0,e.useGLTF)("/models/helmet.glb"),d=(0,i.useMemo)(()=>c.scene.clone(!0),[c.scene]),f=(0,i.useRef)(null),g=(0,i.useMemo)(()=>({x:Math.PI/8,y:Math.PI/2}),[]),k=(0,i.useMemo)(()=>new j.MeshPhysicalMaterial({transmission:1,thickness:10,roughness:0,metalness:.1,ior:1.9,dispersion:1,clearcoat:.1,clearcoatRoughness:1.1,iridescenceThicknessRange:[100,400],color:"transparent",transparent:!0,depthWrite:!0}),[]);return(0,i.useEffect)(()=>(d.traverse(a=>{a instanceof j.Mesh&&(a.scale.set(.7,.7,.7),a.material=k,a.material.needsUpdate=!0)}),()=>{k.dispose()}),[d,k]),(0,h.useFrame)(()=>{let b=f.current;b&&(b.rotation.x=g.x,b.rotation.y=g.y-a.current)}),(0,b.jsx)("primitive",{ref:f,object:d,rotation:[g.x,g.y,0]})}function m({scrollTargetRef:a,spinVelocityRef:c,naturalDirRef:d,tubeAngleRef:e,rotationSpeedScaleTargetRef:g,rotationSpeedScaleLerpRef:k,baseSpeedRef:l,rows:n,cols:o,onHoverStart:p,onHoverMove:q,onHoverEnd:r}){let s=(0,i.useRef)(null),t=(0,i.useRef)([]),u=(0,i.useRef)(0),v=(0,i.useRef)(0),w=(0,i.useRef)(1),x=(0,i.useMemo)(()=>["/tube/im1.jpg","/tube/im3.jpg","/tube/im2.jpg","/tube/im4.jpg","/tube/im5.jpg","/tube/im6.jpg","/tube/im7.jpg","/tube/im8.jpg","/tube/im9.jpg"],[]),y=(0,f.useTexture)(x),z=(0,i.useMemo)(()=>{let a={"/tube/im1.jpg":"Project 1","/tube/im2.jpg":"Project 2","/tube/im3.jpg":"Project 3","/tube/im4.jpg":"Project 4","/tube/im5.jpg":"Project 5","/tube/im6.jpg":"Project 6","/tube/im7.jpg":"Project 7","/tube/im8.jpg":"Project 8","/tube/im9.jpg":"Project 9"};return x.map(b=>a[b]??b)},[x]),A=2.7*n,B=3*n,C=(0,i.useMemo)(()=>{let a=[];for(let b=0;b<n;b++){let c=n<=1?0:b/(n-1);a.push(.65+.9*c)}return a},[n]),D=(0,i.useMemo)(()=>{let a=[];for(let b=0;b<B;b++){let c=(b-(B-1)/2)*2.7,d=b%n,e=.5*(d%2!=0);a.push({rowIndex:b,y:c,baseRow:d,rowOffset:e})}return a},[n,B,2.7]);return(0,h.useFrame)((b,f)=>{u.current+=(a.current-u.current)*.12,u.current>A/2?(u.current-=A,a.current-=A):u.current<-A/2&&(u.current+=A,a.current+=A),c.current*=Math.pow(.92,60*f),c.current=Math.max(-2,Math.min(2,c.current)),w.current+=(g.current-w.current)*k.current;let h=f*w.current,i=d.current*l.current;v.current+=(i+c.current)*h,e.current=v.current;let j=s.current;if(j){j.position.y=-u.current;for(let a=0;a<B;a++){let b=t.current[a];if(!b)continue;let c=a%n;b.rotation.y=v.current*C[c]}}}),(0,b.jsx)("group",{ref:s,children:D.map(({rowIndex:a,y:c,baseRow:d,rowOffset:e})=>(0,b.jsx)("group",{position:[0,c,0],ref:b=>{t.current[a]=b},children:Array.from({length:o}).map((a,c)=>{let f=(c+e)/o*Math.PI*2,g=4*Math.cos(f),h=4*Math.sin(f),i=-(f+Math.PI/2),k=(d*o+c)%x.length,l=z[k]??"";return(0,b.jsxs)("mesh",{position:[g,0,h],rotation:[0,i,0],onPointerOver:a=>{a.stopPropagation(),p(l,a)},onPointerMove:a=>{a.stopPropagation(),q(a)},onPointerOut:a=>{a.stopPropagation(),r()},children:[(0,b.jsx)("planeGeometry",{args:[.72,1]}),(0,b.jsx)("meshBasicMaterial",{map:y[k],toneMapped:!1,side:j.DoubleSide})]},c)})},a))})}e.useGLTF.preload("/models/helmet.glb"),a.s(["FiberScene",0,function(){let a=(0,i.useRef)(null),e=(0,i.useRef)(new j.Vector2(.5,.5)),f=(0,i.useRef)(0),h=(0,i.useRef)(0),n=(0,i.useRef)(1),o=(0,i.useRef)(0),p=(0,i.useRef)(.25),q=(0,i.useRef)(!0),r=(0,i.useRef)(.35),s=(0,i.useRef)(1),t=(0,i.useRef)(.12),[u,v]=(0,i.useState)(null),w=(0,i.useRef)(null),x=(0,i.useRef)({x:0,y:0}),y=(0,i.useRef)({x:0,y:0}),z=(0,i.useRef)(null),A=(0,i.useRef)(null),B=(0,i.useRef)({x:0,y:0}),C=(0,i.useRef)({x:0,y:0}),D=(0,i.useRef)(!1),E=(0,i.useRef)(null),F=(0,i.useCallback)((b,c)=>{let d=a.current?.getBoundingClientRect();d&&(x.current={x:b-d.left,y:c-d.top})},[]);(0,i.useEffect)(()=>{let a=()=>{let b=w.current;if(b){y.current.x+=(x.current.x-y.current.x)*.18,y.current.y+=(x.current.y-y.current.y)*.18;let a=y.current.x+12,c=y.current.y-18;b.style.transform=`translate3d(${a.toFixed(2)}px, ${c.toFixed(2)}px, 0)`}z.current=requestAnimationFrame(a)};return z.current=requestAnimationFrame(a),()=>{null!=z.current&&cancelAnimationFrame(z.current)}},[]),(0,i.useEffect)(()=>{let a=()=>{let b=A.current;if(b){C.current.x+=(B.current.x-C.current.x)*.14,C.current.y+=(B.current.y-C.current.y)*.14;let a=C.current.x+8,c=C.current.y+8;b.style.transform=`translate3d(${a.toFixed(2)}px, ${c.toFixed(2)}px, 0) translate(-50%, -50%)`,b.style.opacity=D.current?"1":"0"}E.current=requestAnimationFrame(a)};return E.current=requestAnimationFrame(a),()=>{null!=E.current&&cancelAnimationFrame(E.current)}},[]);let G=(0,i.useCallback)((a,b)=>{v(a),F(b.nativeEvent.clientX,b.nativeEvent.clientY),q.current&&(s.current=r.current),y.current={...x.current}},[F]),H=(0,i.useCallback)(a=>{F(a.nativeEvent.clientX,a.nativeEvent.clientY)},[F]),I=(0,i.useCallback)(()=>{v(null),s.current=1},[]),J=(0,i.useCallback)(a=>{let b=a.currentTarget.getBoundingClientRect();B.current={x:a.clientX-b.left,y:a.clientY-b.top},C.current={...B.current},D.current=!0},[]),K=(0,i.useCallback)(a=>{let b=a.currentTarget.getBoundingClientRect();if(b.width<=0||b.height<=0)return;B.current={x:a.clientX-b.left,y:a.clientY-b.top};let c=(a.clientX-b.left)/b.width,d=(a.clientY-b.top)/b.height,f=Math.min(1,Math.max(0,c)),g=Math.min(1,Math.max(0,d));e.current.set(Math.min(1,Math.max(0,.5+(f-.5)*.4)),Math.min(1,Math.max(0,.5+(1-g-.5)*.4)))},[]),L=(0,i.useCallback)(()=>{e.current.set(.5,.5),I(),D.current=!1},[I]),M=(0,i.useCallback)(a=>{f.current+=.002*a.deltaY,h.current+=.004*a.deltaY,a.deltaY<0?n.current=-1:a.deltaY>0&&(n.current=1)},[]);return(0,b.jsxs)("div",{className:"sceneRoot",ref:a,onPointerEnter:J,onPointerMove:K,onPointerLeave:L,onWheel:M,children:[(0,b.jsx)(g.Canvas,{camera:{position:[0,0,6.5],fov:50},onCreated:({camera:a})=>{a.lookAt(0,0,0)},children:(0,b.jsxs)(i.Suspense,{fallback:null,children:[(0,b.jsx)("ambientLight",{intensity:.5}),(0,b.jsx)("directionalLight",{position:[5,5,5],intensity:1}),(0,b.jsx)(c.Environment,{preset:"studio",blur:10.5}),(0,b.jsx)(k,{targetCenterUv:e}),(0,b.jsx)(m,{scrollTargetRef:f,spinVelocityRef:h,naturalDirRef:n,tubeAngleRef:o,rotationSpeedScaleTargetRef:s,rotationSpeedScaleLerpRef:t,baseSpeedRef:p,rows:5,cols:12,onHoverStart:G,onHoverMove:H,onHoverEnd:I}),(0,b.jsx)(l,{tubeAngleRef:o})]})}),(0,b.jsx)("div",{className:"whiteEdgeGradient","aria-hidden":"true"}),u&&(0,b.jsx)("div",{className:"projectTooltip",ref:w,role:"status","aria-live":"polite",children:u}),(0,b.jsx)("div",{className:"customCursor",ref:A,"aria-hidden":"true"}),(0,b.jsx)(d.Loader,{})]})}])}];

//# sourceMappingURL=0scz_3D%20Animation_12_extracted_helmet-main_src_components_FiberScene_tsx_09bi48e._.js.map