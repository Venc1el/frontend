import { Button, IconButton } from "@material-tailwind/react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

export function Pagination({ totalPages, activePage, onPageChange }) {
    const next = () => {
        if (activePage < totalPages) {
            onPageChange(activePage + 1);
        }
    };

    const prev = () => {
        if (activePage > 1) {
            onPageChange(activePage - 1);
        }
    };

    const getItemProps = (index) => ({
        variant: activePage === index ? "filled" : "text",
        color: "gray",
        onClick: () => onPageChange(index),
        className: "rounded-full",
    });

    return (
        <div className="flex items-center gap-4 justify-center my-5">
            <Button
                variant="text"
                className="flex items-center gap-2 rounded-full font-normal"
                onClick={prev}
                disabled={activePage === 1}
            >
                <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" /> Previous
            </Button>
            <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, index) => (
                    <IconButton key={index} {...getItemProps(index + 1)}>
                        {index + 1}
                    </IconButton>
                ))}
            </div>
            <Button
                variant="text"
                className="flex items-center gap-2 rounded-full font-normal"
                onClick={next}
                disabled={activePage === totalPages}
            >
                Next
                <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
            </Button>
        </div>
    );
}
