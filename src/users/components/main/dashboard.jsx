import Header from '../header/header';
import DefaultAccordion from '../content/accordion';

function Dashboard() {
    const scrollToSearch = () => {
        const searchElement = document.getElementById('search');
        window.scrollTo({
            behavior: 'smooth',
            top: searchElement.offsetTop
        });
    };

    return (
        <div className="min-h-screen">
            <Header />
            <main className="container mx-auto flex flex-col items-center justify-center px-5 py-8">
                <div className="container mx-auto flex flex-col md:flex-row items-center justify-center py-12 px-4 mb-5 md:px-6">
                    <div className="md:w-1/2 md:pr-12 mb-8 md:mb-0 text-center md:text-left">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">
                            LIMA (Layanan dan Informasi Masyarakat)
                        </h2>
                        <p className="text-lg text-gray-700 mb-6">
                            Providing efficient and reliable public services for a better community.
                        </p>
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline transform transition-transform duration-300 ease-in-out"
                            onClick={scrollToSearch}
                        >
                            Get Started
                        </button>
                    </div>
                    <div className="md:w-1/2">
                        <img
                            src="https://images.pexels.com/photos/280221/pexels-photo-280221.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                            alt="Image"
                            className="w-full h-auto rounded-lg shadow-lg"
                        />
                    </div>
                </div>

                <div className="text-center max-w-2xl" id='search'>
                    <h1 className="text-3xl font-bold my-4">How we can help you?</h1>
                    <p className='text-gray-600'>
                        Here are a few of the questions we get the most. If you don't see what's on your mind, reach out to us anytime on phone, chat, or email.
                    </p>
                </div>
                <DefaultAccordion />
            </main>
        </div>
    );
}

export default Dashboard;
