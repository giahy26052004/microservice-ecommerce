import { useRouter } from "next/router";
import React, { FC } from "react";
import { Pagination } from "react-bootstrap";

interface IPaginationProps {
  metadata: Record<string, any>;
}
const PaginationeDisplay: FC<IPaginationProps> = ({ metadata }) => {
  const router = useRouter();
  return (
    <>
      <Pagination style={{ float: "right", marginTop: "20px" }}>
        <Pagination.First
          disabled={metadata?.links?.first ? false : true}
          onClick={() => {
            router.push(`/products${metadata?.links?.first}`);
          }}
        />
        <Pagination.Prev
          disabled={metadata?.links?.prev ? false : true}
          onClick={() => {
            router.push(`/products${metadata?.links?.prev}`);
          }}
        />
        <Pagination.Next
          disabled={metadata?.links?.next ? false : true}
          onClick={() => {
            router.push(`/products${metadata?.links?.next}`);
          }}
        />
        <Pagination.Last
          disabled={metadata?.links?.last ? false : true}
          onClick={() => {
            router.push(`/products${metadata?.links?.last}`);
          }}
        />
      </Pagination>
      <div className="row h-100">
        <div className="col-sm-12 my-auto">
          <div style={{ float: "right", color: "#2b7fe0", fontSize: "13px" }}>
            Showing{" "}
            {metadata?.total > metadata?.limit
              ? metadata?.limit
              : metadata?.total}{" "}
            of {metadata?.total} results
          </div>
        </div>
      </div>
    </>
  );
};

export default PaginationeDisplay;
