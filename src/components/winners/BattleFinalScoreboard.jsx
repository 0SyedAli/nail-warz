// "use client";

// import { useEffect, useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import Image from "next/image";
// import api from "@/lib/axios";
// import VotingScores from "./VotingScores";
// import PodiumItem from "./PodiumItem";
// import BallsLoading from "../Spinner/BallsLoading";

// export default function BattleFinalScoreboard() {
//     const searchParams = useSearchParams();
//     const battleId = searchParams.get("battleId");
//     const router = useRouter();
//     const [leaderboard, setLeaderboard] = useState([]);
//     const [winner, setWinner] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         if (!battleId) return;

//         const fetchBattle = async () => {
//             try {
//                 const res = await api.get(`/battle/${battleId}`);
//                 const result = res.data;

//                 if (result.success) {
//                     const sorted = result.data.participants
//                         .map(p => ({
//                             id: p.participant._id,
//                             name: p.participant.name,
//                             images: p.participant.images,
//                             votes: p.vote.length
//                         }))
//                         // 🔥 SORT: highest votes FIRST
//                         .sort((a, b) => b.votes - a.votes);

//                     setLeaderboard(sorted);
//                     setWinner(result.data.winner)
//                 }
//             } catch (err) {
//                 console.error("Failed to fetch battle", err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchBattle();
//     }, [battleId]);


//     useEffect(() => {
//         if (!loading && !winner) {
//             router.push("/nailwarz");
//         }
//     }, [winner, loading, router]);
//     if (loading) return (
//         <div className="page d-flex align-items-center" style={{ height: "100vh" }}>
//             <BallsLoading borderWidth="mx-auto" />
//         </div>
//     );
//     return (
//         <div className="battle-leaderboard my-5">
//             <h4 className="fs-h4 mb-4">Final Scoreboard</h4>

//             <div className="row align-items-center">

//                 {/* LEFT: PODIUM */}
//                 <div className="col-lg-6 text-center mb-4 mb-lg-0">
//                     <div className="position-relative">

//                         <Image
//                             src="/images/reward-stage.png"
//                             alt="Podium"
//                             width={534}
//                             height={553}
//                             className="img-fluid"
//                         />
//                         {/* 🥇 1st PLACE — CENTER */}
//                         {leaderboard[1] && (
//                             <PodiumItem
//                                 data={leaderboard[1]}
//                                 className="rn1"
//                             />
//                         )}

//                         {/* 🥈 2nd PLACE — LEFT */}
//                         {leaderboard[0] && (
//                             <PodiumItem
//                                 data={leaderboard[0]}
//                                 className="rn2 text-danger"
//                             />
//                         )}

//                         {/* 🥉 3rd PLACE — RIGHT */}
//                         {leaderboard[2] && (
//                             <PodiumItem
//                                 data={leaderboard[2]}
//                                 className="rn3"
//                             />
//                         )}
//                     </div>
//                 </div>

//                 {/* RIGHT: ALL PARTICIPANTS */}
//                 <div className="col-lg-6">
//                     <div className="d-flex align-items-center justify-content-center mb-3">
//                         <Image src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${winner?.images[0]}`} alt="Podium" width={150} height={150} className="img-fluid rounded-circle" style={{ width: "150px", height: "150px", objectFit: "cover", border: "5px solid #ffd7d7", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }} />
//                     </div>
//                     <VotingScores leaderboard={leaderboard} />
//                 </div>

//             </div>
//         </div>
//     );
// }


"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import api from "@/lib/axios";
import VotingScores from "./VotingScores";
import PodiumItem from "./PodiumItem";
import BallsLoading from "../Spinner/BallsLoading";

