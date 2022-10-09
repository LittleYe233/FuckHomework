import { cfg } from '~/lib/config';
import type { HomeworkMetadata } from '~/lib/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
  const assignment = cfg.homework.entries[parseInt(params.hw_id)];

  return {
    hw_id: params.hw_id,
    // force to be a JSON object
    metadata: JSON.parse(JSON.stringify(assignment)) as HomeworkMetadata
  };
};
