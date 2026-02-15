import { useDispatch, useSelector } from "react-redux";
import { toggleMenu } from "../utils/appSlice";
import { useEffect, useState } from "react";
import { YOUTUBE_SEARCH_API } from "../utils/constants";
import { cacheResults } from "../utils/searchSlice";

const Head= ()=>{

    const [searchQuery,setSearchQuery]=useState("")
    const [suggestions,setSuggestions]=useState([])
    const [showSuggestions,setShowSuggestions]=useState(false)
    const searchCache=useSelector((store)=>store.search)
    const dispatch=useDispatch();
    useEffect(()=>{
   const timer=setTimeout(()=>{
    if(searchCache[searchQuery]) {
        setSuggestions(searchCache[searchQuery])
    }else{
        getSearchSuggestions()
    }
},200)
   return()=>{
    clearTimeout(timer)
   }
    },[searchQuery])

    const getSearchSuggestions= async()=>{
        const data= await fetch(YOUTUBE_SEARCH_API+searchQuery)
        const json=await data.json()
        setSuggestions(json[1])

        dispatch(
        cacheResults({
            [searchQuery]:json[1],
    }))
    }
    const toggleMenuHandler=()=>{
        dispatch(toggleMenu())
    }

    return (
    <div className="grid grid-flow-col p-5 m-2 shadow-lg">
      <div className="flex col-span-1">
        <img
        onClick={toggleMenuHandler}
        className="h-8 cursor-pointer"
         alt="menu" 
         src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Hamburger_icon.svg/960px-Hamburger_icon.svg.png"/>
         <a href="/">
       <img
       className="h-10 mx-2" 
       alt="logo" 
       src="https://as1.ftcdn.net/v2/jpg/03/00/38/90/1000_F_300389025_b5hgHpjDprTySl8loTqJRMipySb1rO0I.jpg"/>
       </a>
        </div> 
        <div className="col-span-10 px-10">
            <div>
            <input className="px-5 w-1/2 border border-gray-400 p-2 rounded-l-full" type="text"
            value={searchQuery}
            onChange={(e)=>setSearchQuery(e.target.value)}
            onFocus={()=>setShowSuggestions(true)}
            onBlur={()=>setShowSuggestions(false)}/>
            <button className="border border-gray-400 p-2 rounded-r-full px-5 bg-gray-100">
                🔍
            </button>
            </div>
            {showSuggestions && (
                <div className="fixed bg-white py-2 px-2 w-[37rem] shadow-lg rounded-lg border border-gray-100">
                <ul>
                    {suggestions.map((s)=>(
                    <li key={s} className="py-2 px-3 shadow-sm hover:bg-gray-100">
                     {s}
                     </li>
                     ))}
                </ul>
            </div>
            )}
        </div>
        <div className="col-span-1">
            <img
            className="h-12" 
            alt="user" 
            src="data:image/png;base64,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"
            />
        </div>
    </div>
    )
}
 export default Head;