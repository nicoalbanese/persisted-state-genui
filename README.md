This project demonstrates persistent state with a Generative UI chatbot. This project is intended to showcase how to use AI & UI State.

## Getting Started

You will need 

- an OpenAI API Key
- postgres db

Be sure to rename the `.env.example` to `.env` and add your secrets.

## Setting up project
First set up your db
```bash
pnpm drizzle-kit push
```


Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000/chat](http://localhost:3000/chat) with your browser to see the result.
