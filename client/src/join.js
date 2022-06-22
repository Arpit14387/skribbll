import React, { useEffect } from 'react'
import {Link} from "react-router-dom"
import { useState } from 'react'
import "./join.css"

export default function Join() {

  const [code,setCode]= useState("")
  const [h,setH]= useState("")
  const [round,setRound] = useState(10)
const [name,setName] =useState("")
  const newWord= ()=>{
    var k=Math.random();
    k=(k+1)*1000+1
    setCode(Math.floor(k))
    // document.getElementById("code").style.display="inherit"
    // document.getElementById("exist").style.display="none"
    setH(Math.floor(k))
    open()
  }

  function open()
  {
    document.getElementById("closed").style.display="none"
    document.getElementById("open").style.display="inherit"

  }
 



  return (
    <div className='join center'>
      <p className='gtw'>Guess the Word</p>
      <p className='k'>One draws, while others guess</p>
       <input className='name' placeholder='Enter your Name' maxLength="12" onChange={(e)=>{setName(e.target.value)}}></input>
      <br/>
      <i id="open" class="fa-solid door fa-door-open" style={{"display": "none"}}></i>
      <i id="closed" class="fa-solid door fa-door-closed"></i>
      <br/>
      <button className='new' onClick={newWord}>New Room</button>
      <input id='code' placeholder="Code" value={h} onChange={(e)=>setH(e.target.value)}></input>
      <button id="exist">Join Room</button>

      {/* <p id="code" style={{"display": "none"}}>Code: {code}</p> */}
   <br/>
		
    <Link className='go' to={`/code?code=${h}&name=${name}&round=${round}`}>PLAY!!!</Link>
    <br/>
    <label>
      Rounds:
    <input className='rounds' type="number" placeholder='No. of Rounds' value={round} onChange={(e)=>setRound(e.target.value)}></input>
    </label>
    {/* <button id="invite" style={{"display":"none","textAlign":"center"}}>Send Invite</button> */}

    </div>
  )
}
