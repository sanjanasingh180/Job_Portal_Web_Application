import React, { useState } from 'react';
import { Button } from './ui/button';
import { Search } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Handle the job search logic
    const searchJobHandler = () => {
        if (query.trim()) { // Avoid search with empty query
            dispatch(setSearchedQuery(query)); // Dispatch the search query to redux
            navigate("/browse"); // Navigate to browse page with the query applied
        }
    };

    return (
        <div className="bg-gradient-to-r from-[#006D77] to-[#83C5BE] py-20 px-4 text-center text-white">
            <div className="max-w-5xl mx-auto">
                {/* Tagline for the Job Portal */}
                <span className="mx-auto px-6 py-2 rounded-full bg-[#F1FAEE] text-[#1D3557] font-medium text-lg">
                    Your Trusted Career Partner
                </span>

                {/* Main Heading */}
                <h1 className="text-4xl sm:text-5xl font-bold my-6 leading-tight">
                    Find Your Dream Job, <br /> Apply, and Succeed
                </h1>

                {/* Description */}
                <p className="text-lg sm:text-xl text-[#D8D8D8] mb-6 max-w-2xl mx-auto">
                    Discover top opportunities and advance your career with ease.
                    Start your job search today with our tailored job listings.
                </p>

                {/* Search Bar */}
                <div className="flex w-full sm:w-[60%] lg:w-[40%] mx-auto bg-white shadow-md border border-[#E1E1E1] rounded-full items-center gap-4 p-2">
                    <input
                        type="text"
                        placeholder="Search for jobs..."
                        onChange={(e) => setQuery(e.target.value)} // Update query as user types
                        value={query} // Bind value of the input to the state
                        className="outline-none border-none w-full px-4 py-2 text-[#333] placeholder-gray-500"
                    />
                    <Button onClick={searchJobHandler} className="rounded-r-full bg-[#006D77] hover:bg-[#004F53] text-white py-2 px-6">
                        <Search className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
