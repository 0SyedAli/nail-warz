import Image from "next/image";

export default function CheckoutSummary() {
    return (
        <div className="checkout-summary">
            <div className="summary-item-container">
                {[1, 2].map((i) => (
                    <div key={i} className="summary-item">
                        <Image
                            src="/images/cart-img.png"
                            width={122}
                            height={122}
                            alt="Product"
                            className="summary-img"
                        />

                        <div className="flex-grow-1 ms-3">
                            <h6 className="fw-bold mb-1 ">Lorem ipsum dollor</h6>
                            <small className="text-muted d-block">Size: Large</small>
                            <small className="text-muted d-block">Color: White</small>
                        </div>

                        <strong className="ci-price">$145</strong>
                    </div>
                ))}
            </div>

            <div className="subtotal">
                <div className="d-flex justify-content-between mb-3">
                    <span>Subtotal</span>
                    <span>$1,095.00</span>
                </div>

                <div className="d-flex justify-content-between">
                    <span>Shipping</span>
                    <span className="text-muted">Calculated At Next Step</span>
                </div>
            </div>
            <div className="d-flex justify-content-between fw-bold fs-5 mt-3">
                <span>Total</span>
                <span>$1,095.00 USD</span>
            </div>

        </div>
    );
}
