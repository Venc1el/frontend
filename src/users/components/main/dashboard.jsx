import Header from '../header/header';
import DefaultAccordion from '../content/accordion';

function Dashboard() {
    return (
        <div className="min-h-screen">
            <Header />
            <main className="container mx-auto flex flex-col items-center justify-center px-5 py-8">
                <div className="text-center max-w-2xl">
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
