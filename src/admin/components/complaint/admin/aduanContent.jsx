import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Pagination } from '../../../../pagination/pagination';
import * as XLSX from 'xlsx';

function AduanContent() {
	const [complaintExists, setComplaintExists] = useState(false);
	const [complaints, setComplaints] = useState([]);
	const [responses, setResponses] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [postsPerPage, setPostsPerPage] = useState(15);

	useEffect(() => {
		axios
			.get('https://delightful-tan-scallop.cyclic.cloud/complaints')
			.then((response) => {
				setComplaints(response.data);
				setComplaintExists(response.data.length > 0);
			})
			.catch((error) => {
				console.error('Error fetching complaints:', error);
			});

		axios.get('https://delightful-tan-scallop.cyclic.cloud/complaint_responses')
			.then(response => {
				setResponses(response.data.responses);
			})
			.catch(error => {
				console.error('Error fetching complaint responses:', error);
			});
	}, []);

	const getCurrentPosts = () => {
		const indexOfLastPost = currentPage * postsPerPage;
		const indexOfFirstPost = indexOfLastPost - postsPerPage;
		return complaints.slice(indexOfFirstPost, indexOfLastPost);
	};

	const handlePageChange = (pageNumber) => {
		setCurrentPage(pageNumber);
	};

	const handlePostsPerPageChange = (e) => {
		let value = parseInt(e.target.value, 10);
		// Limit posts per page to 250
		if (value > 250) {
			value = 250;
		}
		setPostsPerPage(value);
		setCurrentPage(1);
	};

	const exportToExcel = () => {
		const workbook = XLSX.utils.book_new();

		// Convert complaints and responses to Excel sheets
		const complaintsSheet = XLSX.utils.json_to_sheet(complaints);
		const responsesSheet = XLSX.utils.json_to_sheet(responses);

		// Add sheets to the workbook
		XLSX.utils.book_append_sheet(workbook, complaintsSheet, 'Complaints');
		XLSX.utils.book_append_sheet(workbook, responsesSheet, 'ComplaintResponses');

		// Export the workbook to Excel file
		XLSX.writeFile(workbook, 'complaints_and_responses.xlsx');
	};


	return (
		<div className='p-4 sm:ml-64'>
			{complaintExists ? (
				<div className='mt-20'>
					<div className='flex flex-col sm:flex-row justify-between items-center mb-4'>
						<div className='mb-2 sm:mb-0'>
							<Link
								className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'
								to='/syscon/aduan/form-aduan'
							>
								Ajukan Pengaduan
							</Link>
							<button
								className='bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded mt-2 sm:mt-0'
								onClick={exportToExcel}
							>
								Export to Excel
							</button>
						</div>
						<div className='flex items-center'>
							<label className='mr-2'>Posts per Page:</label>
							<input
								type='number'
								min='1'
								value={postsPerPage}
								onChange={handlePostsPerPageChange}
								className='border border-gray-300 rounded px-2 py-1 w-16 text-center'
							/>
						</div>
					</div>
					<div className='relative overflow-x-auto shadow-sm sm:rounded-lg mt-9'>
						<table className='w-full text-sm text-left text-gray-500 '>
							<thead className='text-sm text-gray-800 uppercase bg-gray-200'>
								<tr>
									<th scope='col' className='px-6 py-3'>
										No
									</th>
									<th scope='col' className='px-6 py-3'>
										Tipe Aduan
									</th>
									<th scope='col' className='px-6 py-3'>
										Tanggal
									</th>
									<th scope='col' className='px-6 py-3'>
										Pengadu
									</th>
									<th scope='col' className='px-6 py-3'>
										Status
									</th>
									<th scope='col' className='px-6 py-3'>
										Action
									</th>
								</tr>
							</thead>
							<tbody>
								{getCurrentPosts().map((complaint, index) => (
									<tr
										key={complaint.idcomplaint}
										className={`text-xs border-b ${complaint.status == 'Selesai' ? 'bg-green-100' : 'bg-white hover:bg-gray-50'
											}`}
									>
										<td
											scope='row'
											className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'
										>
											{index + 1 + '.'} {/* Display row number */}
										</td>
										<td
											scope='row'
											className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'
										>
											{complaint.type}
										</td>
										<td className='px-6 py-4'>{new Date(complaint.date).toLocaleDateString()}</td>
										<td className='px-6 py-4'>{complaint.username}</td>
										<td className='px-6 py-4'>
											{complaint.status.length > 15
												? `${complaint.status.slice(0, 15)}...` // Display truncated status
												: complaint.status}
										</td>
										<td className='px-6 py-4 flex flex-col'>
											<Link
												to={`/syscon/aduan/detail/${complaint.idcomplaint}`}
												className='cursor-pointer font-medium text-blue-600 dark:text-blue-500 hover:underline'
											>
												Lihat Detail
											</Link>

											<Link
												to={`/syscon/aduan/${complaint.idcomplaint}/respond`}
												className='cursor-pointer font-medium text-lime-600 dark:text-lime-500 hover:underline'
											>
												Respon
											</Link>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			) : (
				<div className='sm:ml-54 mt-20 p-4 w-full border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700'>
					<div className=''>
						<p className='mb-5'>No complaint exists. Please submit a complaint.</p>
						<Link
							className=' text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'
							to='/syscon/aduan/form-aduan'
						>
							Ajukan Pengaduan
						</Link>
					</div>
				</div>
			)}
			<Pagination
				className='bg-gray-50'
				totalPages={Math.ceil(complaints.length / postsPerPage)} // Calculate total pages
				activePage={currentPage}
				onPageChange={handlePageChange}
			/>
		</div>
	);
}

export default AduanContent;
