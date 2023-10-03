import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';


function DetailComplaint() {
    const { id } = useParams();
    const [complaint, setComplaint] = useState(null);
    const [responses, setResponses] = useState([]);
    const [loadingResponses, setLoadingResponses] = useState(true);

    useEffect(() => {
        axios.get(`https://delightful-tan-scallop.cyclic.cloud/complaints/${id}/responses`)
            .then(response => {
                const responseData = response.data.responses;
                setResponses(responseData);
                setLoadingResponses(false);
            })
            .catch(error => {
                setLoadingResponses(false);
            });
    }, [id]);

    useEffect(() => {
        axios.get(`https://delightful-tan-scallop.cyclic.cloud/complaints/${id}`)
            .then(response => {
                setComplaint(response.data);
            })
            .catch(error => {
            });
    }, [id]);

    return (
        <div className='p-4 sm:ml-64'>
            {complaint ? (
                <div className='mt-20 mb-10 border-b border-gray-900/10 pb-10'>
                    <h1 className='text-2xl font-semibold mb-4'>
                        Complaint Details
                    </h1>
                    <div className='mb-4'>
                        <h2 className='font-medium'>Type: {complaint.type}</h2>
                        <p className='text-gray-600'>
                            Date: {new Date(complaint.date).toLocaleDateString()}
                        </p>
                        <p className='text-gray-600'>Status: {complaint.status}</p>
                    </div>
                    <div className='mb-4'>
                        <h2 className='font-medium'>Complaint Text:</h2>
                        <p>{complaint.text}</p>
                    </div>
                    <div className='mb-4'>
                        <h2 className='font-medium'>Complaint Alamat:</h2>
                        <p>{complaint.alamat}</p>
                    </div>
                    <div className='mb-4'>
                        <h2 className='font-medium'>Image:</h2>
                        <img
                            src={`${complaint.image_url}`}
                            alt='Complaint'
                            className='max-w-lg max-h-60 rounded-lg'
                        />
                        {console.log(complaint.image_url)}
                    </div>
                </div>
            ) : (
                <p>Loading complaint details...</p>
            )}
            <h1>Complaint Responses</h1>
            {loadingResponses ? (
                <p>Loading responses...</p>
            ) : (
                Array.isArray(responses) && responses.length > 0 ? (
                    <ul>
                        {responses.map(response => (
                            <li key={response.id}>
                                <p>ID: {response.id}</p>
                                <p>Complaint ID: {response.complaint_id}</p>
                                <p>Text: {response.text}</p>
                                <p>Date: {new Date(response.date_responses).toLocaleString()}</p>
                                <img
                                    src={`${response.image_url}`}
                                    alt="Response Image"
                                    style={{ maxWidth: '100px' }}
                                />
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No responses found.</p>
                )
            )}
        </div>
    )
}

export default DetailComplaint