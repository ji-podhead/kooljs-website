
import './App.css';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Animator } from "kooljs/animator"
import { Example as E1 } from './examples/e1';
import { Example as E2 } from './examples/e2';
import { Example as E3 } from './examples/e3';
import { Example as E4 } from './examples/e4';
import { Example as E5 } from './examples/e5';
import { Example as E6 } from './examples/e6';

import { Widgets, AnimationControl, Header, CodeBlocks } from "./utils"
const Animated_Components = []
const animator = new Animator(50)
function App() {
  const [selector, setSelector] = useState(-1)
  const [selector_main, setSelector_main] = useState(0)
  useEffect(() => {
    new Promise((resolve) => {
      Animated_Components.push(E1(animator))
      Animated_Components.push(E2(animator))
      Animated_Components.push(E3(animator))
      Animated_Components.push(E4(animator))
      Animated_Components.push(E5(animator))
      Animated_Components.push(E6(animator))
      resolve();
    }).then(() => {
      animator.init(true);
      setSelector(0)
    });
  }, []);

  return (

    <div class="App  bg-[#242d36] w-full h-full flex   items-center justify-center  " style={{ width: window.innerWidth, height: window.innerHeight }}>
     <div class=" w-[96%]  h-[96%] flex flex-col items-center justify-center rounded-md border-4  border-[#BF8DE1] ">
      
      <div class=" w-full  h-[7%] " >
        <Header mainAccessor={{ get: selector_main, set: setSelector_main }} />
      </div>

      <div class="flex  w-full h-[93%] bg-red-50   items-center justify-center">
      {selector_main > 0 && <div class="flex w-full h-full bg-slate-400  items-center justify-center rounded-b-md">
        <div  class="w-[96%] h-[96%] border-[3px] border-slate-700 rounded-md flex items-center justify-center ">
          <iframe  src="https://ji-podhead.github.io/kooljs/docs/html" width="100%" height="100%" class="p-1 rounded-md" ></iframe>
        </div>
      </div>}
        {selector_main <= 0 && <div class="w-full h-full flex  bg-slate-400  items-center justify-center">
          <div class="w-[96%] h-[96%] border-[3px] border-slate-700 rounded-md flex flex-row items-center justify-center">
          <div class="w-[20%] h-full ">
            {selector>=0&&<AnimationControl args={{ sel: selector,animator:animator,setsel:setSelector }} />}
          </div>
          <div class="w-[80%] h-full  bg-white " >
            <div class="w-full h-[50%] flex flex-row">
              <div class="w-full h-full flex flex-row">
                <div class="w-[90%] h-full">
                  {Animated_Components[selector]}
                </div>
                <div class="w-[10%] h-full ">
                  <Widgets setsel={setSelector} animator={animator} />
                </div>
              </div>
            </div>
            <div class="h-[50%] w-full ">
              <CodeBlocks sel={selector} />
            </div>
          </div ></div >

        </div>}
        </div>
      </div>
    </div>
  );
}

export default App;
