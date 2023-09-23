

const ColoringCard = ({ title, count, gradient }) => {
    return (
        <div
            className={`rounded-lg p-4 px-10 shadow-md hover:shadow-lg transition duration-300 ${gradient}`}
        >
            <h2 className="text-xl font-semibold text-white">{title}</h2>
            <div className="mt-2">
                <span className="text-2xl font-bold text-white">{count}</span>
                <span className="ml-2 text-gray-200">Units</span>
            </div>
        </div>
    );
};

export default ColoringCard;
