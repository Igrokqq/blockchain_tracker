// src/components/CustomPagination.tsx

import { Button } from "./button";

interface CustomPaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({ totalPages, currentPage, onPageChange }) => {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <div className="flex items-center justify-center space-x-2">
      <Button variant="outline" onClick={() => onPageChange(currentPage - 1)} disabled={isFirstPage}>
        Previous
      </Button>

      <span>
        Page {currentPage} of {totalPages}
      </span>

      <Button variant="outline" onClick={() => onPageChange(currentPage + 1)} disabled={isLastPage}>
        Next
      </Button>
    </div>
  );
};

export default CustomPagination;
