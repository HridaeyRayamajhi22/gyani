import React from 'react'
import { assets } from '../../assets/assets'
import {useNavigate} from 'react-router-dom'
import { useState } from 'react'

const SearchBar = ({data}) => {

  const navigate = useNavigate()
  const [input, setInput] = useState(data ? data : '')

  const onSearchHandler = (e)=>{
    e.preventDefault()
    navigate('/course-list/' + input)
  }
  return (
    <form onSubmit = {onSearchHandler} className='max-w-xl w-full md:h-14 h-12 flex items-center bg-white border border-gray-300 rounded-full shadow-sm overflow-hidden'>
      <label htmlFor="search" className="sr-only">Search Courses</label>
      
      <img
        src={assets.search_icon}
        alt="Search"
        className='w-5 h-5 md:w-6 md:h-6 ml-4 mr-2 opacity-70'
      />
      
      <input
        onChange={e=> setInput (e.target.value)} value={input }
        id="search"
        type="text"
        placeholder='Search for courses'
        className='flex-1 h-full outline-none text-gray-700 placeholder:text-gray-400 bg-transparent pr-3 text-sm md:text-base'
      />
      <button
        type='submit'
        className='bg-blue-600 text-white px-6 h-full text-sm md:text-base hover:bg-blue-700 transition cursor-pointer'
      >
        Search
      </button>
    </form>
  )
}

export default SearchBar
