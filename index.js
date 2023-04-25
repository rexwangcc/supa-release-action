import * as core from '@actions/core';
import isNull from 'lodash/isNull';
import { getMostRecentReleaseCandidateNumber, writeAReleaseRecord } from './utils';

// most @actions toolkit packages have async methods
async function run() {
  try {
    // credential inputs and initialize supabase client
    const supabaseUrl = core.getInput('supabase-url');
    const supabaseKey = core.getInput('supabase-key');
    // core.setSecret('supabase-key');
    const supabaseClient = createClient(supabaseUrl, supabaseKey);

    // common inputs
    const tableName = core.getInput('table-name');
    const operation = core.getInput('operation');

    // inputs for query
    const name = core.getInput('name');
    const version = core.getInput('version');
    const region = core.getInput('region');
    const namespace = core.getInput('namespace');

    // specific inputs for insert
    const candidate = core.getInput('candidate');

    switch (operation) {
      case 'query':
        try {
          const mostRecentCandidate = await getMostRecentReleaseCandidateNumber(supabaseClient, tableName, {
            name,
            version,
            region,
            namespace
          })
          core.info(`Got most recent candidate: ${mostRecentCandidate}`);
          core.setOutput('most_recent_candidate', mostRecentCandidate);
        } catch (error) {
          core.setFailed(error.message);
        }
        break;
      case 'insert':
        try {
          const insertResult = await writeAReleaseRecord(supabaseClient, tableName, {
            name,
            version,
            candidate,
            region,
            namespace
          });
          core.info(`Inserted a release record successfully.`);
        } catch (error) {
          core.setFailed(error.message);
        }
        break;
      default:
        core.setFailed(`Invalid operation: ${operation}`);
        break;
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
