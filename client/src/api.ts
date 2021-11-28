interface HighScore {
  player: string;
  score: number;
}

export function getHighScores(): Promise<HighScore[]> {
  return myFetch("/api/high-score").then((response) => response.json());
}

export function createHighScore(body: HighScore) {
  return myFetch("/api/high-score", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  }).then(() => undefined);
}

/**
 * Rejects upon non-2XX (fetch doesn't do this!).
 */
function myFetch(input: string, init?: any) {
  return fetch(input, init).then((response) => {
    if (!response.ok) {
      throw new Error("Error from server");
    }
    return response;
  });
}
