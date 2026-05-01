const PLACE_ID = "ChIJg4fX0_wLhlQRbJ5qrb3lf-E";
const API_KEY  = "AIzaSyB24X4UEhUgt3ZxQrV9kNiv0JKXwoAetIA";

// Cache reviews in memory for 1 hour so you don't burn API calls
let cache = { data: null, ts: 0 };
const CACHE_MS = 60 * 60 * 1000; // 1 hour

exports.handler = async () => {
  const now = Date.now();

  if (cache.data && now - cache.ts < CACHE_MS) {
    return respond(200, cache.data);
  }

  const url =
    `https://maps.googleapis.com/maps/api/place/details/json` +
    `?place_id=${PLACE_ID}` +
    `&fields=rating,user_ratings_total,reviews` +
    `&reviews_sort=newest` +
    `&key=${API_KEY}`;

  try {
    const res  = await fetch(url);
    const json = await res.json();

    if (json.status !== "OK") {
      return respond(502, { error: json.status, message: json.error_message });
    }

    const result = json.result;

    // Only keep 5-star reviews with actual text, max 6
    const reviews = (result.reviews || [])
      .filter(r => r.rating === 5 && r.text && r.text.trim().length > 30)
      .slice(0, 6)
      .map(r => ({
        author : r.author_name,
        avatar : r.profile_photo_url,
        text   : r.text,
        rating : r.rating,
        time   : r.relative_time_description,
      }));

    const payload = {
      rating      : result.rating,
      total       : result.user_ratings_total,
      reviews,
    };

    cache = { data: payload, ts: now };
    return respond(200, payload);

  } catch (err) {
    return respond(500, { error: "fetch_failed", message: err.message });
  }
};

function respond(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type"                : "application/json",
      "Access-Control-Allow-Origin" : "*",
    },
    body: JSON.stringify(body),
  };
}
