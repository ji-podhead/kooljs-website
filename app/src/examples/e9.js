import { start_animations, setMatrix, get_lerp_value, get_constant_row, set_duration, hard_reset, lambda_call, get_constant_number, reorient_duration, reorient_target, reorient_duration_by_distance, get_constant, reorient_duration_by_progress, get_group_values, is_active, set_group_orientation, start_group, reverse_group_delays, stop_animations } from 'kooljs/worker_functions'
import { useRef } from 'react'
const animProps = {
  animator: undefined,//                 <- animator               << Animator >> 
  animations: undefined,//           <- boxes dict             << div | MatrixLerp >> 
  boxes: undefined,//  <- anim id's              << Float32 >> 
  direction: undefined,
  sidebar_animation: undefined,
  button_animation: undefined,
  start_animation: undefined,
  button_reference: undefined,
  sidebar_reference: undefined,
  timeline: undefined,
  timelineid:undefined,
  sidebar_state:false,
  button_state:false
}
function bg(val) { return `linear-gradient(to right, rgb(255,50,50), rgb(${val[3]}, ${val[4]}, ${val[5]})` }
function setStyle(items, prefix) {
  items.forEach((val, id) => {
    //console.log(prefix+id+" " + val)
    const doc = document.getElementById(prefix + id)
    doc.style.transform = `translate(${val[0]}%,${val[1]}%)`;
    doc.style.opacity = `${val[2]}%`;
    doc.style.background = bg(val);
    const doc2 = document.getElementById("e9_" + id)
    doc2.style.opacity = `${val[2]}%`;
  })
}
function sidebar_style(val) {
  const doc = document.getElementById("sidebar")
  if(val[2]==1){
    if(!animProps.sidebar_state){
      document.getElementById("button_child").style.pointerEvents = "none"  
    }
    else if(animProps.button_state){ 
    document.getElementById("button_child").style.pointerEvents = "all"
    animProps.button_state=false
    }
    
  }
  doc.style.width = `${val[0]}%`;
  //doc.style.height = `${val[1]}%`;
  doc.style.opacity = `${val[2]}%`;
}
function button_style(val) {
  //var doc = document.getElementById("button")
  //doc.style.opacity = `${val[2]}%`;
  var doc = document.getElementById("button_child")
  //doc.style.width = `${val[0]}%`;
  //doc.style.height = `${val[1]}%`;
  doc.style.opacity = `${val[2]}%`;
  // doc.style.color=`rgba(255,255,255 ${val[2]}) `
}
function Example(animator) {
  const length = 7
  animProps.boxes = new Array(length)
  const reference_matrix = []
  animProps.animator = animator
  const a = [100, 0, -100, 0, 100, 0]
  const b = [0, 0, 100, 150, 50, 255]
  const c = [0, 50, 0, 100, 0, 100]
  reference_matrix.push([a, b, c]) // uni size reference matrix, so it can be used for all boxes
  for (let i = 0; i < length; i++) {
    animProps.boxes[i] = <div class="transform h-10 w-40 left flex items-center rounded-md justify-center " id={"e9__" + i} key={"e9__" + i} style={{ transform: `translate(0%,0%)` }}>
      <div id={"e9_" + i} key={"e9_" + i} class="w-full h-full truncate opacity-0  border-[#21d9cd] border-2 rounded-md flex-col gap-2 items-center justify-center" >
        <div class="text-center  "><b>Div No: {i}</b></div>
        <div class="text-left w-[80%] h-[10%] pl-2" >
          Line: --{1 + Math.floor(i / length)}--
        </div>
      </div>
    </div>
  }
  animProps.direction = animator.constant({
    type: "number",
    value: 0
  })
  animProps.sidebar_reference = { start: [0, 0,0], end: [20, 100,100] }
  animProps.sidebar_animation = animator.Matrix_Lerp({
    render_callback: sidebar_style,
    steps: [animProps.sidebar_reference.start, animProps.sidebar_reference.end],
    duration: 10
  })
  animProps.button_reference = { start: [0, 0,0], end: [100, 100,100] }
  animProps.button_animation = animator.Matrix_Lerp({
    render_callback: button_style,
    steps: [animProps.button_reference.start, animProps.button_reference.end],
    duration: 10
  })
  animProps.animations = animator.Matrix_Chain({
    reference_matrix: reference_matrix,
    length: length,
    min_duration: 5,
    max_duration: 7,
    group_loop: false,
    sequence_length: 1,
    custom_delay: {
      callback: ({ animation_index, index, indices, progress, direction, target_step }) => {
        if (direction == 0) {
          const new_delay = `${animProps.delay}` + (indices.length - index) * `${animProps.delay_spread}`
          return new_delay
        }
        else {
          const new_delay = `${animProps.delay}` + (index) * `${animProps.delay_spread}`
          return new_delay
        }
      },
      animProps: {
        delay: 0,
        delay_spread: 1
      }
    },
    id_prefix: "e9__",
    callback: setStyle
  })
  animProps.start_animation = animator.Lambda({
    callback: (({ direction }) => {
      const group_values = get_group_values(`${animProps.animations.id}`)
      if (direction == 1) {
        if (!group_values.active) {
          set_group_orientation(`${animProps.animations.id}`, [0, 1])
          start_group([1], [`${animProps.animations.id}`], true, true)
        } else {
          const pref_dir = group_values.orientation[0]
          set_group_orientation(`${animProps.animations.id}`, [2, 1])
          start_group([1], [`${animProps.animations.id}`], "progress", false)
          if (pref_dir == 2) {
            reverse_group_delays(`${animProps.animations.id}`)
          }
        }
      } else {
        if (!group_values.active) {
          set_group_orientation(`${animProps.animations.id}`, [1, 2])
          start_group([1], [`${animProps.animations.id}`], true, true)
        }
        else {
          if (group_values.orientation[0] == 0) {
            set_group_orientation(`${animProps.animations.id}`, [2, 1])
            start_group([0], [`${animProps.animations.id}`], "progress", false)
          }
          else {
            set_group_orientation(`${animProps.animations.id}`, [2, 1])
            if (group_values.active) {
              start_group([0], [`${animProps.animations.id}`], "progress", false)
              reverse_group_delays(`${animProps.animations.id}`)
            }
            else {
              start_group([0], [`${animProps.animations.id}`], true, true)
              reverse_group_delays(`${animProps.animations.id}`)
            }
          }
        }
      }
    }),
    animProps: animProps
  })
  animProps.timelineid=animator.get_size()
  animProps.timeline = animator.Timeline({
    duration: 30,
    render_interval: 10,
    length: 1,
    loop: false,
    callback: {
      callback: (({ time }) => {
        console.log("----------timeline event----------")
        const direction = get_constant_number(`${animProps.direction.id}`)
        var sidebar_state,button_state,group_state
        const group_values = get_group_values(`${animProps.animations.id}`)
        if(direction==1){
          sidebar_state=get_lerp_value(`${animProps.sidebar_animation.id}`)==[`${animProps.sidebar_reference.start}`]
          button_state=get_lerp_value(`${animProps.button_animation.id}`)==[`${animProps.button_reference.end}`]
          group_state=!group_values.active || (group_values.progress == 0)
        }
        else{
          sidebar_state=get_lerp_value(`${animProps.sidebar_animation.id}`)==[`${animProps.sidebar_reference.end}`]
          button_state=get_lerp_value(`${animProps.button_animation.id}`)==[`${animProps.button_reference.start}`]
          group_state= group_values.active || (group_values.progress == 1)
        }
        const start = (animation, ref, direction) => {
          reorient_target({
            index: animation,
            step: 0,
            direction: 1,
            reference: ref,
            matrix_row: 1
          })
          reorient_duration_by_progress({
            index: animation,
            max_duration: 10,
            min_duration: 5,
            soft_reset: true,
          })
        }
        console.log("time " + time)
        if (time == 0) {
          if (direction == 1) {
            if (!group_values.active) {
              if (!button_state) {
                start(`${animProps.button_animation.id}`, [`${animProps.button_reference.start}`], 1)
              }
              else {
                start(`${animProps.sidebar_animation.id}`, [`${animProps.sidebar_reference.end}`], 1)
              }
            }
            else {
              lambda_call(`${animProps.start_animation.id}`, { direction: 1 })
              stop_animations([`${animProps.timelineid}`])
            }
          }
          else {
            if (!group_values.active) {
              lambda_call(`${animProps.start_animation.id}`, { direction: 0 })
            }
            else if (!sidebar_state) {
              start(`${animProps.sidebar_animation.id}`, [`${animProps.sidebar_reference.start}`], 0)
            }
            else if (!button_state) {
              start(`${animProps.button_animation.id}`, [`${animProps.button_reference.end}`], 0)
              stop_animations([`${animProps.timelineid}`])
            }
          }
        }
        else if (time == 10) {
          if (direction == 1) {
            if (!group_values.active) {
              if (!sidebar_state) {
                start(`${animProps.sidebar_animation.id}`, [`${animProps.sidebar_reference.end}`], 1)
              }
            }
            else {
              lambda_call(`${animProps.start_animation.id}`, { direction: 1 })
              stop_animations([`${animProps.timelineid}`])
            }
          }
          else{
            if (!sidebar_state) {
              start(`${animProps.sidebar_animation.id}`, [`${animProps.sidebar_reference.start}`], 0)
            }
            else if(!button_state){
              start(`${animProps.button_animation.id}`, [`${animProps.button_reference.end}`], 0)
              stop_animations([`${animProps.timelineid}`])
            }
          }
        }
        else if (time == 20){
          if(direction==1){
            if(!group_values.active) {
                lambda_call(`${animProps.start_animation.id}`, { direction: direction })
            }
        }
        else if(!button_state){
          start(`${animProps.button_animation.id}`, [`${animProps.button_reference.end}`], 0)
        }
        }
        console.log("--------------------------------")
      }),
      animProps: animProps
    }
  })
  
  return (
    <div class="w-full h-full bg-slate-700">
      <div class="w-full h-full flex items-center justify-end" >
        <div id="button" class="absolute self-start justify-self-start   w-[5%] aspect-square"> 
          <button id="button_child" class="w-[90%] h-[90%] text-white bg-slate-800 border-4 border-[#216762]" 
            onMouseEnter={(() => {
              //if(!animProps.sidebar_state){
              animProps.button_state=true
              start_sidebar()
              //}
            })}
            onMouseLeave={(() => {
              if(animProps.sidebar_state){
              animProps.button_state=false
              stop_sidebar()
              }
            })
            }>
            #
          </button>
        </div>
        <div id="sidebar" class="w-[0%] h-[95%] border-4 border-[#21d9cd]     rounded-md rounded-r-none ">
          <div  class="w-full h-full flex flex-col justify-center justify-items-center items-center"
          onMouseEnter={(() => {
            if(!animProps.button_state){
              animProps.sidebar_state=true
              start_sidebar()
          }
          })
          }
          onMouseLeave={(() => {
            animProps.sidebar_state=false
            stop_sidebar()
          })
          }>
          {animProps.boxes.map((e) => e)}
          </div>
        </div>
      </div>
    </div>
  )
}
const start_sidebar = (() => {
  animProps.animator.update_constant([{ id: animProps.direction.id, type: "number", value: 1 }])
  animProps.animator.reset_animations([animProps.timeline.id])
  animProps.animator.start_animations([animProps.timeline.id])
})
const stop_sidebar = (() => {
  animProps.animator.update_constant([{ id: animProps.direction.id, type: "number", value: 0 }])
  animProps.animator.reset_animations([animProps.timeline.id])
  animProps.animator.start_animations([animProps.timeline.id])
})

const exampleProps = {

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

  \`\`\``, Controls: [
    {
      info: "calls the lambda start_animation with direction 1",
      button: {
        name: "start",
        onClick: start_sidebar
      },
    },
    {
      info: "stop the group",
      button: {
        name: "stop",
        onClick: stop_sidebar
      },
    },
  ],
  info: {
    name: "Chain loop",
    description: `This is a demonstration on how to use MatrixChain. It will create a group of  animations for you. The MatrixChain class uses a reference matrix to switch between 2 states. You basically have a start step and a target step. The matrix lerp animations that get created have a step length of 2 however. You can update the target step, by calling the animator method.`,
    gitlink: "https://github.com/ji-podhead/kooljs/blob/main/livedemo_project/src/examples/e6.js",
  }
}
export { Example, exampleProps }

