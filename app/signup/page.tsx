import { useState } from "react"

const Page =()=>{
    const [inputs, setInputs] = useState({
        firstname:"",
         lastname:"",
         role:"",
         email:""
    })
    return <div> 
        
        <input placeholder="First Name"/>
        <input placeholder="Last Name"/>
        <input placeholder="email"/>
        <input placeholder=""/>
    
        </div>
}
export default Page