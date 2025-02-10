
import './App.css';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Animator } from "kooljs/animator"
import {  Example as E1 } from './examples/e1';
import {  Example as E2 } from './examples/e2';
import {  Example as E3} from './examples/e3';
import {  Example as E4} from './examples/e4';
import {  Example as E5} from './examples/e5';
import {  Example as E6} from './examples/e6';

import { Widgets, AnimationControl, Header, CodeBlocks } from "./utils"
const Animated_Components = []
const animator = new Animator(50)
function App() {
  
    const [fps, setFps] = useState(24)
  const [play, setPlay] = useState(false)
  const [selector, setSelector] = useState(-1)
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

    <div class="App  bg-[#242d36] w-full h-full flex flex-col  items-center justify-center" style={{ width: window.innerWidth, height: window.innerHeight }}>
      <div class=" w-[95%]  h-[7%] " >
        <Header />
      </div>
      <div class="flex flex-col w-[95%] h-[90%] items-center justify-center">

        <div class="w-full h-full flex flex-row">
          <div class="w-[20%] h-full ">
            <AnimationControl args={{ sel: selector }} />
          </div>
          <div class="w-[80%] h-full flew flex-col bg-white border-r-4 border-r-[#BF8DE1] rounded-br-md border-b-[#BF8DE1]">
            <div class="w-full h-[50%] flex flex-row">
              <div class="w-full h-full flex flex-row">
                <div class="w-[90%] h-full">
                  {Animated_Components[selector]}
                </div>
                <div title="Documentation" class="w-full h-full overflow-scroll">

                {/* <div title="Documentation" class="w-full h-full overflow-scroll">
                <iframe src={new URL("./docs/docs.html", import.meta.url)}  frameborder="0" width="100%" height="100%"></iframe>
       </div> */}
       </div>
                <div class="w-[10%] h-full ">
                  <Widgets setsel={setSelector} animator={animator} />
                </div>
              </div>
            </div>
            <div class="h-[50%] w-full ">
              <CodeBlocks sel={selector} />
            </div>
          </div >
        </div>
      </div>
    </div>
  );
}

export default App;
{/* <table>
<tr>
<td> <h1> KoolJs</h1>
</td>
</tr>
    <tr>
       <td>
          <a href="https://ji-podhead.github.io/opnsense-helper/.docs/_build/html/index.html"> 
<img alt="Static Badge" src="https://img.shields.io/badge/Api%20Docs-%F0%9F%93%96%20-grey?style=for-the-badge&color=lightblue">        </td>
        <td>
            <a href="https://pypi.org/project/opnsense-helper/">
            <img alt="PyPI - Version" src="https://img.shields.io/pypi/v/opnsense-helper?style=for-the-badge&link=https%3A%2F%2Fpypi.org%2Fproject%2Fopnsense-helper%2F">
            </a>
        </td>
        <td>
        <img alt="Static Badge" src="https://img.shields.io/badge/Ansible%20Collection-%F0%9F%9A%A7-darkgrey?style=for-the-badge&color=red">
        </td>
    <td>
    <a href="https://github.com/ji-podhead/opnsense-helper/">
             <img alt="Static Badge" src="https://img.shields.io/badge/open%20source-blue?style=for-the-badge&logo=github">
            </a>
        </td>
    </tr>
</table> */}