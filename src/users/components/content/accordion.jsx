import { useState } from 'react';
import { Accordion } from 'flowbite-react';

function DefaultAccordion() {
    const [searchQuery, setSearchQuery] = useState('');
    const [accordionData] = useState([
        {
            title: 'Bagaimana Cara Mendaftar Kependudukan?',
            content: 'Anda dapat mendaftar kependudukan dengan mengunjungi kantor pelayanan kependudukan terdekat...',
        },
        {
            title: 'Apa Syarat Untuk Mengurus Kartu Identitas Penduduk?',
            content: 'Untuk mengurus Kartu Identitas Penduduk (KTP), Anda perlu memenuhi syarat-syarat tertentu, seperti...',
        },
        {
            title: 'Apa Layanan yang Tersedia di Kantor Kependudukan?',
            content: 'Kantor kependudukan menyediakan berbagai layanan, seperti pendaftaran kelahiran, perubahan data penduduk, dan lainnya...',
        },
    ]);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const highlightMatch = (text, query) => {
        const parts = text.split(new RegExp(`(${query})`, 'gi'));
        return parts.map((part, index) =>
            part.toLowerCase() === query.toLowerCase() ? (
                <span key={index} className="text-blue-600">
                    {part}
                </span>
            ) : (
                part
            )
        );
    };

    return (
        <div className='w-full'>
            <SearchForm handleSearch={handleSearch} />
            <Accordion className='my-5'>
                {accordionData
                    .filter((item) =>
                        item.title.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((item, index) => (
                        <Accordion.Panel key={index} className="w-full">
                            <Accordion.Title>
                                {highlightMatch(item.title, searchQuery)}
                            </Accordion.Title>
                            <Accordion.Content>
                                <p className="mb-2 text-gray-500 dark:text-gray-400">
                                    {highlightMatch(item.content, searchQuery)}
                                </p>
                            </Accordion.Content>
                        </Accordion.Panel>
                    ))}
            </Accordion>
        </div>
    );
}

function SearchForm({ handleSearch }) {
    return (
        <form className="md:w-3/6 px-5 mx-auto mt-12">
            <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
                Search
            </label>
            <div className="relative">
                <div className="absolute inset-y-0 left-2 flex items-center pl-3 pointer-events-none">
                    <svg
                        className="w-4 h-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 20"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                        />
                    </svg>
                </div>
                <input
                    type="search"
                    id="default-search"
                    className="block w-full p-4 pl-14 text-sm text-gray-900 border border-gray-300 rounded-full bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Search..."
                    required
                    onChange={handleSearch} // Call the handleSearch function on input change
                />
            </div>
        </form>
    );
}

export default DefaultAccordion;
