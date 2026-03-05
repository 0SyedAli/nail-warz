"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import api from "@/lib/axios";
import ScoreRow from "./ScoreRow";
import BallsLoading from "../Spinner/BallsLoading";

export default function VotingScores() {
  const searchParams = useSearchParams();
  const battleId = searchParams.get("battleId"); // from URL

  const [participants, setParticipants] = useState([]);
  const [partId, setPartId] = useState(null);
  const [winner, setWinner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!battleId) return;

    const fetchBattleScores = async () => {
      try {
        const res = await api.get(`/battle/${battleId}`);
        const result = res.data;

        if (result.success) {
          // Sort by votes DESC
          setWinner(result.data.winner || null)
          setPartId(result.data._id || null)
          const sorted = result.data.participants
            .map(p => ({
              name: p.participant.name,
              votes: p.vote.length,
              images: p.participant.images
            }))
            .sort((a, b) => b.votes - a.votes);

          setParticipants(sorted);
        }
      } catch (error) {
        console.error("Failed to fetch voting scores", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBattleScores();
  }, [battleId]);

  if (loading) {
    return (
      <div className="page d-flex align-items-center" style={{ height: "100vh" }}>
        <BallsLoading borderWidth="mx-auto" />
      </div>
    );
  }

  return (
    <div className="voting-score-container">
      <h4 className="mb-3">Live Voting Scores</h4>

      <div className="voting-box py-3 position-relative">
        <div>
          {participants.map((item, index) => (
            <ScoreRow
              key={index}
              name={item.name}
              score={item.votes}
              img={item.images}
            />
          ))}
        </div>
        {winner &&
          <Link href={`/winners?battleId=${partId}`} className="btn active-battle-btn">
            VIEW THE NAIL CHAMPION
          </Link>
        }
      </div>
      <div className="text-center mt-5">
        <Link href={`/nailwarz`} className="btn active-battle-btn2">
          Go Back
        </Link>
      </div>
    </div>
  );
}
