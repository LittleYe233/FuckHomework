/** @type {import('./__types/[hw_id]').RequestHandler} */
export async function get({ params }) {
  /** @type {Required<import('~/lib/types').ProjectConfig>} */
  const cfg = __PROJECT_CONFIG__;
  const assignment = cfg.assignments[parseInt(params.hw_id) - 1];

  return {
    status: 200,
    // force to be a JSON object
    body: JSON.parse(
      JSON.stringify({
        hw_id: params.hw_id,
        metadata: assignment
      })
    )
  };
}
