import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

type PaginationProps = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}
export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return
    onPageChange(page)
  }

  return (
    <div className="mt-4 flex justify-center space-x-2">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex size-10 items-center justify-center rounded-full bg-gray-200 p-2 disabled:cursor-not-allowed"
      >
        <FiChevronLeft />
      </button>
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index}
          onClick={() => handlePageChange(index + 1)}
          className={`flex size-10 items-center justify-center rounded-full ${
            currentPage === index + 1 ? 'bg-green-30 text-white' : 'bg-gray-200'
          }`}
        >
          {index + 1}
        </button>
      ))}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex size-10 items-center justify-center rounded-full bg-gray-200 p-2 disabled:cursor-not-allowed"
      >
        <FiChevronRight />
      </button>
    </div>
  )
}
