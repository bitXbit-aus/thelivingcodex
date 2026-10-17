// Future: Admin authentication placeholder
// This is a placeholder for Phase 2+ moderation and admin features.
//
// When implemented, this function will:
// 1. Verify JWT or session token from Netlify Identity
// 2. Check admin role claims
// 3. Return authenticated admin status
//
// Required env vars:
// - JWT_SECRET or Netlify Identity settings

exports.handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  return {
    statusCode: 401,
    body: JSON.stringify({
      message: "Admin authentication not yet implemented.",
      status: "not_implemented",
    }),
  };
};
