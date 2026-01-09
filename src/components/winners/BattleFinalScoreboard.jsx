"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import api from "@/lib/axios";
import VotingScores from "./VotingScores";
import PodiumItem from "./PodiumItem";

export default function BattleFinalScoreboard() {
    const searchParams = useSearchParams();
    const battleId = searchParams.get("battleId");
    const router = useRouter();
    const [leaderboard, setLeaderboard] = useState([]);
    const [winner, setWinner] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!battleId) return;

        const fetchBattle = async () => {
            try {
                const res = await api.get(`/battle/${battleId}`);
                const result = res.data;

                if (result.success) {
                    const sorted = result.data.participants
                        .map(p => ({
                            id: p.participant._id,
                            name: p.participant.name,
                            images: p.participant.images,
                            votes: p.vote.length
                        }))
                        // 🔥 SORT: highest votes FIRST
                        .sort((a, b) => b.votes - a.votes);

                    setLeaderboard(sorted);
                    setWinner(result.data.winner)
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
    if (loading) return <div className="text-center py-5">Loading final scores...</div>;
    return (
        <div className="battle-leaderboard my-5">
            <h4 className="fs-h4 mb-4">Final Scoreboard</h4>

            <div className="row align-items-center">

                {/* LEFT: PODIUM */}
                <div className="col-lg-6 text-center mb-4 mb-lg-0">
                    <div className="position-relative">

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
                                className="rn2"
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

                {/* RIGHT: ALL PARTICIPANTS */}
                <div className="col-lg-6">
                    <VotingScores leaderboard={leaderboard} />
                </div>

            </div>
        </div>
    );
}
