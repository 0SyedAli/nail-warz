import Image from "next/image";

export default function BattleEntryCard() {
    return (
        <div className="battle-entry">

            <Image
                src="/images/prod_nail1.png"
                alt="Nail Art"
                width={160}
                height={160}
                className="img-fluid"
            />

            <div className="entry-footer">
                <span className="fw-bold">Sarah M.</span>
                <span>1,245 votes</span>
            </div>

            <div className="entry-progress">
                <div className="entry-bar"></div>
            </div>

        </div>
    );
}
