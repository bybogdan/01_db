# Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.

## Some commands

### Prisma

- `npx prisma generate` - before starting work with prisma
- `npx prisma db push` - to push something to scheme.prisma to db
- `npx prisma studio` - watch db tables

### Planetscale

- `pscale connect 01_db main --port 3309` to start planetscale db in local

# TODO

- FIND API WHICH RETURN CURRENCY NAMES (DONE)
- Add useform (DONE)
- Add types of transactions food, rent, etc.
- Try to add ssr, to get page with data immediately
- Prisma pagination with records, not load all
- Update view faster after api calls (DONE)
- Add datepicker field to form to get ability to user to set record not for today day
- Consider using of src/TrpcContext/index.tsx (DONE (remove it))
- Add ability to get records from selected period of time
- Add page with many stats to see different info about financial profile
- PWA?
- Try to use answer from api, to save time to not to call refetch
- Try in GetServerSideProps to use trpc by context as in server/trpc/record (DONE)(BUT NOT SURE) (IT WAS MISTAKE)
  `To use GetServerSideProps you should have very good reason. In general it make app slower, because GetServerSideProps is blocking. (getStaticProps and getStaticPaths work better in most cases)`

- should end rewriting from GetServerSideProps to getStaticProps and getStaticPaths (DONE)
- on record page need to raise buttons, for easier interaction with them (DONE)
- Try to add middelware to detect have user right or not, on records pages
- Add ability to set month where record should be include (transfer in december, but it relate to november)
