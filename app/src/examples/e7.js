import   {start_animations,setMatrix,get_lerp_value, get_constant_row,set_duration, hard_reset, lambda_call, get_constant_number, reorient_duration, reorient_target, reorient_duration_by_distance, get_constant, reorient_duration_by_progress} from 'kooljs/worker'

const length=10
const start=0
const end=1
const delay=1
const delay_spread=2
const min_duration=2
const max_duration=15
const animProps={
  animator: undefined,//                 <- animator               << Animator >> 
  animations: undefined,//           <- boxes dict             << div | MatrixLerp >> 
  boxes: new Array(length),//  <- anim id's              << Float32 >> 
}
function bg(val) {
  return `linear-gradient(to right, rgb(255,50,50), rgb(${val[3]}, ${val[4]}, ${val[5]})`
}
  // doc.style.top = `${val[0]}%`;
  // doc.style.left = `${val[1]}%`;
function setStyle(id, val) {
if(id==1)  console.log("id " + id + " val "+ val)
  const doc=document.getElementById(id)
  doc.style.transform = `translate(${val[0]}%,${val[1]}%)`;
  doc.style.opacity = `${val[2]}%`;
  doc.style.background = bg(val);
}
function Example(animator) {
  const reference_matrix = []
  animProps.animator = animator
  for (let i = 0; i < length; i++) {
    const normal= i/length
    const start_step=[100.1,-100.2,0,0,0,0]
    const end_step=[0,0,100,normal*150,normal*50,normal*255]
    reference_matrix.push([start_step,end_step])
    animProps.boxes[i] =  <div class="h-10 w-40 flex items-center rounded-md justify-center " id={"e7__" + i} key={"e7__" + i} style={{top: start_step[1] + "%",left:start_step[0] + "%"}}>
        <div id={"e7_" + i} key={"e7_" + i} class="w-full h-full truncate opacity-0 bg-white border-[#21d9cd] border-2 rounded-md flex-col gap-2 items-center justify-center" >
          <div class="text-center  "><b>Div No: {i}</b></div>
          <div class="text-left w-[80%] h-[10%] pl-2" >
            Line: --{1 + Math.floor(i / length)}--
          </div>
        </div>
      </div>
  }
 animProps.animations= animator.Matrix_Chain({
  reference_matrix:reference_matrix,
  length:length,
  delay:delay,
  delay_spread:delay_spread,
  target_step:0,
  min_duration:min_duration,
  max_duration:max_duration,
  invert_step:1,
  delay_invert:true,
  id_prefix:"e7_",
  callback:setStyle
 })

  return (
    <div class="w-full h-full bg-slate-700">
      <div class="w-full h-full flex items-center justify-center">
        <div 
          class="w-[95%] h-[95%] bg-[#21d9cd] border-4 border-[#21d9cd]  flex flex-col rounded-md justify-center justify-items-center items-center">
          {animProps.boxes.map((e) => e)}
        </div>
      </div>
    </div>
  )
}
const start_sidebar=(()=>{
    animProps.animations.start_forward()
})
const end_sidebar=(()=>{
  animProps.animations.start_animation.call(0)
})
 
  // animProps.start_timeline = animator.Timeline({
  //   duration: 100,
  //   render_interval: 20,
  //   length: 1,
  //   loop: true,
  //   callback: {
  //     callback: (({ time }) => {
  //       if(time==0 || time==80) console.log("----------timeline event----------")
  //       console.log("time " + time)
  //       if (time == 0) {
  //         lambda_call(`${animProps.start_random.id}`)
  //       }
  //       else if (time == 80) {
  //         const selected_index = get_constant_number(`${animProps.selected.id}`)
  //         console.log("reverting animation " + selected_index)
  //         reorient_duration({index:selected_index,min_duration:3,max_duration:8})
  //         reorient_target({index:selected_index,step:0,direction:1, reference:get_constant_row(`${animProps.reference_matrix.id}`, 0),matrix_row:0, verbose:true})
  //         start_animations([selected_index])
         
  //       }
  //       if(time==0 || time==80)  console.log("--------------------------------")
  //     }),
  //     animProps: animProps
  //   }
  // })

