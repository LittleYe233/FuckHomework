import type { RequestHandler } from '~/../.svelte-kit/types/src/routes/homework/detail/__types/[hw_id]';
import type { ProjectConfig } from '~/lib/types';

export const get: RequestHandler = async ({ params }) => {
  const cfg: Required<ProjectConfig> = __PROJECT_CONFIG__;
  const assignment = cfg.assignments[parseInt(params.hw_id) - 1];

  return {
    status: 200,
    body: {
      hw_id: params.hw_id,
      // force to be a JSON object
      metadata: JSON.parse(JSON.stringify(assignment))
    }
  };
};
