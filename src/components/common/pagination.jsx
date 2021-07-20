import React from "react";
import PropTypes from "prop-types";
import { Pagination as PaginationRB } from "react-bootstrap";
import _ from "lodash";

const Pagination = ({ itemsCount, pageSize, currentPage, onPageChange }) => {
  const pagesCount = Math.ceil(itemsCount / pageSize);
  if (pagesCount === 1) return null;
  const pages = _.range(1, pagesCount + 1);

  return (
    <PaginationRB className="justify-content-center">
      {pages.map((page) => {
        return (
          <PaginationRB.Item
            key={page}
            active={page === currentPage}
            onClick={() => onPageChange(page)}
          >
            {page}
          </PaginationRB.Item>
        );
      })}
    </PaginationRB>
  );
};

Pagination.propTypes = {
  itemsCount: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
