## How to use 🤚
----------

- run `npm install`
- run `npm run dev`


## Requirements ⚙️
----------

- NodeJS
- Git
- ESlint Extension - VSCode
- Prettier Extension - VScode

## Tech Stacks 🧩
- ExpressJS (Backend Framework)
- Knex (Query Builder - SQL Client)
- PG (Postgres Client)

## Folder Explanation 📁
- **src** => place your RESTApi (business logic, model, controller)
- **migrations** => place your migrations file (knex)
- **seeds** => place your seeds file (knex)

## Typescript Tips & Tricks 💡
----------
```typescript
// In common case you did not have to explicitly type on declare variable
const a: number = 1; // Good

const a = 1; // Better, because 'a' type automatically became number (See: Type Inference)
```
```typescript
// function parameter always must be explicitly have type
function sum(num1: number, num2: number): number {
  return num1 + num2;
}
```
```typescript
// object better to use interface
interface IPerson {
  firstName: string;
  lastName: string;
  gender: 'M' | 'F'; // Only Accept 'M' or 'F' (see: unions)
}

function welcomeMessage(person: IPerson): string {
  const prefixGender = person.gender === 'M' ? 'Mr.' : 'Mrs.';

  return `Hello ${prefixGender} ${person.firstName} ${person.lastName}`;
}

const johnDoe: IPerson = {
  firstName: 'John',
  lastName: 'Doe',
  gender: 'M'
};

console.log(welcomeMessage(johnDoe)); // Hello Mr. John Doe

```

## Motivation Quotes 🔥

> Feeling a litte uncomfortable with your skills is sign of learning, and continuous learning is what the tech industry thrives on!

--- Vanessa Hurst (Co-Founder of Girl Develop It)

<br/>

> “Failure is an option here. If things are not failing, you are not innovating enough.”

--- Elon Musk (Co-Founder of Tesla, SpaceX, etc)

<br/>

> “I knew that if I failed I wouldn’t regret that, but I knew the one thing I might regret is not trying.”

--- Jeff Bezos (Co-Founder of Amazon)