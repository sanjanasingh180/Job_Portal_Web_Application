import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import CompaniesTable from './CompaniesTable'
import { useNavigate } from 'react-router-dom'
import useGetAllCompanies from '@/hooks/useGetAllCompanies'
import { useDispatch } from 'react-redux'
import { setSearchCompanyByText } from '@/redux/companySlice'

const Companies = () => {
    useGetAllCompanies();
    const [input, setInput] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (input.trim() !== "") {
            dispatch(setSearchCompanyByText(input));
        } else {
            dispatch(setSearchCompanyByText('')); // Reset search when input is cleared
        }
    }, [input, dispatch]);

    return (
        <div>
            <Navbar />
            <div className='max-w-6xl mx-auto my-10'>
                <div className='flex items-center justify-between my-5'>
                    <div>
                        <label htmlFor="company-search" className="sr-only">Filter by name</label>
                        <Input
                            id="company-search"
                            className="w-fit"
                            placeholder="Filter by name"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                    </div>
                    <Button onClick={() => navigate("/admin/companies/create")}>New Company</Button>
                </div>
                <CompaniesTable />
            </div>
        </div>
    )
}

export default Companies;
