import { Pagination } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

function Paginate({ page, pages, admin = false, keyword = "" }) {
  return (
    pages > 1 && (
      <Pagination>
        {[...Array(pages).keys()].map((x) => (
          <LinkContainer
            to={
              admin
                ? `/admin/products/page/${x + 1}`
                : keyword
                ? `/search/${keyword}/page/${x + 1}`
                : `/page/${x + 1}`
            }
            key={x + 1}
          >
            <Pagination.Item active={page == x + 1}>{x + 1}</Pagination.Item>
          </LinkContainer>
        ))}
      </Pagination>
    )
  );
}

export default Paginate;
