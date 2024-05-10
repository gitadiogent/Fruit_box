import Link from "next/link";
import classNames from "classnames";

import menuData from "../../../data/header/navigation.json";

const menuDataForHeader = [
  { title: "Home", to: "/" },
  { title: "Shop", to: "/shop/products" },
  { title: "About", to: "/about" },
];

export default function Navigator({ disableSubmenu, className }) {
  function renderMenu() {
    return menuDataForHeader.slice(0, 5).map((item, index) => {
      return (
        <li key={index}>
          <Link href={process.env.PUBLIC_URL + item.to}>
            <a>{item.title}</a>
          </Link>
        </li>
      );
    });
  }

  return (
    <div className={`navigator ${classNames(className)}`}>
      <ul>
        {renderMenu()}
        <li>
          <Link href="/contact">Contact</Link>
        </li>
      </ul>
    </div>
  );
}
