import type { RequestHandler } from '~/../.svelte-kit/types/src/routes/homework/upload/__types/[hw_id]';

export const post: RequestHandler = async ({ params, request }) => {
  const data = await request.blob();
  const dataText = await data.text();

  return {
    status: 200,
    body: {
      data: dataText,
      hw_id: params.hw_id
    }
  };
};
