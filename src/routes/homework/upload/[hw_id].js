/** @type {import('./__types/[hw_id]').RequestHandler} */
export async function post({ params, request }) {
  /** @type {Blob} */
  const data = await request.blob();
  const dataText = await data.text();
  
  return {
    status: 200,
    body: {
      data: dataText,
      hw_id: params.hw_id
    }
  };
}
