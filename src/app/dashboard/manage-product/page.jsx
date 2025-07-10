"use client";
import CategoryCards from "@/components/CategoryCards";
import Filter from "@/components/Modal/Filter";
import ProductCards from "@/components/ProductCards";
import { useDisclosure } from "@chakra-ui/react";
import React, { useState } from "react";

const ManageProduct = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const categories = [
    {
      title: "Burger",
    },
    {
      title: "Chips",
    },
    {
      title: "Pizza",
    },
    {
      title: "Broast",
    },
    {
      title: "Sandwich",
    },
    {
      title: "Burger",
    },
    {
      title: "Chips",
    },
    {
      title: "Pizza",
    },
    {
      title: "Broast",
    },
    {
      title: "Sandwich",
    },
  ];
  const [activeTab, setActiveTab] = useState("products");
  return (
    <div className="page">
      <div className="manage_order_head">
        <h3>Manage Product</h3>
        <div className="tabs mo_tabs">
          {activeTab === "products" ? (
            <button type="button" onClick={onOpen}>
              Filter
            </button>
          ) : (
            ""
          )}
          <button
            className={activeTab === "products" ? "active" : ""}
            onClick={() => setActiveTab("products")}
          >
            Products
          </button>
          <button
            className={activeTab === "categories" ? "active" : ""}
            onClick={() => setActiveTab("categories")}
          >
            Categories
          </button>
        </div>
      </div>
      <Filter btntitle="Filter" isOpen={isOpen} onClose={onClose} />
      <div className="manage_order_body">
        <div className="row">
          {activeTab == "products" ? (
            <div className="col-11">
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 row-cols-lg-5 g-3">
                <div className="col">
                  <ProductCards checked="true" />
                </div>
                <div className="col">
                  <ProductCards />
                </div>
                <div className="col">
                  <ProductCards />
                </div>
                <div className="col">
                  <ProductCards />
                </div>
                <div className="col">
                  <ProductCards />
                </div>
                <div className="col">
                  <ProductCards />
                </div>
                <div className="col">
                  <ProductCards />
                </div>
                <div className="col">
                  <ProductCards />
                </div>
                <div className="col">
                  <ProductCards />
                </div>
                <div className="col">
                  <ProductCards />
                </div>
              </div>
            </div>
          ) : (
            <div className="col-11">
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 row-cols-lg-5 g-3">
                {categories.map((category, index) => (
                  <div className="col" key={index}>
                    <CategoryCards title={category.title} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="row mt-4">
          <div className="col-11">
            <div className="pagination justify-content-end">
              <button className="active">1</button>
              <button>2</button>
              <button>3</button>
              <button>4</button>
              <button>&gt;&gt;</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageProduct;
