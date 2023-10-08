import { useState, useEffect } from 'react';
import axios from 'axios';
import ColoringCard from '../smContent/colorCards';
import fetchUserInfo from '../../../server/getUserId';
import SpecificMapData from '../smContent/specificMapsData';

function DashboardSyscon() {
    const [totalReports, setTotalReports] = useState(0);
    const [respondedReports, setRespondedReports] = useState(0);
    const [totalUMKMs, setTotalUMKMs] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch user ID
                const userId = await fetchUserInfo();

                // Fetch total report data for the user
                const reportResponse = await axios.get(`https://delightful-tan-scallop.cyclic.cloud/reportData/${userId}`);
                const reportData = reportResponse.data;
                setTotalReports(reportData.totalReports);
                setRespondedReports(reportData.respondedReports);

                // Fetch total UMKM data
                const umkmResponse = await axios.get('https://delightful-tan-scallop.cyclic.cloud/umkm/posts');
                const umkmData = umkmResponse.data;
                const totalUMKMsCount = umkmData.length;
                setTotalUMKMs(totalUMKMsCount);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className='sm:ml-64 mt-20'>
            <div className="flow-root">
                <div className="mt-8">
                    <div className="mb-6">
                        <h2 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                            Data Laporan
                        </h2>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Jumlah Laporan
                                </p>
                                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                                    {totalReports}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Laporan yang Sudah Direspon
                                </p>
                                <p className="text-2xl font-semibold text-green-600 dark:text-green-400">
                                    {respondedReports}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-start items-center my-5">
                    <div className="grid grid-cols-2 gap-4">
                        <ColoringCard
                            title="UMKMs"
                            count={totalUMKMs}
                            gradient="bg-gradient-to-r from-blue-400 to-green-600"
                        />
                    </div>
                </div>

                <SpecificMapData />

            </div>
        </div>
    );
}

export default DashboardSyscon;
