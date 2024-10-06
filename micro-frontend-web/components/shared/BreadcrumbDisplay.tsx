import React, { FC } from "react";
import { Breadcrumb } from "react-bootstrap";
interface children {
  active: boolean;
  href: string;
  text: string;
}
interface IProps {
  childrens?: children[];
}
const BreadcrumbDisplay: FC<IProps> = ({ childrens }) => {
  return (
    <Breadcrumb style={{ marginTop: "10px" }}>
      {childrens &&
        childrens.map((child, index: React.Key) => {
          return (
            <Breadcrumb.Item
              active={child.active}
              href={child.href}
              key={index}
            >
              {child.text}
            </Breadcrumb.Item>
          );
        })}
    </Breadcrumb>
  );
};

export default BreadcrumbDisplay;
