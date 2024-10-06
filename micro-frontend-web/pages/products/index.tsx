import { GetServerSideProps, NextPage } from "next";
import React, { useContext, useEffect, useState } from "react";
import queryString from "query-string";
import axios from "axios";
import styles from "../../styles/Product.module.css";
import { Col, Dropdown, DropdownButton, Row } from "react-bootstrap";
import BreadcrumbDisplay from "../../components/shared/BreadcrumbDisplay";
import { useRouter } from "next/router";
import ProductFilter from "../../components/products/ProductFilter";
import ProductItem from "../../components/products/ProductItem";
import PaginationeDisplay from "../../components/shared/PaginationeDisplay";
import Link from "next/link";
import { Context } from "../../context";
import { PlusCircle } from "react-bootstrap-icons";
interface Props {
  products: Record<string, any>[];
  metadata: Record<string, any>;
}
const AllProducts: NextPage<Props> = ({ products, metadata }) => {
  const [sortText, setSortText] = useState("Sort By");
  const [userType, setUserType] = useState("customer");
  const {
    state: { user },
  } = useContext(Context);
  useEffect(() => {
    if (user) {
      setUserType(user.type);
    }
  }, [user]);
  const router = useRouter();
  return (
    <>
      <Row>
        <Col md={8}>
          <BreadcrumbDisplay
            childrens={[
              { active: false, href: "/", text: "Home" },
              {
                active: true,
                href: "",
                text: "Products",
              },
            ]}
          />
        </Col>
        <Col md={4}>
          <DropdownButton
            variant="outline-secondary"
            id="input-group-dropdown-2"
            title={sortText}
            onSelect={(e) => {
              if (e) {
                setSortText(
                  e === "-avgRating"
                    ? "Rating"
                    : e === "-createdAt"
                    ? "Latest"
                    : "Sort By"
                );
                delete router.query.offset;
                router.query.sort = e;
                router.push(router);
              } else {
                delete router.query.sort;
                router.push(router);
              }
            }}
            className={styles.dropdownBtn}
          >
            <Dropdown.Item eventKey={"-avgRating"}>Rating</Dropdown.Item>

            <Dropdown.Item eventKey={"-createAt"}>Latest</Dropdown.Item>

            <Dropdown.Item eventKey={""}>Reset</Dropdown.Item>
          </DropdownButton>

          {userType === "admin" && (
            <Link href="/products/update-product">
              <a className="btn btn-primary btnAddProduct">
                <PlusCircle className="btnAddProductIcon" />
                Add Product
              </a>
            </Link>
          )}
        </Col>
      </Row>
      <Row>
        <Col md={2}>
          <ProductFilter />
        </Col>
        <Col sm={8}>
          <Row xs={1} md={3} className="g-3">
            {products && products.length > 0 ? (
              products.map((product) => (
                <ProductItem
                  key={product._id}
                  product={product}
                  userType={userType}
                />
              ))
            ) : (
              <h3>No Products found</h3>
            )}
          </Row>
          <Row>
            <Col>
              <PaginationeDisplay metadata={metadata} />
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};
export const getServerSideProps: GetServerSideProps<Props> = async (
  context
): Promise<any> => {
  try {
    const url = queryString.stringifyUrl({
      url: `${process.env.NEXT_PUBLIC_BASE_API_URL}/products`,
      query: context.query,
    });
    const { data } = await axios.get(url);
    return {
      props: {
        products: data?.result?.products || [],
        metadata: data?.result?.metadata || {},
      },
    };
  } catch (error) {
    console.error(error);
    return { props: { products: [], metadata: {} } };
  }
};
export default AllProducts;
