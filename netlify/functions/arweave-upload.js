// Future: Arweave permanent archive upload endpoint
// This is a placeholder for Phase 5 of the roadmap.
//
// When implemented, this function will:
// 1. Receive scroll data from authenticated submissions
// 2. Upload content to Arweave via bundlr or irys
// 3. Return the Arweave transaction ID
// 4. Update the submission record with permanent archive status
//
// Required env vars:
// - ARWEAVE_KEY (base64-encoded Arweave wallet key)
// - BUNDLR_NODE (optional, defaults to https://node1.bundlr.network)

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Arweave upload endpoint placeholder. Implement in Phase 5.",
      status: "not_implemented",
    }),
  };
};