//old
// animProps.reference_matrix= animator.constant({
//   type: "matrix",
//   value: reference_matrix
// })
// animProps.indices= animator.constant({
//   type: "matrix",
//   value: [animProps.indices]
// })
// animProps.reorient = animator.Lambda({
//   callback:  (({indices,direction,ref_matrix,max_distance,max_duration,min_duration})=>{
//     indices.map((index,i)=>{
//       const current= get_lerp_value(index)
//       const ref=ref_matrix.get((i*2)+direction)
//       if(ref[1]==current){
//         return console.log("target animation is reachead")
//       }
//       max_distance=0
//       current.map((c,i)=>{
//         const distance =Math.abs(c-ref[i])
//        max_distance=max_distance<distance?distance:max_distance
//        }
//        )
//       hard_reset(index)
//       reorient_target({
//         index:index,
//         step:0,
//         direction:1,
//         matrix_row:0,
//         verbose:true,
//         reference:ref
//       });
//       const duration = reorient_duration_by_progress({
//         index:index,
//         min_duration:min_duration,
//         max_duration:max_duration,
//     })
//     console.log(`index: ${index} i: ${i} 
//       new_duration ${duration}
//       current_position: ${current[0]}, ${current[1]} target_position ${ref[0]}, ${ref[1]} `
//     )
//     })
//   })
// })
// animProps.start_animation = animator.Lambda({
//   callback:  ((direction)=>{
//     const ref_matrix=get_constant(`${animProps.reference_matrix.id}`,"matrix")
//     const indices=get_constant_row(`${animProps.indices.id}`,0)
//     lambda_call(`${animProps.reorient.id}`,{
//       indices:indices,
//       direction:direction,
//       ref_matrix:ref_matrix,
//       max_distance:`${animProps.max_distance}`,
//       max_duration:`${animProps.max_duration}`,
//       min_duration:`${animProps.min_duration}`
//     })
//     start_animations(indices)
//   }),
//   animProps:animProps
// }) 
const exampleProps={
  
  // this is just util stuff for the example project
 mdFile: `\`\`\`javascript
 import   {start_animations,setMatrix,get_lerp_value, get_constant_row,set_duration} from 'kooljs/worker'
const animProps={
  animator:undefined,//                      <- animator               << Animator >> 
  start_animation:undefined,//               <- random values + start  << Animator.Lambda >>
  size_animation:undefined,//                <- single number lerp     << Lerp >>
  size_constant:undefined,//                 <- xy                     << Constant-Matrix >>
  color_animation:undefined,//               <- xyz                    << MatrixLerp >> 
  size_constant_id:undefined,//              <- we need before init    << Number >>
  size_duration_max:10//                     <- duration               << Number >>
}
function bg(val){
  return \`linear-gradient(to right, rgb(0,0,0), rgb(\${val[0]}, \${val[1]}, \${val[2]})\`
}
function setStyle(val){
  //console.log(val)
  document.getElementById("inner").style.width = \`\${Math.floor(val[0])}%\`;
  document.getElementById("inner").style.height = \`\${Math.floor(val[1])}%\`;
}
function Example(animator) {
    animProps.animator=animator

    animProps.color_animation=animator.Matrix_Lerp({
      render_callback:((val)=>document.getElementById("main").style.background = (bg(val))),
      steps:[[0,0,0],[50,50,255]],
      duration:animProps.size_duration_max
    })
    animProps.size_animation=animator.Matrix_Lerp({ 
        render_callback:((val)=>setStyle(val)),
        duration: animProps.size_duration_max, 
        steps: [[1,1],[100,100]],
    })
    animProps.size_constant_id=animator.get_constant_size("matrix")+1

    animProps.start_animation = animator.Lambda({
      callback:  (()=>{
        setMatrix(\`\${animProps.color_animation.id}\`,1, [Math.random()*50, Math.random()*50, Math.random()*255]);
        // for the size animations of the div
        console.log(\`\${animProps.size_animation.id}\`)
        const current= get_lerp_value(\`\${animProps.size_animation.id}\`)
        const target=get_constant_row(\`\${animProps.size_constant_id}\`,0)
        if(target==current){
          target[0]+=1
          target[1]+=1
        }
        const duration = (Math.max(...target.map((val, index) => Math.abs((val - current[index])+0.1)))/70)+1*\`\${animProps.size_duration_max}\`;
        console.log("duration " +duration)
        setMatrix(\`\${animProps.size_animation.id}\`,1, target);
        set_duration(\`\${animProps.size_animation.id}\`, duration )
        start_animations([\`\${animProps.size_animation.id}\`])
      }),
      animProps:animProps
    }) 

    animProps.size_constant=animator.constant({
      type:"matrix",
      value:[[70,70]],
      render_triggers:[animProps.color_animation.id],                       // the trigger fields starts color_animation
      render_callbacks:[{id:animProps.start_animation.id,args: undefined }] // the callback fields starts start_animation
    })

    return (
    <div class="w-full h-full bg-slate-700">
      <div class="w-full h-full flex items-center justify-center">
      <div id={"main"} key={"main"} class="w-[95%] h-[95%] bg-[#21d9cd] border-4 border-[#21d9cd] flex rounded-md justify-center justify-items-center items-center">
      <div id={"inner"} key={"inner"} class="w-10 h-10 bg-white">
          inner
      </div>
      </div>
    </div>
    </div>
  )}
const set_size=(()=>{
    animProps.animator.update_constant([{type:"matrix",id:animProps.size_constant.id,value:[[(30+Math.random()*70),30+Math.random()*70]]}])
})

  \`\`\``, Controls:[
  {
    info:"calls the lambda start_animation with direction 1",
    button:{
      name:"start",
      onClick: start_sidebar
    },
  },  
  {
    info:"calls the lambda start_animation with direction 0",
    button:{
      name:"stop",
      onClick: end_sidebar
    },
  },
],
info:{
  name:"sidebar",
  description:` This is a demonstration about how to use constant triggers and callbacks when updating it. You can use the render_triggers and render_callbacks fields in the constant contstructor. They will get trigger/called when you update the constructor.`,
  gitlink:"https://github.com/ji-podhead/kooljs/blob/main/livedemo_project/src/examples/e6.js",
}
}
export { Example, exampleProps}

