import { useState, useEffect } from 'react';
import './Style.css';
import { request, gql } from 'graphql-request'; 

function RankingTable({ latitude, longitude }: { latitude: number, longitude: number }) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [rankings, setRankings] = useState<string[]>([]);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in frontend .env");

        // Define GraphQL query
        const query = gql`
          query RankQuery($latitude: Float!, $longitude: Float!) {
            rank(latitude: $latitude, longitude: $longitude) {
              activity
              score
            }
          }
        `;

        // Send GraphQL query
        const data = await request<any>(
          `${backendUrl.replace(/\/$/, "")}/api`,
          query,
          { latitude, longitude }
        );
        setRankings(data.rank); // Access the 'rank' field from the GraphQL response

      } catch (err: any) {
        console.error("Failed to fetch GraphQL rankings:", err);
        setError(err.message || "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (latitude && longitude) {
      fetchRankings();
    }
  }, [latitude, longitude]);

  if (loading) {
    return <div className="ranking-table">Loading...</div>;
  }

  if (error) {
    return <div className="ranking-table" style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div className="ranking-table">
      <h1>Rankings</h1>
      <table>
        <thead>
          <tr>
            <th>Activity</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {rankings.map((ranking: any, index: number) => (
            <tr key={index}>
              <td>{ranking.activity}</td>
              <td>{ranking.score}/100</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RankingTable;