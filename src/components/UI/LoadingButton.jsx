import Loader from './Loader';

const LoadingButton = ({ text = "Save", className = '', isLoading = false, onClick }) => {
    return (
        <>
            <button
                className={`shadow transition duration-300 ease-in-out bg-skin-base hover:bg-skin-base/80 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-10 rounded relative ${className}`}
                type="submit"
                onClick={onClick}
            >
                {isLoading && <Loader className="w-[15px] h-[15px] absolute top-[14px] left-3" />}
                {text}
            </button>
        </>
    )
}

export default LoadingButton;