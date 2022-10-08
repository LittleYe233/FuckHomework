import fs from 'fs';
import path from 'path';
import { error, json } from '@sveltejs/kit';
import { cfg, parseVars } from '~/lib/config';
import type { FileUploadData } from '~/lib/types';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params, request }) => {
  const _opt = {
    homework: cfg.homework.entries[parseInt(params.hw_id)]
  };
  const data = await request.blob();
  const dataText = await data.text();
  const savePath = parseVars(cfg.homework.savePath, _opt);
  const subFolderPath = parseVars(cfg.homework.subFolderFormat, _opt);
  const subFolderFullPath = path.join(savePath, subFolderPath);

  /** @note make a directory to save files */
  // check if path exists
  let stat,
    flagExists = true;
  try {
    stat = fs.statSync(subFolderFullPath);
  } catch (e) {
    // not exists, make directory
    flagExists = false;
    try {
      fs.mkdirSync(subFolderFullPath, { recursive: true });
    } catch (e1) {
      // cannot make directory
      /**
       * @note specify a type
       * @see https://stackoverflow.com/a/69197391
       */
      const _e1 = e1 as Error;
      throw error(500, _e1.message);
    }
  }
  if (flagExists) {
    // exists, check if it is a directory
    if (!stat?.isDirectory()) {
      throw error(500, `homework subfolder path exists but is not a directory: ${subFolderFullPath}`);
    }
  }

  /** @note create files */
  const dataJSON: FileUploadData[] = JSON.parse(dataText);
  for (const d of dataJSON) {
    const fileFullPath = path.join(subFolderFullPath, d.name);
    fs.writeFileSync(fileFullPath, d.text64, { encoding: 'base64' });
  }

  return json({
    data: dataText,
    hw_id: params.hw_id
  });
};
