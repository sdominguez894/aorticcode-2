# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/ccedfa2e-ee49-437e-accf-d40f872888ed

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/ccedfa2e-ee49-437e-accf-d40f872888ed) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

If that did not work try: npm i --legacy-peer-deps
This tells npm to ignore peer dependency version mismatches and just install the packages.
It will work if there are not breaking changes, just version mismatches.

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase

## How to update the types in the app when there are changes in the schema?

Supabase allow us to generate full TypeScript definitions of the schema automatically.

To generate the schema types, install, log in into the Supabase CLI ([Supabase docs -> Generate types](https://supabase.com/docs/guides/api/generating-types) and execute the following commands:

```sh
# Install the Supabase CLI as a dev dependency
npm i supabase@">=1.8.1" --save-dev --legacy-peer-deps

# Login with your Personal Access Token
npx supabase login

# Generate the types
npx supabase gen types typescript --project-id wgwadotsgwhhqdgkcqbs --schema public > src/infrastructure/supabase/types.ts
```

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/ccedfa2e-ee49-437e-accf-d40f872888ed) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
