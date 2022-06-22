

const io=require("socket.io")(process.env.PORT || 5000,{
    cors:{
        origin: "*"
    }
});
var words=["time", "person", "year", "way", "day", "thing", "man", "world", "life", "hand", "part", "child", "eye", "woman", "place", "work", "week", "case", "point", "government", "company", "number", "group", "problem", "fact", "Wedding", "Blood", "Access", "Car", "Period", "Meal", "Service", "Health", "Drawing", "Chocolate", "Definition", "Profit", "Singer", "Platform", "Fun", "Tennis", "Recognition", "Body", "Accident", "Position", "Morning", "Reality", "Mall", "Promotion", "Way", "Quantity", "Preparation", "Source", "Network", "Refrigerator", "Pollution", "Student", "Profession", "Apple", "Emotion", "Client", "Friendship", "Statement", "Kind", "Voice", "Tea", "Personality", "Player", "Heat", "Newspaper", "Figure", "Thing", "Oil", "Soup", "Cigarette", "Administration", "Vehicle", "Sport", "Concept", "Wealth", "Term", "Story", "Response", "Card", "Bathroom", "Marriage", "Speaker", "Course", "Brother", "Variety", "Sense", "Direction", "Buyer", "Hand", "Reflection", "Lab", "Dirt", "Boy", "Bedroom", "System", "Enthusiasm", "Introduction", "Week", "Scene", "Address", "Difficulty", "Site", "Delivery", "View", "Appointment", "Opportunity", "Benefit", "Picture", "Soil", "Industry", "Chest", "Ball", "Ability", "Gene", "Measurement", "Meaning", "Worker", "Topic", "Hair", "Safety", "House", "Store", "Level", "Page", "Performance", "Interest", "Television", "College", "Environment", "Screen", "Paint", "Experience", "Maintenance", "Extent", "Throat", "Culture", "Film", "Death", "Description", "Instruction", "Two", "Advantage", "Share", "Courage", "Impression", "Bonus", "Confusion", "Market", "Mixture", "Board", "Error", "Half", "Science", "Elevator", "Drawer", "Audience", "Communication", "Wife", "Strategy", "Child", "Number", "Advertising", "Distribution", "Union", "Temperature", "Injury", "Software", "Gift", "Agreement", "Revenue", "Employer", "Apartment", "Preference", "Type", "Value", "Equipment", "Class", "Art", "Responsibility", "Mud", "Contact", "Day", "Priority", "Expression", "Pizza", "Sample", "Office", "Medium", "Inspector", "Idea", "Truth", "Issue", "Part", "Establishment", "Discipline", "Queen", "Room", "Frame", "Tool", "Loss", "Writing", "Chicken", "Process", "Permission", "Secretary", "Disk", "Matter", "Job", "Space", "Product", "Group", "Inspection", "Name", "Advice", "Earth", "Information", "Love", "Assignment", "Procedure", "Diamond", "Woman", "Reason", "Competition", "Assumption", "Girlfriend", "Owner", "Rule", "Context", "Army", "Operation", "Church", "King", "Interaction", "Finding", "Appearance", "Event", "Importance", "Location", "Size", "Awareness", "Construction", "Thanks", "Database", "Passion", "People", "Garbage", "Meat", "Wind", "Square", "Aunt", "Focus", "Outside", "Clothes", "Effort", "Committee", "Menu", "Midnight", "Metal", "Place", "Food", "Coffee", "Republic", "Stock", "Trade", "Example", "Method", "Sound", "Side", "Law", "Charity", "Hearing", "Flight", "Date", "Possibility", "Moment", "Cause", "Key", "War", "Opinion", "Variation", "Top", "Customer", "Leadership", "Care", "Studio", "Protection", "Stress", "Computer", "Percentage", "Professor", "Resource", "Message", "Nature", "Bit", "Demand", "Agency", "Price", "Freedom", "Relation", "Cash", "End", "Fortune", "Membership", "Editor", "Efficiency", "Craft", "Entry", "Role", "Feature", "Perspective", "Leader", "Emphasis", "Discussion", "Article", "Assistance", "Bird", "Failure", "Standard", "Form", "Bad", "Box", "Significance", "Cousin", "Rock", "Employment", "Eye", "Setting", "Childhood", "Pressure", "Proposal", "Atmosphere", "Machine", "Tale", "Penalty", "Engine", "Sun", "Negotiation", "Technology", "Instance", "Version", "Cancer", "Payment", "Bottom", "Condition", "Contribution", "Organization", "Psychology", "Record", "Theory", "Subject", "Height", "Fire", "Candidate", "Situation", "Literature", "Length", "Post", "Material", "Inside", "Basis", "Championship", "Bus", "Town", "Dinner", "State", "Population"]

