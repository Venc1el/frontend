import React, { useState } from 'react';
import { Accordion } from 'flowbite-react';

function DefaultAccordion() {
    const [searchQuery, setSearchQuery] = useState('');
    const [accordionData] = useState([
        {
            title: 'What is Flowbite?',
            content: 'Flowbite is an open-source library of interactive components...',
        },
        {
            title: 'Is there a Figma file available?',
            content: 'Flowbite is first conceptualized and designed using the Figma software...',
        },
        {
            title: 'What are the differences between Flowbite and Tailwind UI?',
            content: 'The main difference is that the core components from Flowbite are open source...',
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
                <button
                    type="submit"
                    className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                    Search
                </button>
            </div>
        </form>
    );
}

export default DefaultAccordion;
