## Requirements

- mongodb
- yarn/npm 
  
## Getting Started



First, copy `.env.example` and edit the `.env.local` file if your mongo settings are different than the default

```bash
cp .env.example .env.local
```


install dependencies & run the development server:
```bash
npm install
npm run dev
# or
yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
or visit the [deployed version](https://my-next-app-lac-theta.vercel.app/).

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.
or create a PR to automaticaly deploy your edits on a new page online

## TODO & Sugestions (chalenge part3)
- data model is designed with a relational database in mind if that is not a strong requirement switching ton a NOSQL database will greatly simplify the model and circumvent the actual restriction for example limited attribute types ( handle other atribute types number,list,object )
- add tests (backend supertest / frontend cypres)
- backend data validation
- improve ui
- remove the attribue display table move create attribute to product_type page
- recursive deletes from db