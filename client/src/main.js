import React from 'react'
import { useEffect, useRef, useState} from "react";
import {useLocation} from "react-router-dom"
import {useNavigate} from "react-router-dom"


import "./App.css";
import { io } from "socket.io-client";


export default function Main() {
var words= ["arpit","singhal","arnav","asati"]
    const socket=useRef(null)
    if(!sessionStorage.getItem("round"))
	{
		sessionStorage.setItem("round",0)
	}
    const location=useLocation()
	const navigate=useNavigate()
	// var f=[]
	const [user,setUser]= useState("");
	const [guess,setGuess]= useState("")
	// const user= useRef("")
	const [round,setRound]= useState()
	const [names,setNames] =useState([])
    const [value,setValue]= useState("")
    const [name,setName]= useState("")

    const [scores,setScores]= useState({})
	// const [readytime,setReadytime]= useState(1)
//   const readytime= useRef(1)
  var time=[1,2,3]


	useEffect(()=>{
		socket.current=io("https://skribbll.herokuapp.com/")
   
		socket.current.on("draw",sockdraw)
		socket.current.on("clear",clear);
		socket.current.on("change",(userval,w)=>{setUser(userval); console.log(userval)})
		// socket.current.on("name",(e,r,n)=>{set(e,r,n)})
		socket.current.on("guess",(e,n,f)=>{
			const p=document.createElement("p")
			var k=document.getElementById("text").childElementCount
			p.id=k
			p.classList.add("clist")
			if(e==f)
			{
			p.innerText=n + " guessed correct"
		    p.style.color="green"
			if(n==name)
			document.getElementById("cancol").style.borderColor="green"
			document.getElementById("text").appendChild(p)
			document.getElementById(k).scrollIntoView(false)
		    }
			else{
			p.innerHTML=`${n} guessed <mark2>${e}</mark2>`
			
			document.getElementById("text").appendChild(p)
			document.getElementById(k).scrollIntoView(false)
			}	
		}
		)
		socket.current.on("players",(e)=>{
			setNames(e)
		})
            socket.current.on("disc",(e)=>{
               setNames(e)
            })

			

			socket.current.on("correct",()=>{
				console.log("right")
				socket.current.emit("right",location.search.split("=")[1].split("&")[0],location.search.split("=")[2])
				
		})
            socket.current.on("current",(e,f)=>{
				// setTest(f)
				// console.log(f)
				// document.getElementById("startingin").style.display="initial";
				
				document.getElementById("names").style.display="none"
				timer()
                setTimeout(()=>{start(e,f)},4000)
				
			})

			socket.current.on("scores",(e)=>{
				sessionStorage.setItem("round",parseInt(sessionStorage.getItem("round"))+1)
				
				const sort = Object.fromEntries(
						Object.entries(e).sort(([,a],[,b]) => b-a)
					);
					
					console.log(sort);
				
				setScores(sort)
				if(sessionStorage.getItem("round")==parseInt(location.search.split("=")[3]))
				{
					console.log("nbkn")
					document.getElementById("roundover").innerHTML="Final Scores and Standings";
					
				}
				document.getElementById("modal").style.display="block"
				
                setTimeout(()=>{again()},5000)   			
			 
			})
	},[])

    useEffect(()=>{
        setValue(location.search.split("=")[1].split("&")[0])
        setName(location.search.split("=")[2].split("&")[0])
		setRound(parseInt(location.search.split("=")[3]))
        socket.current.emit("join",location.search.split("=")[1].split("&")[0])
    },[])

    function start(one,w)
{
	document.getElementById("start").style.display="none"
	document.getElementById("currentdrawer").style.display="initial"
	document.getElementById("wordlength").style.display="initial"

        setUser(one)
        console.log(one, location.search.split("=")[2].split("&")[0])
        document.getElementById("canvas").style.display="initial"
        if(!(one==location.search.split("=")[2].split("&")[0]))
        {
        document.getElementById("currentdrawer").innerHTML= `<mark>${one}</mark> is drawing`
        document.getElementById("wordlength").innerHTML= `It's a <mark>${w.length}</mark> lettered word`
		document.getElementById("guess").style.display="inherit"
        }
		else
		{
			document.getElementById("currentdrawer").innerHTML= `You are drawing`
	        document.getElementById("currword").style.display="initial";
			document.getElementById("currword").innerHTML=w;
			document.getElementById("col").style.display="initial"
			document.getElementById("icon").style.display="initial"
			document.getElementById("bold").style.display="initial"
		}

 setTimeout(()=>{end()},30000)
}

function timer()
{
	var temp=0;
	var intervalid=setInterval(() => {
		if(temp>0)
		document.getElementById(temp-1).style.display="none"
		if(temp<3)
        document.getElementById(temp).style.display="initial"
		
		temp++;
		if(temp==4)
		{
		clearInterval(intervalid)
		}
	}, 1000);
	

}

function end(){
	socket.current.emit("scores",location.search.split("=")[1].split("&")[0])
	
}

	var current = {
		color: 'black'
	  };

	
	  
	
const canvasRef = useRef(null);
const canvasRef2 = useRef(null);
const ctxRef = useRef(null);
const [isDrawing, setIsDrawing] = useState(false);
const [lineWidth, setLineWidth] = useState(1);
const [lineColor, setLineColor] = useState("black");
const [lineOpacity, setLineOpacity] = useState(1);

// Initialization when the component
// mounts for the first time
useEffect(() => {
	const canvas = canvasRef.current;
	const ctx = canvas.getContext("2d");
	ctx.lineCap = "round";
	ctx.lineJoin = "round";
	ctx.globalAlpha = lineOpacity;
	ctx.strokeStyle = lineColor;
	ctx.lineWidth = lineWidth;
	ctxRef.current = ctx;
	console.log(ctx)
}, [lineColor, lineOpacity, lineWidth]);



function drawLine(x0, y0, x1, y1,color, emit){
    ctxRef.current.beginPath();
	ctxRef.current.moveTo(x0, y0);
    ctxRef.current.lineTo(x1, y1);
    // ctx.strokeStyle = color;
	ctxRef.current.strokeStyle=color
    // ctx.lineWidth = 2;
    ctxRef.current.stroke();
    ctxRef.current.closePath();
//    console.log(x0, y0)
    if (!emit) { return; }
    // var w = canvas.width;
    // var h = canvas.height;
      
    socket.current.emit('drawing', {
      x0: x0,
      y0: y0,
      x1: x1,
      y1: y1,
      color: color
    },value);
  }
// Function for starting the drawing
const startDrawing = (e) => {
	// ctxRef.current.beginPath();
	// ctxRef.current.moveTo(
	// e.nativeEvent.offsetX || e.touches[0].clientX,
	// e.nativeEvent.offsetY || e.touches[0].clientY
	// );
	if(name==user){
	setIsDrawing(true);
	current.x = e.nativeEvent.offsetX||e.touches[0].clientX;
    current.y = e.nativeEvent.offsetY||e.touches[0].clientY;
	}


};

// Function for ending the drawing
const endDrawing = (e) => {
	// ctxRef.current.closePath();
	if (!isDrawing  ) {
		return;
		}
	setIsDrawing(false);
	// drawLine(current.x, current.y, e.nativeEvent.offsetX||e.touches[0].clientX, e.nativeEvent.offsetY||e.touches[0].clientY,  true);
};

const draw = (e) => {
	if (!isDrawing ) {
	return;
	}
	
	drawLine(current.x, current.y, e.nativeEvent.offsetX||e.touches[0].clientX, e.nativeEvent.offsetY||e.touches[0].clientY, lineColor, true);
	current.x = e.nativeEvent.offsetX||e.touches[0].clientX;
    current.y = e.nativeEvent.offsetY||e.touches[0].clientY;
};



function sockdraw(data){
   drawLine(data.x0,data.y0,data.x1,data.y1,data.color)
}

const clear=()=>{
	
	ctxRef.current.clearRect(0,0,canvasRef.current.width,canvasRef.current.height) 

}

function sockclear()
{
	if(name==user)
	socket.current.emit("clear",value);
}


function again()
{
	
	if(sessionStorage.getItem("round")==parseInt(location.search.split("=")[3]))
	{
		sessionStorage.clear("round");
		navigate("/")
	}
	window.location.reload() //timeout
}


function check()
{
	socket.current.emit("guess",{room:value,name:name, guess:guess})
}

return (
	<div id="app" className="App center">
		<p id="exit" onClick={()=> {socket.current.emit("exit",{room:value, name:name});
                                    navigate("/");
	}} className='fa-solid fa-arrow-right-from-bracket' > Exit {value}</p>
		<br/>
		<div id="draw center">
			<div className='temp'>
	<span className='head'>Let's DRAW </span>
	<span className='fas pencil'>&#xf303;</span>
	</div>
	<div className='modal' id="modal" style={{"display": "none"}}>
		<div className='modalcontent'>
       <p id="roundover" className='round'>Round {sessionStorage.getItem("round")} over</p>
	   <p id="roundover2" style={{"display":"none"}} className='round'>Final results</p>
        
	   {/* <p className='standings'>Group Standings: </p> */}
	   <i class="fa-solid fa-people-group people"></i>
	   <div id="scores" >

        {
			   
				Object.keys(scores).map((o,index)=>{
					return(
						<div>
                    <span className='sn'>{Object.keys(scores)[index]}</span>
					<span className='sv'>{Object.values(scores)[index]}</span>
                        </div>
					)
				})
			}
		
	</div>
	</div>
	</div>
	<br/>
	<p id="currentdrawer" style={{"display": "none"}}></p>
	<br/>
	<p id="wordlength" style={{"display": "none"}}></p>
    <br/>
	<p id="currword" style={{"display": "none"}}></p>
	<br/>
	<div id="names">
	{
		names.map((p,index)=>{
			return(
			<h5 className='namejoined' id='players'>{names[index]} is ready</h5>
			)
		})
	}
	</div>
	{/* <div id="startingin" style={{"display": "none"}}>
	<h1>Starting in...</h1>
	</div> */}
	{
		time.map((o,index)=>{
			return(

	<p id={index} className="num" style={{"display": "none"}}>{index+1}</p>

			)
		})
	}


	
	
    <button id="start" onClick={()=>{socket.current.emit("name",{name:name,room:value}); document.getElementById("start").style.display="none"}}>Start</button>
	{/* <button onClick={()=>end()}>end</button> */}
	
	<div id="canvas"  className="draw-area center">
		
		
		<canvas id="cancol" style={{"border":"3px solid gray"}} className='center' 
		onMouseDown={(e)=>{startDrawing(e)}}
    onTouchStart={(e)=>startDrawing(e)}
		onMouseUp={(e)=>endDrawing(e)}
		onMouseMove={(e)=>draw(e)}
    onTouchMove={(e)=>draw(e)}
    onTouchEnd={(e)=>endDrawing(e)}
		ref={canvasRef}
		width={"280"}
    height={"220px"}
	
	
		canvas/>
		<br/>
		<div id="icon" className='icon'>
		<span className='fas icons' onClick={()=>{setLineColor("black")}}>&#xf303;</span>
      <span className="fas icons" onClick={()=>{setLineColor("white")}}>&#xf12d;</span>
	  <span className="fas icons" onClick={sockclear}>&#xf2ed;</span>
		</div>
		<br/>
		<div id="col" className='col'>
       <span className='color' style={{"backgroundColor":"black"}} onClick={()=>{setLineColor("black")}}></span>
	   <span className='color' style={{"backgroundColor":"gray"}} onClick={()=>{setLineColor("gray")}}></span>
	   <span className='color' style={{"backgroundColor":"pink"}} onClick={()=>{setLineColor("pink")}}></span>
	   <span className='color' style={{"backgroundColor":"red"}} onClick={()=>{setLineColor("red")}}></span>
	   <span className='color' style={{"backgroundColor":"orange"}} onClick={()=>{setLineColor("orange")}}></span>
	   <span className='color' style={{"backgroundColor":"yellow"}} onClick={()=>{setLineColor("yellow")}}></span>
	   <span className='color' style={{"backgroundColor":"green"}} onClick={()=>{setLineColor("green")}}></span>
	   <span className='color' style={{"backgroundColor":"blue"}} onClick={()=>{setLineColor("blue")}}></span>
	   <span className='color' style={{"backgroundColor":"violet"}} onClick={()=>{setLineColor("violet")}}></span>
	   <span className='color' style={{"backgroundColor":"brown"}} onClick={()=>{setLineColor("brown")}}></span>
		</div>
		<br/>
		<div id="bold" className='bold'>
		<span className='bolditem' onClick={()=>{setLineWidth(1)}}>Normal</span>
		<span className='bolditem' onClick={()=>{setLineWidth(4)}}>bold</span>
		<span className='bolditem' onClick={()=>{setLineWidth(8)}}>bolder</span>
		</div>
		<br/>
	
	</div>
	{/* <button onClick={()=>{document.getElementById("modal").style.display="block"}}>kskvs</button> */}
	<div id="guess" style={{"display": "none"}}>
		<input className='guessinput' onChange={(e)=>setGuess(e.target.value)} maxLength="20"  placeholder="guess"></input>
		<button className='check' onClick={check}>Check</button>
	</div>
    <h5 id="text"></h5>
	</div>

	
	</div>
);
}
