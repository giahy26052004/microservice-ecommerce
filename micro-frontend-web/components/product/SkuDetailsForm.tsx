import React, { FC, useEffect } from "react";
import {
  Button,
  Card,
  Dropdown,
  DropdownButton,
  Form,
  InputGroup,
} from "react-bootstrap";
import { useToasts } from "react-toast-notifications";
import { Products } from "../../services/product.service";
import { getFormattedStringFromDay } from "../../utils";

interface ISkuDetailsFormProps {
  setSkuDetailsFormShow: (show: boolean) => void;
  productId: string;
  setAllSkuDetails: (skuDetails: any) => void;
  allSkuDetails: any;
  skuIdForUpdate: string;
  setSkuIdForUpdate: (id: string) => void;
}

const initialState = {
  skuName: "",
  price: 0,
  validity: 0,
  validityType: "Select Type",
  lifetime: false,
};

const SkuDetailsForm: FC<ISkuDetailsFormProps> = ({
  setSkuDetailsFormShow,
  productId,
  setAllSkuDetails,
  allSkuDetails,
  skuIdForUpdate,
  setSkuIdForUpdate,
}) => {
  const { addToast } = useToasts();
  const [isLoading, setIsLoading] = React.useState(false);
  const [skuForm, setSkuFrom] = React.useState(initialState);

  const handleCancel = () => {
    setSkuIdForUpdate("");
    setSkuFrom(initialState);
    setSkuDetailsFormShow(false);
  };

  useEffect(() => {
    if (skuIdForUpdate) {
      const sku = allSkuDetails.find(
        (sku: { _id: string }) => sku._id === skuIdForUpdate
      );
      const periodTimes = getFormattedStringFromDay(sku?.validity);
      setSkuFrom({
        ...initialState,
        ...sku,
        validity: periodTimes.split(" ")[0] || 0,
        validityType: periodTimes.split(" ")[1] || "Select Type",
      });
    }
  }, [skuIdForUpdate, allSkuDetails]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { skuName, price, validity, lifetime } = skuForm;
      if (
        !skuName ||
        !price ||
        (!lifetime && !validity) ||
        (!lifetime && skuForm.validityType === "Select Type")
      ) {
        throw new Error("Invalid data");
      }

      if (!lifetime) {
        skuForm.validity =
          skuForm.validityType === "months"
            ? skuForm.validity * 30 // convert to days to store
            : skuForm.validity * 365; // convert to days to store
      } else {
        skuForm.validity = Number.MAX_SAFE_INTEGER;
      }

      setIsLoading(true);
      const skuDetailsRes = skuIdForUpdate
        ? await Products.updateSku(productId, skuIdForUpdate, skuForm)
        : await Products.addSku(productId, { skuDetails: [skuForm] });

      if (!skuDetailsRes.success) {
        throw new Error(skuDetailsRes.message);
      }

      setSkuDetailsFormShow(false);
      setSkuIdForUpdate("");
      setAllSkuDetails(skuDetailsRes.result?.skuDetails);
    } catch (error: any) {
      if (error.response) {
        const messages = Array.isArray(error.response?.data?.message)
          ? error.response.data.message
          : [error.response.data.message];
        messages.forEach((message: any) => {
          addToast(message, { appearance: "error", autoDismiss: true });
        });
      } else {
        addToast(error.message, { appearance: "error", autoDismiss: true });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card style={{ padding: "10px" }}>
      <h6 style={{ color: "green" }}>SKU information:</h6>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>SKU Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter SKU Name"
            value={skuForm.skuName}
            onChange={(e) =>
              setSkuFrom({ ...skuForm, skuName: e.target.value })
            }
          />
        </Form.Group>
        <Form.Group controlId="formBasicPassword">
          <Form.Label>SKU Price For Each License</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter SKU Price"
            value={skuForm.price}
            onChange={(e) =>
              setSkuFrom({ ...skuForm, price: parseFloat(e.target.value) })
            }
          />
        </Form.Group>
        <Form.Group controlId="formBasicPassword">
          <Form.Label>SKU Validity</Form.Label>
          <small style={{ color: "grey" }}>
            (If validity is lifetime then check the box)
            <Form.Check
              type="switch"
              id="custom-switch"
              label="Lifetime"
              checked={skuForm.lifetime}
              onChange={(e) => {
                const isChecked = e.target.checked;
                setSkuFrom({
                  ...skuForm,
                  lifetime: isChecked,
                  validity: isChecked ? 0 : skuForm.validity,
                  validityType: isChecked
                    ? "Select Type"
                    : skuForm.validityType,
                });
              }}
            />
          </small>
          <InputGroup className="mb-3">
            <Form.Control
              aria-label="Text input with checkbox"
              disabled={skuForm.lifetime}
              type="number"
              value={skuForm.validity}
              onChange={(e) =>
                setSkuFrom({ ...skuForm, validity: parseInt(e.target.value) })
              }
            />
            <DropdownButton
              variant="outline-secondary"
              title={skuForm.validityType}
              id="input-group-dropdown-9"
              disabled={skuForm.lifetime}
              align="end"
              onSelect={(e) =>
                setSkuFrom({ ...skuForm, validityType: e || "" })
              }
            >
              <Dropdown.Item eventKey="months">Months</Dropdown.Item>
              <Dropdown.Item eventKey="years">Years</Dropdown.Item>
            </DropdownButton>
          </InputGroup>
        </Form.Group>

        <div style={{ marginTop: "10px" }}>
          <Button variant="outline-info" onClick={handleCancel}>
            Cancel
          </Button>{" "}
          <Button variant="outline-primary" type="submit" disabled={isLoading}>
            {isLoading && (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
            )}
            Submit
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default SkuDetailsForm;
