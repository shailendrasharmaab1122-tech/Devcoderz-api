export default async function handler(req, res) {
  const response = await fetch("https://msnjeetnew.vercel.app/api/batches");
  const data = await response.json();
  res.status(200).json(data);
}
