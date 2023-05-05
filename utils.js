import isUndefined from 'lodash/isUndefined';
import isEmpty from 'lodash/isEmpty';

/**
 * @returns {Promise<string>} The most recent release candidate, or null if there was an error.
 */
async function getMostRecentReleaseCandidateNumber(supabaseClient, tableName, {
  name,
  version,
  region,
  namespace
}) {
  let query = supabaseClient
    .from(tableName)
    .select('candidate')

  if (!isUndefined(name) && !isEmpty(name)) query = query.eq('name', name)
  if (!isUndefined(version) && !isEmpty(version)) query = query.eq('version', version)
  if (!isUndefined(region) && !isEmpty(region)) query = query.eq('region', region)
  if (!isUndefined(namespace) && !isEmpty(namespace)) query = query.eq('namespace', namespace)

  query.order('candidate', { ascending: false })
    .limit(1)

  try {
    const { data, queryError } = await query;
    console.info('Query fetched raw result:', data)

    if (queryError) {
      console.error('Error fetching most recent candidate:', queryError);
      throw queryError;
    }
    return data[0].candidate;
  } catch (error) {
    console.error('Error executing supabase query:', error);
    throw error;
  }
}

/**
 * @returns {Promise<string>} The most recent release candidate, or throw if there was an error.
 */
async function writeAReleaseRecord(supabaseClient, tableName, {
  name,
  version,
  candidate,
  region,
  namespace
}) {
  try {
    const { error: dataInsertionError } = await supabaseClient
      .from('released_versions')
      .insert({ name, version, candidate, region, namespace })

    if (dataInsertionError) {
      console.error('Error inserting a release record:', dataInsertionError);
      throw dataInsertionError;
    }
  } catch (error) {
    console.error('Error executing supabase query:', error);
    throw error;
  }
}

export {
  getMostRecentReleaseCandidateNumber,
  writeAReleaseRecord
}
