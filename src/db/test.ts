/*
    - Run using:
    npx tsx src/db/test.ts
*/
import { createTeam } from "./teams/operations";

const { error } = await createTeam({ 
    id: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Imc5dTZaYUdJbkk0YUM5bFpwMkM0UiJ9",
    team_name: "Beneva",
    contact_email: "mathisbeaudoin15@hotmail.com",
    contact_phone_number: "418 255-7097",
    contact_name: "Mathis Beaudoin"

});

console.log(error);