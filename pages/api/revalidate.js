// This API route is used to trigger on-demand revalidation
export default async function handler(req, res) {
  // Check for secret to confirm this is a valid request
  if (req.query.secret !== "MY_SECRET_TOKEN") {
    return res.status(401).json({
      revalidated: false,
      message: "Invalid token",
    })
  }

  try {
    // This will trigger the revalidation of the home page
    await res.revalidate("/")
    console.log("Revalidated homepage successfully")

    return res.json({
      revalidated: true,
      message: "Homepage revalidated successfully",
    })
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).json({
      revalidated: false,
      message: "Error revalidating: " + err.message,
    })
  }
}
