export default function Container({ children, className }) {
    return (
        <div
            className={`w-full max-w-[1540px] mx-auto px-4 sm:px-5 lg:px-6 ${className}`}
        >
            {children}
        </div>
    );
}