import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import LoadingBox from "./LoadingBox";
import MessageBox from "./MessageBox";

export default function Aside({ sidebarIsOpen, setSidebarIsOpen }) {
  const productCategoryList = useSelector((state) => state.productCategoryList);
  const {
    loading: loadingCategories,
    error: errorCategories,
    categories,
  } = productCategoryList;

  return (
    <aside className={sidebarIsOpen ? "open" : ""}>
      <ul className="categories">
        <li>
          <strong>Categorie</strong>
          <button
            onClick={() => setSidebarIsOpen(false)}
            className="close-sidebar"
            type="button"
          >
            <i className="fa fa-close"></i>
          </button>
        </li>
        {loadingCategories ? (
          <LoadingBox></LoadingBox>
        ) : errorCategories ? (
          <MessageBox variant="danger">{errorCategories}</MessageBox>
        ) : (
          categories.map((c) => (
            <li className="sp_li" key={c}>
              <Link
                to={`/search/category/${c}`}
                onClick={() => setSidebarIsOpen(false)}
              >
                {c}
              </Link>
            </li>
          ))
        )}
      </ul>
    </aside>
  );
}