export default function BattleFinalScoreboard() {
    const searchParams = useSearchParams();
    const battleId = searchParams.get("battleId");
    const router = useRouter();

    const [leaderboard, setLeaderboard] = useState([]);
    const [winner, setWinner] = useState(null);
    const [loading, setLoading] = useState(true);
    const [previewOpen, setPreviewOpen] = useState(false);

    useEffect(() => {
        if (!battleId) return;

        const fetchBattle = async () => {
            try {
                const res = await api.get(`/battle/${battleId}`);
                const result = res.data;

                if (result.success) {
                    const sorted = result.data.participants
                        .map((p) => ({
                            id: p.participant._id,
                            name: p.participant.name,
                            images: p.participant.images,
                            votes: p.vote.length,
                        }))
                        .sort((a, b) => b.votes - a.votes);

                    setLeaderboard(sorted);
                    setWinner(result.data.winner);
                }
            } catch (err) {
                console.error("Failed to fetch battle", err);
            } finally {
                setLoading(false);
            }
        };

        fetchBattle();
    }, [battleId]);

    useEffect(() => {
        if (!loading && !winner) {
            router.push("/nailwarz");
        }
    }, [winner, loading, router]);

    if (loading) {
        return (
            <div className="page d-flex align-items-center" style={{ height: "100vh" }}>
                <BallsLoading borderWidth="mx-auto" />
            </div>
        );
    }

    const winnerImage = winner?.images?.[0]
        ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${winner.images[0]}`
        : "/images/warz-dummy.png";

    return (
        <>
            <div className="battle-leaderboard my-5">
                <h4 className="fs-h4 mb-4">Final Scoreboard</h4>

                <div className="row align-items-center">
                    {/* LEFT: PODIUM */}
                    <div className="col-lg-6 text-center mb-4 mb-lg-0">
                        <div className="position-relative final-podium">
                            <Image
                                src="/images/reward-stage.png"
                                alt="Podium"
                                width={534}
                                height={553}
                                className="img-fluid"
                            />

                            {/* 🥇 1st PLACE — CENTER */}
                            {leaderboard[1] && (
                                <PodiumItem
                                    data={leaderboard[1]}
                                    className="rn1"
                                />
                            )}

                            {/* 🥈 2nd PLACE — LEFT */}
                            {leaderboard[0] && (
                                <PodiumItem
                                    data={leaderboard[0]}
                                    className="rn2 text-danger"
                                />
                            )}

                            {/* 🥉 3rd PLACE — RIGHT */}
                            {leaderboard[2] && (
                                <PodiumItem
                                    data={leaderboard[2]}
                                    className="rn3"
                                />
                            )}
                        </div>
                    </div>

                    {/* RIGHT: WINNING SUBMISSION + ALL PARTICIPANTS */}
                    <div className="col-lg-6">
                        <div className="d-flex flex-column align-items-center justify-content-center mb-3">
                            <button
                                type="button"
                                onClick={() => setPreviewOpen(true)}
                                className="border-0 bg-transparent p-0"
                                style={{ cursor: "pointer" }}
                                aria-label="View winning submission"
                            >
                                <Image
                                    src={winnerImage}
                                    alt="Winning Submission"
                                    width={180}
                                    height={180}
                                    className="img-fluid"
                                    style={{
                                        width: "180px",
                                        height: "180px",
                                        objectFit: "cover",
                                        borderRadius: "12px",
                                        border: "5px solid #ffd7d7",
                                        boxShadow: "0 0 10px rgba(0, 0, 0, 0.15)",
                                    }}
                                />
                            </button>

                            <small className="mt-2 text-muted">
                                Click image to view winning work
                            </small>
                        </div>

                        <VotingScores leaderboard={leaderboard} />
                    </div>
                </div>
            </div>

            {/* IMAGE PREVIEW MODAL */}
            {previewOpen && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                    style={{
                        background: "rgba(0, 0, 0, 0.75)",
                        zIndex: 9999,
                        padding: "20px",
                    }}
                    onClick={() => setPreviewOpen(false)}
                >
                    <div
                        className="position-relative"
                        style={{
                            maxWidth: "90vw",
                            maxHeight: "90vh",
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={() => setPreviewOpen(false)}
                            className="btn btn-light position-absolute"
                            style={{
                                top: "-45px",
                                right: "0",
                                borderRadius: "50%",
                                width: "36px",
                                height: "36px",
                                padding: "0",
                            }}
                            aria-label="Close preview"
                        >
                            ×
                        </button>

                        <Image
                            src={winnerImage}
                            alt="Winning Submission Preview"
                            width={700}
                            height={700}
                            className="img-fluid"
                            style={{
                                maxWidth: "90vw",
                                maxHeight: "85vh",
                                objectFit: "contain",
                                borderRadius: "12px",
                                background: "#fff",
                            }}
                        />
                    </div>
                </div>
            )}
        </>
    );
}