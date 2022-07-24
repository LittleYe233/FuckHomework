import { cfg } from '~/lib/config';
import type { RequestHandler } from '~/../.svelte-kit/types/src/routes/homework/detail/__types/[hw_id]';

export const get: RequestHandler = async ({ params }) => {
  const assignment = cfg.homework.entries[parseInt(params.hw_id) - 1];

  return {
    status: 200,
    body: {
      hw_id: params.hw_id,
      // force to be a JSON object
      metadata: JSON.parse(JSON.stringify(assignment))
    }
  };
};
