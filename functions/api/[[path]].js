// functions/api/[[path]].js
export async function onRequest(context) {
  return new Response(JSON.stringify({
    message: 'ArseneTheReviewer API',
    endpoints: {
      'POST /api/publish': 'Create new review',
      'POST /api/save-draft': 'Save draft',
      'GET /api/reviews': 'List all reviews'
    }
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
