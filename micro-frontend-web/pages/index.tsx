import { GetServerSideProps, NextPage } from "next";
import React from "react";
import styles from "../styles/Home.module.css";
import { Button, Col, Row } from "react-bootstrap";
import ProductItem from "../components/products/ProductItem";
import { useRouter } from "next/router";
import axios from "axios";
interface Props {
  products: Record<string, any>;
}
const Home: NextPage<Props> = ({ products }) => {
  const router = useRouter();

  return (
    <>
      <h3 className={styles.productCats}>Latest Products</h3>
      <Row className="g-4" xs={4} md={4}>
        {products.lastestProducts &&
          products.lastestProducts.map((product: any, index: React.Key) => (
            <ProductItem key={index} product={product} userType={"customer"} />
          ))}
      </Row>
      <hr />
      <h3 className={styles.productCats}>Top Rated Products</h3>
      <Row className="g-4" xs={4} md={4}>
        {products.topRatingProducts &&
          products.topRatingProducts.map((product: any, index: React.Key) => (
            <ProductItem key={index} product={product} userType={"customer"} />
          ))}
      </Row>
      <Row>
        <Col>
          <Button
            className={styles.viewMoreBtn}
            style={{ background: "#4c575f" }}
            onClick={() => router.push("/products")}
          >
            View More
          </Button>
        </Col>
      </Row>
    </>
  );
};
export const getServerSideProps: GetServerSideProps<Props> = async (
  context
): Promise<any> => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/products?homepage=true`
    );
    return { props: { products: data?.result[0] || "" } };
  } catch (error) {
    console.log(error);
  }
};
export default Home;