var activerooms=[]
var numClients = {};
var names={};
var nameandroombyid={};
var num={}
var score={}
var temp={}
var word=""
var leftuser={}
var tempcurrname={}
var round={}

io.on("connection", socket=>{
    console.log(socket.id)
    socket.on("join",val=>{
        // console.log(val)
        // if(!activerooms.includes(val))
        {
        socket.join(val)
        num[val]=-1
        if (numClients[val] == undefined) {
            let tempwordnum= Math.random();
            tempwordnum*=100;
            tempwordnum=Math.floor(tempwordnum);
            word=words[tempwordnum]
            score[val]={}
            numClients[val] = 1;
        } else {
            numClients[val]++;
        }
    }
   });


socket.on("disconnecting",()=>{
  
    // console.log(nameandroombyid[socket.id])
    console.log("exit")
    if(nameandroombyid[socket.id])
    {
        var room=nameandroombyid[socket.id][1]
        var name=nameandroombyid[socket.id][0]
        if(!leftuser[room])
        leftuser[room]=[name]
        else
        leftuser[room].push(name)
        numClients[room]--;
        if(numClients[room]==0)
        {
            // var i=activerooms.indexOf(room)
            // var l=activerooms.length-1
            // activerooms[i]=activerooms[l];
            // activerooms.pop(); 
            names[room]=[]
            // console.log("0")
        }
        var i=names[room].indexOf(name)
        var l=names[room].length-1
        names[room][i]=names[room][l];
        names[room].pop();
        io.to(room).emit("disc",names[room])
    }
})


    
    socket.on("name",({name,room})=>{
        
        // activerooms.includes(room)?"":activerooms.push(room)
        if(!score[room][name])
        {
            score[room][name]=0;  
        }

        if(!names[room])
        {
            names[room]=[name]
            io.to(room).emit("players",names[room])
        }
        else{
            if(!names[room].includes(name))
            {
                names[room].push(name)
                io.to(room).emit("players",names[room])
            }
            
        }
        if(!nameandroombyid[socket.id])
        {
            nameandroombyid[socket.id]=[name,room]
        }
        
        // else{
        //     nameandroombyid[socket.id].push(name)
        // }
        if(names[room].length==numClients[room])
        // {
        //     if(!activerooms.includes(room))
        //     activerooms.push(room)
        {
            if(!(leftuser[room] && leftuser[room].length==0))
            {
            var r=Math.random();
            r=r*(numClients[room]);
            r=Math.floor(r)
            var currname=names[room][r];
            tempcurrname[room]=currname
           
            }
            
            else{
            currname=tempcurrname[room]
            leftuser[room].pop()
            }
            // names[room]=[]
            io.to(room).emit("current",currname,word)
        }
        // io.to(room).emit("name",name,numClients[room],names[room])

    })

    socket.on("scores",(room)=>{
        let tempwordnum= Math.random();
        tempwordnum*=100;
        tempwordnum=Math.floor(tempwordnum);
        word=words[tempwordnum]
        if(!round[room])
        round[room]=1
        else
        round[room]++;
        leftuser[room]= undefined
        names[room]=[]
        temp[room]=[]
        io.to(room).emit("scores",score[room])
    })

    socket.on("right",(room,name)=>{
        if(!temp[room])
        temp[room]=[]
        temp[room].push(name)
        score[room][name]+= 100-(temp[room].length-1)*10
        score[room][currname]+=100
    })

    socket.on("exit",({room,name})=>{
       console.log("exit")
        numClients[room]--;
        var i=names[room].indexOf(name)
        var l=names[room].length-1
        names[room][i]=names[room][l];
        names[room].pop();
    })

    socket.on("drawing",(data,room)=>{
     socket.to(room).emit("draw",data)   
    })
    socket.on("guess",({room,name,guess})=>{
        if(guess==word)
        {
            io.to(socket.id).emit("correct")
        }
        io.to(room).emit("guess",guess,name,word)
    })
    socket.on("clear",(room)=>{
        io.to(room).emit("clear")
    })
    socket.on("change",({room,userval})=>{
      
        io.to(room).emit("change",userval)
    })
    
})