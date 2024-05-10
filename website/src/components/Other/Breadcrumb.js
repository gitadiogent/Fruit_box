import Link from "next/link";
import React from "react";

export const BreadcrumbItem = ({ name, current, path }) => {
  return path ? (
    <li className={current && "active"}>
      <Link href={path}>
        <p style={{ textDecoration: "none", color: "#000", cursor: "pointer", display: "inline" }}>{name}</p>
      </Link>
    </li>
  ) : (
    <li className={current && "active"}>{name}</li>
  );
};

export const Breadcrumb = ({ title, children }) => {
  return (
    <div className="breadcrumb">
      <div className="container">
        <h1>{title}</h1>
        <ul style={{ textTransform: "capitalize" }}>{children}</ul>
      </div>
    </div>
  );
};
