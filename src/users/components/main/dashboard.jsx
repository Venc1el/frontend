import Header from '../header/header';
import SearchForm from '../content/searchBar';
import Tabs from '../content/tabs';

function Dashboard() {
    return (
        <>
            <header>
                <Header />
                <SearchForm />
            </header>

            <main className='h-full'>
                <Tabs />
            </main>
        </>
    );
}

export default Dashboard;
