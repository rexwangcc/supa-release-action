# SupaRelease GitHub Action

This GitHub Action helps manage release versions using Supabase as the storage backend. It supports querying the most recent release candidate and inserting new release records into a specified table.

## Usage

To use this action, first set up the required GitHub Secrets for your repository:

- `SUPABASE_URL`: The URL of your Supabase project.
- `SUPABASE_KEY`: The API key for your Supabase project.

Next, add the following to your GitHub workflow file:

```yaml
- name: Run SupaRelease Action
  uses: rexwangcc/supa-release-action@main
  with:
    supabase-url: ${{ secrets.SUPABASE_URL }}
    supabase-key: ${{ secrets.SUPABASE_KEY }}
    table-name: released_versions
    operation: query # or insert
    name: my-app
    version: 0.5.0
    candidate: 04251812
    region: aws-us-east-1
    namespace: staging
```

### Inputs

- `supabase-url`: The URL of your Supabase project. (required)
- `supabase-key`: The API key for your Supabase project. (required)
- `table-name`: The name of the table in Supabase to use for all operations. (required, default: 'released_versions')
- `operation`: The operation to perform on the table; either 'insert' or 'query'. (required)
- `name`: The name of the service to insert or query, e.g., 'my-app'. (optional)
- `version`: The version of the release to insert or query, e.g., '0.5.0'. (optional)
- `candidate`: The candidate of the release to insert in MMDDHHmm format, e.g., '04251812'. (optional)
- `region`: The fully-qualified region of the release to insert or query, e.g., 'aws-us-east-1'. (optional)
- `namespace`: The namespace of the release to insert or query; either 'staging' or 'prod'. (optional)

### Outputs

- `most_recent_candidate`: The most recent release candidate (only available when `operation` is set to 'query').

## For Contributors

We appreciate your interest in contributing to this GitHub Action! Please follow these guidelines to ensure a smooth contribution process.

### Change action.yml

The action.yml defines the inputs and output for your action. Change it as it may need.

See the official [documentation](https://docs.github.com/en/actions/creating-actions/metadata-syntax-for-github-actions)

### Change the Code

Most toolkit and CI/CD operations involve async operations so the action is run in an async function.

Most toolkit and CI/CD operations involve async operations so the action is run in an async function.

```js
const core = require('@actions/core');
...

async function run() {
  try {
      ...
  }
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
```

See the toolkit [documentation](https://github.com/actions/toolkit/blob/master/README.md#packages) for the various packages.

### Package for distribution

GitHub Actions will run the entry point from the action.yml. Packaging assembles the code into one file that can be checked in to Git, enabling fast and reliable execution and preventing the need to check in node_modules.

Actions are run from GitHub repos. Packaging the action will create a packaged action in the dist folder.

Run prepare

```bash
npm run prepare
```

Since the packaged index.js is run from the dist folder.

```bash
git add dist
```

### Create a release branch

Users shouldn't consume the action from master since that would be latest code and actions can break compatibility between major versions.

Checkin to the v1 release branch

```bash
git checkout -b v1
git commit -a -m "v1 release"
git push origin v1
```

Note: We recommend using the --license option for ncc, which will create a license file for all of the production node modules used in your project.

See the [versioning documentation](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md)
