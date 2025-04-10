import React, { useState } from 'react';
import Navbar from './shared/Navbar';
import { Avatar, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Contact, Mail, Pen } from 'lucide-react';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import AppliedJobTable from './AppliedJobTable';
import UpdateProfileDialog from './UpdateProfileDialog';
import { useSelector } from 'react-redux';
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs';

const Profile = () => {
    useGetAppliedJobs();
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth);

    if (!user?.profile) {
        return (
            <div>
                <Navbar />
                <div className='max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8'>
                    <p className="text-center text-lg font-medium">Profile data is missing or incomplete.</p>
                </div>
            </div>
        );
    }

    const { fullname, profilePhoto, bio, email, phoneNumber, skills, resume, resumeOriginalName } = user.profile;

    const isResumeAvailable = Boolean(resume);

    const defaultProfileImage = "https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg";

    return (
        <div>
            <Navbar />
            <div className='max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8'>
                <div className='flex justify-between'>
                    <div className='flex items-center gap-4'>
                        <Avatar className="h-24 w-24 rounded-full">
                            <AvatarImage
                                // Display default image if profile photo is not available
                                src={profilePhoto || defaultProfileImage}
                                alt={fullname || "Profile"}
                                className="rounded-full"
                            />
                        </Avatar>
                        <div>
                            <h1 className='font-medium text-xl'>{fullname}</h1>
                            <p>{bio || "No bio available"}</p>
                        </div>
                    </div>
                    <Button onClick={() => setOpen(true)} className="text-right" variant="outline">
                        <Pen />
                    </Button>
                </div>
                <div className='my-5'>
                    <div className='flex items-center gap-3 my-2'>
                        <Mail />
                        <span>{email || "Not provided"}</span>
                    </div>
                    <div className='flex items-center gap-3 my-2'>
                        <Contact />
                        <span>{phoneNumber || "Not provided"}</span>
                    </div>
                </div>
                <div className='my-5'>
                    <h1>Skills</h1>
                    <div className='flex items-center gap-1'>
                        {skills?.length > 0 ? skills.map((item, index) => <Badge key={index}>{item}</Badge>) : <span>No skills added</span>}
                    </div>
                </div>
                <div className='grid w-full max-w-sm items-center gap-1.5'>
                    <Label className="text-md font-bold">Resume</Label>
                    {isResumeAvailable ? (
                        <a target='_blank' href={resume} className='text-blue-500 w-full hover:underline cursor-pointer'>
                            {resumeOriginalName}
                        </a>
                    ) : (
                        <span>No resume uploaded</span>
                    )}
                </div>
            </div>
            <div className='max-w-4xl mx-auto bg-white rounded-2xl'>
                <h1 className='font-bold text-lg my-5'>Applied Jobs</h1>
                <AppliedJobTable />
            </div>
            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div>
    );
}

export default Profile;
