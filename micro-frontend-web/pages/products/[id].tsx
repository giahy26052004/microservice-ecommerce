import type { GetServerSideProps, NextPage } from "next";
import {
  Badge,
  Button,
  Card,
  Col,
  Dropdown,
  DropdownButton,
  Form,
  Nav,
} from "react-bootstrap";
import { Row } from "react-bootstrap";
import StarRatingComponent from "react-star-rating-component";
import NumericInput from "react-numeric-input";
import { BagCheckFill, PersonFill } from "react-bootstrap-icons";
import { Tab } from "react-bootstrap";
import { Table } from "react-bootstrap";
import React, { useContext, useEffect, useState } from "react";

import axios from "axios";

import { Context } from "../../context";
import { getFormattedStringFromDay } from "../../utils";
import ProductItem from "../../components/products/ProductItem";
import SkuDetailsList from "../../components/product/SkuDetailsList";
import dynamic from "next/dynamic";
import CartOffCanvas from "../../components/CartOffCanvas";
import ReviewSection from "../../components/product/Review";

interface ProductProps {
  product: Record<string, any>;
  relatedProducts: Record<string, any>[];
}

const Product: NextPage<ProductProps> = ({ product, relatedProducts }) => {
  const [show, setShow] = useState(false);
  const [allSkuDetails, setAllSkuDetails] = React.useState(
    product?.skuDetails || []
  );
  useEffect(() => {
    setAllSkuDetails(product?.skuDetails || []);
  }, [setAllSkuDetails, product]);
  const DynamicNumericInput = dynamic(() => import("react-numeric-input"), {
    ssr: false,
  });
  const [displaySku, setDisplaySku] = React.useState(
    product?.skuDetails
      ? product?.skuDetails.sort(
          (a: { price: number }, b: { price: number }) => a.price - b.price
        )[0] || {}
      : {}
  );

  const [quantity, setQuantity] = useState(1);

  const {
    cartItems,
    cartDispatch,
    state: { user },
  } = useContext(Context);
  // const handleShow = () => setShow(true);
  const handleCart = () => {
    cartDispatch({
      type: cartItems.find(
        (item: { skuId: string }) => item.skuId === displaySku._id
      )
        ? "UPDATE_CART"
        : "ADD_TO_CART",
      payload: {
        skuId: displaySku._id,
        quantity: quantity,
        validity: displaySku.lifetime ? 0 : displaySku.validity,
        lifetime: displaySku.lifetime,
        price: displaySku.price,
        productName: product.productName,
        productImage: product.image,
        productId: product._id,
        skuPriceId: displaySku,
      },
    });
    setShow(true);
  };
  const [activeKey, setActiveKey] = useState("first");

  return (
    <>
      <Row className="firstRow">
        <Col sm={4}>
          <Card className="productImgCard">
            <Card.Img variant="top" src={product?.image} />
          </Card>
        </Col>
        <Col sm={8}>
          <h2>{product?.productName}</h2>
          <div className="divStar">
            <StarRatingComponent
              name="rate2"
              editing={false}
              starCount={5}
              value={product?.avgRating || 0}
            />
            ({product?.feedbackDetails?.length || 0} reviews)
          </div>
          <p className="productPrice">
            {/* {product?.skuDetails && product?.skuDetails?.length > 1
							? `₹${Math.min.apply(
									Math,
									product?.skuDetails.map((sku: { price: number }) => sku.price)
							  )} - ₹${Math.max.apply(
									Math,
									product?.skuDetails.map((sku: { price: number }) => sku.price)
							  )}`
							: `₹${product?.skuDetails?.[0]?.price || '000'}`}{' '} */}
            ₹{displaySku?.price || "000"} {""}
            <Badge style={{ background: "warning", color: "dark" }}>
              {displaySku.lifetime === "true" // Check if the lifetime is "true"
                ? "Lifetime"
                : getFormattedStringFromDay(displaySku.validity)}
            </Badge>
          </p>
          <ul>
            {product?.highlights &&
              product?.highlights.length > 0 &&
              product?.highlights.map((highlight: string, key: any) => (
                <li key={key}>{highlight}</li>
              ))}
          </ul>

          <div>
            {product?.skuDetails &&
              product?.skuDetails?.length > 0 &&
              product?.skuDetails
                .sort(
                  (a: { validity: number }, b: { validity: number }) =>
                    a.validity - b.validity
                )
                .map((sku: Record<string, any>, key: any) => (
                  <Badge
                    bg="info"
                    text="dark"
                    className="skuBtn"
                    key={key}
                    style={{ cursor: "pointer" }}
                    onClick={() => setDisplaySku(sku)}
                  >
                    {sku.lifetime === "true" // Check if the lifetime is "true"
                      ? "Lifetime"
                      : getFormattedStringFromDay(sku.validity)}
                  </Badge>
                ))}
          </div>
          <div className="productSkuZone">
            <DynamicNumericInput
              min={1}
              max={5}
              value={quantity}
              size={5}
              onChange={(value) => setQuantity(Number(value))}
              disabled={!displaySku?.price}
            />
            {/* <Form.Select
							aria-label='Default select example'
							className='selectValidity'
						>
							<option>Select validity</option>
							<option value='1'>One</option>
							<option value='2'>Two</option>
							<option value='3'>Three</option>
						</Form.Select> */}
            {/* {user?.type !== 'admin' && ( */}
            <Button
              variant="primary"
              className="cartBtn"
              onClick={handleCart}
              disabled={!displaySku?.price}
            >
              <BagCheckFill className="cartIcon" />
              {cartItems.find((item: any) => item.skuId === displaySku._id)
                ? "Update cart"
                : "Add to cart"}
            </Button>
            {/* )} */}
          </div>
        </Col>
      </Row>
      <br />
      <hr />
      <Row>
        <Tab.Container
          id="left-tabs-example"
          activeKey={activeKey}
          onSelect={(k: any) => setActiveKey(k)}
          defaultActiveKey="first"
        >
          <Row>
            <Col sm={3}>
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link
                    eventKey="first"
                    style={{
                      color: "#18191a",

                      background: activeKey === "first" ? "#8cafc1" : "",
                    }}
                  >
                    Descriptions
                  </Nav.Link>
                </Nav.Item>
                {product?.requirmentSpecification &&
                  product?.requirmentSpecification.length > 0 && (
                    <Nav.Item>
                      <Nav.Link
                        eventKey="second"
                        style={{
                          color: "#18191a",
                          backgroundColor:
                            activeKey === "second" ? "#8cafc1" : "",
                        }}
                      >
                        Requirements
                      </Nav.Link>
                    </Nav.Item>
                  )}

                <Nav.Item>
                  <Nav.Link
                    eventKey="third"
                    style={{
                      color: "#18191a",
                      backgroundColor: activeKey === "third" ? "#8cafc1" : "",
                    }}
                  >
                    Reviews
                  </Nav.Link>
                </Nav.Item>
                {user?.type === "admin" && (
                  <Nav.Item>
                    <Nav.Link
                      eventKey="fourth"
                      style={{
                        color: "#18191a",
                        backgroundColor:
                          activeKey === "fourth" ? "#8cafc1" : "",
                      }}
                    >
                      Product SKUs
                    </Nav.Link>
                  </Nav.Item>
                )}
              </Nav>
            </Col>
            <Col sm={9}>
              <Tab.Content>
                <Tab.Pane eventKey="first">
                  {product?.description} <br />
                  <a
                    target="_blank"
                    href={product?.productUrl}
                    rel="noreferrer"
                    style={{ textDecoration: "none", float: "right" }}
                  >
                    Get more info....
                  </a>
                  <br />
                  <br />
                  <a
                    className="btn btn-primary text-center"
                    target="_blank"
                    href={product?.downloadUrl}
                    rel="noreferrer"
                    style={{
                      textDecoration: "none",
                      float: "right",
                      background: "#0f4282",
                    }}
                  >
                    Download this
                  </a>
                </Tab.Pane>
                <Tab.Pane eventKey="second">
                  <Table responsive>
                    <tbody>
                      {product?.requirmentSpecification &&
                        product?.requirmentSpecification.length > 0 &&
                        product?.requirmentSpecification.map(
                          (requirement: string, key: any) => (
                            <tr key={key}>
                              <td width="30%">
                                {Object.keys(requirement)[0]}{" "}
                              </td>
                              <td width="70%">
                                {Object.values(requirement)[0]}
                              </td>
                            </tr>
                          )
                        )}
                    </tbody>
                  </Table>
                </Tab.Pane>
                <Tab.Pane eventKey="third">
                  <ReviewSection
                    reviews={product.feedbackDetails || []}
                    productId={product._id}
                  />
                </Tab.Pane>
                <Tab.Pane eventKey="fourth">
                  <SkuDetailsList
                    skuDetails={allSkuDetails}
                    productId={product._id}
                    setAllSkuDetails={setAllSkuDetails}
                  />
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Row>
      <br />
      <div className="separator">Related Products</div>
      <br />
      <Row xs={1} md={4} className="g-3">
        {relatedProducts.map((relatedProduct) => (
          <Col key={relatedProduct._id}>
            <ProductItem product={relatedProduct} userType={"customer"} />
          </Col>
        ))}
      </Row>
      <CartOffCanvas setShow={setShow} show={show} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps<ProductProps> = async (
  context
): Promise<any> => {
  try {
    if (!context.params?.id) {
      return {
        props: {
          product: {},
        },
      };
    }
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/products/${context.params.id}`
    );
    return {
      props: {
        product: data?.result?.product || ({} as Record<string, any>),
        relatedProducts:
          data?.result?.relatedProduct ||
          ([] as unknown as Record<string, any[]>),
      },
    };
  } catch (error) {
    return {
      props: {
        product: {},
      },
    };
  }
};
export default Product;
