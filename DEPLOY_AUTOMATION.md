# Web Auto Deploy (GitHub -> Vercel)

This repo includes `.github/workflows/deploy-vercel.yml`.
On every push to `main`/`master`, GitHub Actions deploys production to Vercel.

## 1) Add GitHub repo secrets

In GitHub -> `prompts34-web` -> Settings -> Secrets and variables -> Actions, add:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

How to get IDs:

- In Vercel project, run locally once inside `prompts34-web`:
  - `vercel link`
- Then open `.vercel/project.json` and copy:
  - `orgId` -> `VERCEL_ORG_ID`
  - `projectId` -> `VERCEL_PROJECT_ID`

## 2) Deploy

Push to `main` branch. Workflow will:

1. `vercel pull`
2. `vercel build --prod`
3. `vercel deploy --prebuilt --prod`

## 3) Notes

- If you already use Vercel Git integration, this workflow is still valid but duplicates deploy triggers.
- Keep only one deployment method if you want cleaner logs (either Vercel Git integration or this workflow).
